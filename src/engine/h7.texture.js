/**
 * 资源处理
 */
H7.Texture = (function () {
    return {
        _jsonDic: {},
        // 资源缓存
        _resource: {},

        /**
         * 载入TexturePacker的Json Hash数据
         */
        load: function (json, callback) {
            var t = this;
            if (t._jsonDic[json]) {
                callback && callback(t._jsonDic[json]);
            } else {
                var isCross = false;
                if (json.indexOf("http://") >= 0 || json.indexOf("https://") >= 0) {
                    isCross = true;
                }
                H7.Base.ajax({
                    url: json,
                    type: "JSON",
                    crossDomain: isCross,
                    success: function (data) {
                        var imageUrl = data.images[0];
                        if (imageUrl) {
                            var urlList = json.split("/");
                            urlList[urlList.length - 1] = imageUrl;
                            var imageUrl = urlList.join("/");
                            var img = H7.Base.loadImage(imageUrl, function (isSuccess) {
                                if (isSuccess) {
                                    t.set(data, this);
                                    t._jsonDic[json] = data;
                                    callback && callback(data);
                                } else {
                                    throw "load " + imageUrl + " failed.";
                                }
                            });
                        } else {
                            throw "no resource to load.";
                        }
                    }
                });
            }
        },

        /**
         * 设置资源缓存
         */
        set: function (json, image) {
            for (var k in json.animations) {
                var frame = {
                    frameData: json.animations[k].frames ? json.frames[json.animations[k].frames[0]] : json.frames[json.animations[k][0]]
                };
                var ctx = H7.Base.createCanvas();
                var w = frame.frameData[2],
                    h = frame.frameData[3];
                ctx.canvas.width = w;
                ctx.canvas.height = h;
                frame.canvas = ctx.canvas;
                ctx.drawImage(image, frame.frameData[0], frame.frameData[1], w, h, 0, 0, ctx.canvas.width, ctx.canvas.height);
                this.add(k, frame.canvas);
            }
        },

        // 增加对象缓存
        add: function (name, img) {
            if (!this._resource[name]) {
                this._resource[name] = img;
            } else {
                console.warn("resource duplicate:", name);
            }
        },

        // 获取缓存对象
        get: function (name) {
            return this._resource[name];
        }
    };
})();