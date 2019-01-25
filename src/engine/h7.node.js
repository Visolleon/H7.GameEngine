var H7 = H7 || {};

/**
 * 根节点
 */
H7.Node = function() {
    // 节点ID
    this.id = "";
    this.type = "Node";
    // 父级对象
    this.target = null;
    this.autoSize = true;
    // 坐标
    this._x = 0;
    this._y = 0;
    // 旋转角度
    this.rotate = null;
    // 填充颜色
    this.fillColor = null;
    // 缩放 (如果为数组，则scaleX, scaleY)
    this.scaleX = 1;
    this.scaleY = 1;
    // 是否显示
    this.visible = true;
    // 透明度
    this.opacity = 1;
    // 锚点
    this.anchorX = .5;
    this.anchorY = .5;
    // 斜切
    this.skewX = 0;
    this.skewY = 0;
    // // 宽度
    // this._width = 0;
    // // 高度
    // this._height = 0;
    // 所有的子元素
    this._childrenList = [];
    // 是否绘制轮廓
    this._isDrawRect = !!0;
    // 渲染函数
    this._renderList = [];
    // 事件
    this._events = {};
    // 事件吞噬
    this.swallow = false;

    var initRenderFn = function(ctx) {
        if (this._isDrawRect || H7.Game._isDebug) {
            var pos = this.getPos();
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.lineWidth = 2 * (H7.Game.retina ? 2 : 1);
            ctx.strokeStyle = "#00FF00";
            ctx.fillStyle = "rgba(0,255,0,0.2)";
            ctx.fillRect(pos.x, pos.y, this.width * (H7.Game.retina ? 2 : 1), this.height * (H7.Game.retina ? 2 : 1));
            ctx.strokeRect(pos.x, pos.y, (this.width || this._width || 2) * (H7.Game.retina ? 2 : 1), (this.height || this._height || 2) * (H7.Game.retina ? 2 : 1));

            ctx.beginPath();
            ctx.arc(0, 0, Math.PI * 2 * (H7.Game.retina ? 2 : 1), 0, Math.PI * 2 * (H7.Game.retina ? 2 : 1), true);
            ctx.fillStyle = "#FF0000";
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    };
    initRenderFn.type = "originRender";
    this._renderList.push(initRenderFn);

    // 属性设置
    this.attr = function(p) {
        // if (p.x) this.x = p.x;
        // if (p.y) this.y = p.y;
        // if (p.anchor) this.anchor = p.anchor;
        // if (p.anchorX) this.anchorX = p.anchorX;
        // if (p.anchorY) this.anchorY = p.anchorY;
        // if (p.width) this.width = p.width;
        // if (p.height) this.height = p.height;
        // if (p.scale) this.scale = p.scale;
        // if (p.scaleX) this.scaleX = p.scaleX;
        // if (p.scaleY) this.scaleY = p.scaleY;
        // if (p.visible) this.visible = p.visible;
        // if (p.opacity) this.opacity = p.opacity;
        // if (p.rotate) this.rotate = p.rotate;
        // if (p.fillColor) this.fillColor = p.fillColor;
        // if (p.id) this.id = p.id;
        for (var k in p) {
            this[k] = p[k];
        }
    };

    // 获取相对位移
    this.getPos = function() {
        return {
            x: -(this.width || 10) * this.anchorX * (H7.Game.retina ? 2 : 1),
            y: -(this.height || 10) * this.anchorY * (H7.Game.retina ? 2 : 1)
        };
    };

    // 销毁对象
    this.destroy = function() {
        this.__destroy = true;
    };

    // 定义读写属性
    this.define = function(name, params) {
        Object.defineProperty(this, name, params);
    };

    // 绘制更新列表
    this._updateList = [];

    // 绘制更新
    this.define("update", {
        get: function() {
            return function(t) {
                // var updateList = this._updateList.cancat([]);
                // for (var i = 0; i < updateList.length; i++) {
                // var updateList = this._updateList;
                // for (var i = updateList.length - 1; i <= 0; i--) {
                var len = this._updateList.length;
                for (var i = 0; i < len; i++) {
                    var fn = this._updateList[i];
                    fn && fn.apply(this, arguments);
                }
            };
        },
        set: function(fn) {
            if (fn instanceof Function) {
                this._updateList.push(fn);
            } else {
                throw "args err"
            }
        }
    });

    // 清除update方法
    this.removeUpdate = function(fn) {
        var updateLen = this._updateList.length;
        for (var i = 0; i < updateLen; i++) {
            if (this._updateList[i] == fn) {
                this._updateList.splice(i, 1);
                break;
            }
        }
    };

    // 定义X
    this.define("x", {
        get: function() {
            return this._x;
        },
        set: function(v) {
            this._x = v;
        }
    });

    this.define("y", {
        get: function() {
            return this._y;
        },
        set: function(v) {
            this._y = v;
        }
    });

    this.define("width", {
        get: function() {
            if (!this._width) {
                return this.realWidth;
            }
            return this._width;
        },
        set: function(v) {
            this._width = v || 0;
        }
    });

    this.define("height", {
        get: function() {
            if (!this._height) {
                return this.realHeight;
            }
            return this._height;
        },
        set: function(v) {
            this._height = v || 0;
        }
    });

    // 设置Scale属性
    this.define("scale", {
        get: function() {
            return [this.scaleX, this.scaleY];
        },
        set: function(value) {
            if (typeof value == "number") {
                this.scaleX = value;
                this.scaleY = value;
                return;
            }
            if (value instanceof Array && value.length == 2) {
                this.scaleX = value[0];
                this.scaleY = value[1];
                return;
            }
            throw "args err";
        }
    });

    // 设置anchor属性
    this.define("anchor", {
        get: function() {
            return [this.anchorX, this.anchorY];
        },
        set: function(value) {
            if (typeof value == "number") {
                this.anchorX = value;
                this.anchorY = value;
                return;
            }
            if (value instanceof Array && value.length == 2) {
                this.anchorX = value[0];
                this.anchorY = value[1];
                return;
            }
            throw "args err";
        }
    });

    // 设置Skew属性
    this.define("skew", {
        get: function() {
            return [this.skewX, this.skewY];
        },
        set: function(value) {
            if (typeof value == "number") {
                this.skewX = value;
                this.skewY = value;
                return;
            }
            if (value instanceof Array && value.length == 2) {
                this.skewX = value[0];
                this.skewY = value[1];
                return;
            }
            throw "args err";
        }
    });

    // 获取子元素
    this.define("children", {
        get: function() {
            var chs = [];
            this._childrenList.forEach(function(n) {
                chs.push(n.node);
            });
            return chs;
        }
    });

    // 绘制
    this.define("render", {
        get: function() {
            return function(ctx) {
                var originRendFN;
                for (var i = 0; i < this._renderList.length; i++) {
                    var fn = this._renderList[i];
                    if (fn.type != "originRender") {
                        fn && fn.apply(this, arguments);
                    } else {
                        originRendFN = fn;
                    }
                }
                originRendFN && originRendFN.apply(this, arguments);
            };
        },
        set: function(fn) {
            if (fn instanceof Function) {
                this._renderList.push(fn);
            } else {
                throw "args err"
            }
        }
    });

    this.define("touch", {
        get: function() {
            return this._events._touchFn;
        },
        set: function(fn) {
            this._events._touchFn = fn;
            this._touchStartPos;

            var texture = this.textureData || {};
            texture.origin = this.image;
            // texture.over = texture.over || this.image;
            // texture.out = texture.end || this.image;

            this.touchStart = function(p) {
                this._touchStartPos = p;
                this._touchDate = new Date();
                if (texture.over) {
                    this.setTexture && this.setTexture(texture.over);
                    var t = this;
                    H7.Thread.delay(function() {
                        if (texture.out) {
                            t.setTexture && t.setTexture(texture.out);
                        }
                    }, 500);
                }
            };
            this.touchEnd = function(p) {
                if (this._touchStartPos && this._touchDate) {
                    if (texture.out) {
                        this.setTexture && this.setTexture(texture.out);
                    }
                    if (Math.abs(p.x - this._touchStartPos.x) > 10) {
                        this._touchStartPos = null;
                        this._touchDate = null;
                        return;
                    }
                    if (Math.abs(p.y - this._touchStartPos.y) > 10) {
                        this._touchStartPos = null;
                        this._touchDate = null;
                        return;
                    }
                    if (new Date() - this._touchDate > 500) {
                        this._touchStartPos = null;
                        this._touchDate = null;
                        return;
                    }
                    this._touchDate = null;
                    this._touchStartPos = null;
                    if (fn) {
                        var ret = fn.call(this, p);
                        return ret;
                    }
                }
            };
            this.touchCancel = function() {
                this._touchStartPos = null;
                if (texture.out) {
                    this.setTexture && this.setTexture(texture.out);
                }
            };
        }
    })

    // 定义触屏开始事件
    this.define("touchStart", {
        get: function() {
            return this._events.touchStart;
        },
        set: function(fn) {
            this._events.touchStart = fn;
        }
    });

    // 定义触屏移动事件
    this.define("touchMove", {
        get: function() {
            return this._events.touchMove;
        },
        set: function(fn) {
            this._events.touchMove = fn;
        }
    });

    // 定义触屏结束事件
    this.define("touchEnd", {
        get: function() {
            return this._events.touchEnd;
        },
        set: function(fn) {
            this._events.touchEnd = fn;
        }
    });

    // 定义触屏取消事件
    this.define("touchCancel", {
        get: function() {
            return this._events.touchCancel;
        },
        set: function(fn) {
            this._events.touchCancel = fn;
        }
    });

    // 获取起始坐标
    this.getStartPos = function() {
        return {
            x: this.x - this.anchorX * this.width,
            y: this.y - this.anchorY * this.height
        }
    };

    // 获取绝对位置
    this.getAbsolutePos = function() {
        // 计算锚点位置
        var x = this.x,
            y = this.y;

        (function(n) {
            if (n.target) {
                var p = n.target;
                // x += p.x;
                // y += p.y;

                // 处理父节点旋转
                var deg = Math.PI / 180 * p.rotate;
                if (deg != null) {
                    // var pp = p.getPos();
                    // var x2 = pp.x,
                    //     y2 = pp.y;
                    // var x1 = (x - x2) * Math.cos(deg) - (y - y2) * Math.sin(deg) + x2
                    // var y1 = (y - y2) * Math.cos(deg) + (x - x2) * Math.sin(deg) + y2
                    var x1 = x * Math.cos(deg) - y * Math.sin(deg);
                    var y1 = y * Math.cos(deg) + x * Math.sin(deg);
                    x = p.x + x1 * p.scaleX;
                    y = p.y + y1 * p.scaleY;
                } else {
                    // 处理父节点scale
                    x = p.x + x * p.scaleX;
                    y = p.y + y * p.scaleY;
                }
                arguments.callee.call(null, p);
            }
        })(this);
        var thisPos = {
            x: x - this.anchorX * this.width,
            y: y - this.anchorY * this.height
        };

        if (this.autoSize) {
            if (this._childrenList.length > 0) {
                for (var i = 0; i < this._childrenList.length; i++) {
                    var node = this._childrenList[i].node;
                    var nodePos = node.getAbsolutePos();
                    if (nodePos.x < thisPos.x) {
                        thisPos.x = nodePos.x;
                    }
                    if (nodePos.y < thisPos.y) {
                        thisPos.y = nodePos.y;
                    }
                }
            }
        }


        return thisPos;
    };

    /**
     * 获取自身大小
     */
    this.getRealSize = function() {
        if (this instanceof H7.ScrollView) {
            return {
                width: this._width,
                height: this._height
            };
        }
        var tPos = this.getAbsolutePos();
        // if (this._width == undefined || this._height == undefined) {
        // tPos = this.getAbsolutePos()
        // }
        var minx = tPos.x,
            miny = tPos.y,
            maxx = tPos.x + (this._width || 0),
            maxy = tPos.y + (this._height || 0);
        // if (this.autoSize) {
        for (var i = 0; i < this._childrenList.length; i++) {
            var c = this._childrenList[i].node;
            // if (!(c instanceof H7.ScrollView) || (c._childrenList.length > 0 && !this._width && !this._height)) {
            //     var s = arguments.callee.call(c);
            //     c.realWidth = s.width;
            //     c.realHeight = s.height;
            // }

            var pos = c.getAbsolutePos()
            var scaleX = c.scaleX || 1,
                scaleY = c.scaleY || 1,
                cx = pos.x || 0,
                cy = pos.y || 0,
                cw = c.realWidth || c._width || 0,
                ch = c.realHeight || c._height || 0;

            // cx += -(c.width || 0) * c.anchorX;
            // cy += -(c.height || 0) * c.anchorY

            if (cx < minx) {
                minx = cx;
            }
            if (cx + cw * scaleX > maxx) {
                maxx = cx + cw * scaleX;
            }
            if (cy < miny) {
                miny = cy;
            }
            if (cy + ch * scaleY > maxy) {
                maxy = cy + ch * scaleY;
            }
            // console.log(c.x, c.y, c.width, c.height);
        }
        // }
        // console.log("Min:",minx, maxx, miny, maxy);
        var size = {
            width: (maxx - minx),
            height: (maxy - miny)
        };
        if (size.width < this._width) {
            size.width = this._width;
        }
        if (size.height < this._height) {
            size.height = this._height;
        }
        return size;
    };

    /**
     * 获取绝对真实大小
     */
    this.getAbsoluteSize = function() {
        if (this.realWidth || this.realWidth) {
            return {
                width: this.realWidth,
                height: this.realHeight
            };
        } else {
            var size = this.getRealSize();
            return {
                width: size.width * (this.scaleX || 1),
                height: size.height * (this.scaleY || 1)
            }
        }
    };

    // 增加子元素
    this.add = this.addChild = function(cnode, index) {
        if (cnode == this) {
            console.error("this child is node self.");
            return;
        }
        if (cnode instanceof H7.Scene) {
            console.error("the scene can't be child.");
            return;
        }
        this._childrenList.push({
            node: cnode, // 节点
            index: index || 0
        });
        cnode.target = this;

        // 如果是线程元素则以下不用计算
        if (cnode instanceof H7.Thread) {
            return;
        }

        // 元素是否有更新
        this.__pre = true;

        // 检测父级Node中有没有ScorllView
        var ret = (function(node) {
            if (node instanceof H7.ScrollView) {
                return true;
            } else if (node.target) {
                return arguments.callee.call(node.target, node.target);
            }
            return false;
        })(this);
        if (ret) {
            cnode.swallow = false;
        }
    };

    // 设置层级
    this.setIndex = function(index) {
        var parent = this.target;
        if (parent) {
            for (var i = 0; i < parent._childrenList.length; i++) {
                var node = parent._childrenList[i].node;
                if (node == this) {
                    parent._childrenList[i].index = index;
                    break;
                }
            }
            parent.__pre = true;
        }
    };

    // 计算元素宽高
    this.culSize = function() {
        (function(node) {
            var size = node.getRealSize();
            node.realWidth = size.width;
            node.realHeight = size.height;
            if (node.target) {
                arguments.callee.call(node.target, node.target);
            }
        })(this);
    };

    // 删除所有子元素
    this.removeAll = function() {
        this._childrenList = [];
    };

    // 删除子元素
    this.remove = function(node) {
        if (node instanceof H7.Node) {
            node.__destroy = true;
        } else {
            console.warn("node invalid.");
        }
    };

    // 精灵动画
    this.animate = function() {
        var animate = H7.Animate.create.apply(this, arguments);
        animate.start(this);
        return animate;
    };

    // 停止所有动画
    this.stopAnimate = function() {
        for (var i = this._updateList - 1; i >= 0; i--) {
            if (this._updateList[i].type == 'animate') {
                this._updateList.splice(i, 1);
            }
        }
        return this;
    };
};

// 快捷创建对象
H7.Node.create = function(params) {
    var node = new H7.Node();
    node.attr(params);
    return node;
};

// Node 继承
H7.Node.extend = function(prot) {
    var t = this;
    var Node = function() {
        t.apply(this, arguments);

        this.id = Math.floor(Math.random() * 10000);

        for (var p in prot) {
            this[p] = prot[p];
        }

        prot.ctor && prot.ctor.apply(this, arguments);
    };

    Node.prototype = Object.create(this.prototype)

    // 快捷创建对象
    Node.create = function(params) {
        var node = new Node();
        node.attr(params);
        return node;
    };

    // 继承
    Node.extend = function() {
        return t.extend.apply(this, arguments);
    };

    return Node;
};