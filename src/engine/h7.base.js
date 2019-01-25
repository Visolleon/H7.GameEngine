var H7 = H7 || {};

H7.Base = {
    // URL处理
    url: {

        queryString: document.location.search,

        // 查询Key值
        query: function(key) {
            return decodeURIComponent((this.queryString.match(new RegExp("(?:^\\?|&)" + key + "=(.*?)(?=&|$)")) || ['', ''])[1]);
        }
    },

    // 本地缓存
    cache: {
        storage: window.localStorage,

        // 设置缓存数据
        set: function(name, data) {
            var str = data;
            if (typeof str != "string") {
                str = JSON.stringify(data)
            }
            if (this.storage) {
                this.storage.setItem(name, str);
            } else {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + 30);
                document.cookie = name + "=" + escape(str) + ";expires=" + exdate.toGMTString(); // + ";path=/";
            }
        },

        // 清除缓存数据
        remove: function(name) {
            if (this.storage) {
                this.storage.removeItem(name);
            } else {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() - 1);
                document.cookie = name + "=1;expires=" + exdate.toGMTString() + ";path=/";
            }
        },

        // 获取缓存数据
        get: function(name) {
            var data = '';
            if (this.storage) {
                data = this.storage.getItem(name);
            } else {
                if (document.cookie.length > 0) {
                    var start = document.cookie.indexOf(name + "=")
                    if (start != -1) {
                        start = start + name.length + 1
                        var end = document.cookie.indexOf(";", start)
                        if (end == -1) {
                            end = document.cookie.length
                        }
                        data = unescape(document.cookie.substring(start, end))
                    }
                }
            }
            if (data) {
                try {
                    return JSON.parse(data);
                } catch (e) {

                }
            }
            return data;
        }
    },

    ajax: function(p) {
        var xhr = new XMLHttpRequest();
        if (p.url) {
            p.type = p.type || "get";
            if (p.type && p.type.toUpperCase() == 'POST') {
                p.type = 'POST';
            } else if (p.type && p.type.toUpperCase() == 'UPDATE') {
                p.type = 'UPDATE';
            } else if (p.type && p.type.toUpperCase() == 'DELETE') {
                p.type = "DELETE";
            } else if (p.type && p.type.toUpperCase() == 'PUT') {
                p.type = 'PUT';
            } else {
                p.type = 'GET';
            }
            if (p.async) {
                p.async = true;
            } else {
                p.async = false;
            }
            xhr.timeout = p.timeout;
            xhr.ontimeout = function() {
                p.ontimeout && p.ontimeout.apply(this, arguments);
            };

            xhr.onerror = p.error;

            xhr.onload = function(e) {
                var xhr = e.currentTarget;
                if (xhr.status == 200) {
                    p.success && p.success(JSON.parse(xhr.response));
                } else {
                    p.error && p.error(xhr);
                }
                p.complete && p.complete();
            };

            if (p.beforeSend) {
                p.beforeSend();
            }

            // xhr.open(p.type, p.url, p.async);
            xhr.open(p.type, p.url);

            p.headers = {};

            if (!p.headers["Content-Type"]) {
                if (p.dataType == "json") {
                    p.headers["Content-Type"] = "application/x-www-form-urlencoded";
                } else {
                    p.headers["Content-Type"] = "text/plain";
                }
            }
            p.headers["Accept"] = "application/json, text/javascript, */*";

            if (!p.crossDomain && !p.headers["X-Requested-With"]) {
                p.headers["X-Requested-With"] = "XMLHttpRequest";
                xhr.withCredentials = true;
            }

            for (var k in p.headers) {
                xhr.setRequestHeader(k, p.headers[k]);
            }
            if (p.xhrFields) {
                for (var n in p.xhrFields) {
                    xhr[n] = p.xhrFields[n];
                }
            }

            var sendData = [];
            for (var k in p.data) {
                sendData.push([k, p.data[k]].join("="));
            }
            xhr.send(sendData.join("&"));
        }
    },

    // 获取JSON格式
    jsonp: function(url, callback, complete) {
        var rNumber = '_';
        var reg = /[\?\&]callback=([_\-a-zA-Z0-9]*)/;
        if (!reg.test(url)) {
            for (var i = 0; i < 10; i++) {
                rNumber += Math.floor(Math.random() * 10);
            };
            url.indexOf('?') != -1 ?
                url += '&callback=' + rNumber :
                url += '?callback=' + rNumber;
        } else {
            var m = reg.exec(url);
            if (m && m.length > 1) {
                rNumber = m[1];
            }
        }

        window[rNumber] = function(data) {
            if (this.fn) this.fn(eval(data));
            delete window[this.fnName];
        }.bind({ fn: callback, fnName: rNumber });

        var script = document.createElement("script")
        script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(script);
        script.onload = function() {
            complete && complete();
            script.remove();
        };
        script.onerror = function(e) {
            console.log('LoadScript error, url : ' + url);
        };
        script.src = url;
    },

    /**
     * 载入图片
     */
    loadImage: function(url, callback) {
        var image = H7.Texture.get(url);
        if (!image) {
            image = new Image();
            image.onload = function() {
                H7.Texture.add(url, this);
                callback && callback.call(this, true);
            };
            image.onerror = function() {
                callback && callback.call(this, false);
            };
            image.src = url;
        } else {
            H7.Thread.delay(function() {
                callback && callback.call(image, true);
            }, 0);
        }
        return image;
    },

    /**
     * 载入资源
     */
    loadResource: function(list, every, complete) {
        var count = 0,
            all = 0;
        var everyCallback = function() {
            count++;
            every && every(count, all);
            if (count == all) {
                complete && complete();
            }
        };
        var resLen = list.length;
        for (var i = 0; i < resLen; i++) {
            var r = list[i];
            var rList = r.split(".");
            var extName = rList[rList.length - 1].toLowerCase();
            if (extName == "jpg" || extName == "png" || extName == "webp") {
                all++;
                this.loadImage(r, function() {
                    everyCallback();
                });
            } else if (extName == "json") {
                all++;
                H7.Texture.load(r, everyCallback);
            } else if (extName == "mp3" || extName == "ogg") {
                all++;
                H7.Audio.load(r, r, everyCallback);
            }
        }
    },

    // 创建画布
    createCanvas: function(obj) {
        var canvas = null;
        if (!obj) {
            canvas = document.createElement("canvas");
        } else if (obj.constructor == String) {
            canvas = document.querySelector(obj);
        } else if (obj.constructor == HTMLCanvasElement) {
            canvas = obj;
        } else {
            canvas = document.createElement("canvas");
        }
        // document.body.appendChild(canvas);
        return canvas.getContext("2d");
    },

    /**
     * 获取截图图像
     */
    cutImage: function(canvas, x, y, w, h) {
        var ctx = this._base64CacheCtx
        if (!ctx) {
            ctx = this.createCanvas();
            this._base64CacheCtx = ctx;
        }
        var ow = w,
            oh = h;
        x *= (H7.Game.retina ? 2 : 1);
        y *= (H7.Game.retina ? 2 : 1);
        w *= (H7.Game.retina ? 2 : 1);
        h *= (H7.Game.retina ? 2 : 1);
        ctx.canvas.width = ow;
        ctx.canvas.height = oh;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(canvas, x, y, w, h, 0, 0, ow, oh);
        return ctx.canvas;
    },

    // 判断坐标是否在区域内
    checkIsInRect: function(x, y, width, height, startX, startY, endX, endY) {
        // if (x >)
    },

    // 渲染节点到画布上
    // noCheck: 是否不检查出界
    render: function(ctx, node, t, noCache, noCheck) {
        var that = this;
        if (!noCheck) {
            // TODO: 判断是否出界(需考虑角度旋转)
            if (node.target && node.target.type == "SV_Layer" && node.target.target instanceof H7.ScrollView && !node.target.target.dirtyDraw) {
                // 如果是ScrollView, 出界的元素不用绘制
                // 只用判断ScrollView的layer子元素即可,下级子元素自动抛弃
                var sv = node.target.target;
                var svPos = sv.getAbsolutePos();
                var svSize = sv.getRealSize();
                var nodePos = node.getAbsolutePos();
                var nodeSize = node.getRealSize();
                // X轴是否包含
                var isXIn = (nodePos.x >= svPos.x && nodePos.x <= svPos.x + svSize.width) || ((nodePos.x + nodeSize.width) >= svPos.x && (nodePos.x + nodeSize.width) <= svPos.x + svSize.width);
                // 另外一种: 子节点包含了父节点
                if (!isXIn) {
                    if (nodePos.x < svPos.x && (nodePos.x + nodeSize.width) > svPos.x + svSize.width) {
                        isXIn = true;
                    }
                }
                var isYIn = (nodePos.y >= svPos.y && nodePos.y <= svPos.y + svSize.height) || (nodePos.y + nodeSize.height >= svPos.y && nodePos.y + nodeSize.height <= svPos.y + svSize.height);
                if (!isYIn) {
                    if (nodePos.y < svPos.y && (nodePos.y + nodeSize.height) > svPos.y + svSize.height) {
                        isYIn = true;
                    }
                }
                if (!isXIn || !isYIn) {
                    return;
                }
            }
        }

        var isRender = true;

        // 判断是否被销毁
        if (node.__destroy) {
            isRender = false;
        }

        // 判断是否显示
        if (!node.visible) {
            isRender = false;
        }
        // 判断透明度是否为0
        if (node.opacity <= 0) {
            isRender = false;
        }
        // 判断缩放是否为0
        if (node.scaleX == 0 || node.scaleY == 0) {
            isRender = false;
        }
        // if (node.width == 0 || node.height == 0) {
        //     isRender = false;
        // }

        t = t || 0;

        node.update.call(node, t);

        if (isRender) {
            var deleteChildList = [];
            if (node instanceof H7.Scene) {
                if (node.__pre) {
                    // 倒叙排列
                    node._childrenList.sort(function(n1, n2) {
                        return n1.index - n2.index;
                    });
                    node.culSize();
                    node.__pre = false;
                }
                // 子元素绘制
                var childLen = node._childrenList.length;
                for (var i = 0; i < childLen; i++) {
                    var nc = node._childrenList[i];
                    if (nc.node.__destroy) {
                        deleteChildList.push(nc.node);
                    } else {
                        arguments.callee(ctx, nc.node, t, noCache, noCheck);
                    }
                }
            } else {
                var deg = Math.PI / 180;
                ctx.save();
                if (node.skewX != 0 || node.skewY != 0) {
                    ctx.transform(node.scaleX, node.skewX * deg, node.skewY * deg, node.scaleY, node.x * (H7.Game.retina ? 2 : 1), node.y * (H7.Game.retina ? 2 : 1));
                } else {
                    // 原点处理
                    ctx.translate(node.x * (H7.Game.retina ? 2 : 1), node.y * (H7.Game.retina ? 2 : 1));
                    // 旋转处理
                    if (node.rotate) ctx.rotate(node.rotate * deg);
                    // 缩放处理
                    if (node.scaleX != 1 || node.scaleY != 1) ctx.scale(node.scaleX, node.scaleY);
                }
                // 透明度
                if (node.opacity >= 0 && node.opacity <= 1) {
                    ctx.globalAlpha = node.opacity;
                } else if (node.opacity > 1) {
                    ctx.globalAlpha = 1;
                } else {
                    ctx.globalAlpha = 0;
                }
                // 填充颜色
                if (node.fillColor) {
                    ctx.fillStyle = node.fillColor;
                }
                if (!noCache && node.isCached && node._cacheCtx) {
                    var pos = node.getPos();
                    ctx.drawImage(node._cacheCtx.canvas, pos.x, pos.y);
                } else {
                    node.render.call(node, ctx);
                    if (node.__pre) {
                        // 倒叙排列
                        node._childrenList.sort(function(n1, n2) {
                            return n1.index - n2.index;
                        });
                        node.culSize();
                        node.__pre = false;
                    }
                    // 子元素绘制
                    var childLen = node._childrenList.length;
                    for (var i = 0; i < childLen; i++) {
                        var nc = node._childrenList[i];
                        if (nc.node.__destroy) {
                            deleteChildList.push(nc.node);
                        } else {
                            arguments.callee(ctx, nc.node, t, noCache, noCheck);
                        }
                    }
                }
                ctx.restore();
            }
            if (deleteChildList.length > 0) {
                // 绘制完成后删除弃用的元素
                for (var i = node._childrenList.length - 1; i >= 0; i--) {
                    var nc = node._childrenList[i];
                    for (var j = deleteChildList.length - 1; j >= 0; j--) {
                        var nn = deleteChildList[j];
                        if (nc.node == nn) {
                            node._childrenList.splice(i, 1);
                            H7.Base.removeChild(node, nc.node);
                        }
                    }
                }
            }
        }
    },

    // 删除子元素附带
    removeChild: function(parent, node) {
        (function(nn) {
            if (nn) {
                if (nn._input) {
                    document.body.removeChild(nn._input);
                }
                if (nn._childrenList) {
                    for (var i = nn._childrenList.length - 1; i >= 0; i--) {
                        arguments.callee(nn._childrenList[i].node);
                    }
                }
            }
        })(node);
        node = null;
        (function(node) {
            if (node.autoSize) {
                var size = node.getRealSize();
                node.width = size.width;
                node.height = size.height;
            }
            if (node.target) {
                arguments.callee.call(node.target, node.target);
            }
        })(parent);
    }
};