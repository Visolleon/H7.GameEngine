H7.Sprite = H7.Node.extend({
    type: "Sprite",

    // 初始化
    ctor: function (obj, isCache) {
        this.setTexture(obj, isCache);

        this.define("onload", {
            get: function () {
                return this._onload;
            },
            set: function (fn) {
                this._onload = fn;
                if (this.isReady) {
                    this._onload && this._onload.call(this);
                }
            }
        });
    },

    // 设置资源
    setTexture: function (obj, isCache) {
        if (!isCache) {
            if (obj.constructor == String) {
                var cache = H7.Texture.get(obj);
                if (cache) {
                    obj = cache;
                }
            }
            if (obj instanceof Image || obj instanceof HTMLCanvasElement) {
                this.image = obj;
                this.width = this.image.width;
                this.height = this.image.height;
                this.isReady = true;
            } else {
                var t = this;
                this.image = H7.Base.loadImage(obj, function (isSuccess) {
                    if (isSuccess) {
                        if (!t._width) {
                            t.width = this.width;
                        }
                        if (!t._height) {
                            t.height = this.height;
                        }
                        if (t.target) {
                            t.target.culSize();
                        }
                        t.isReady = true;
                        t.onload && t.onload.call(t);
                    }
                });
            }
        } else {
            this.image = H7.Texture.get(obj);
            this.width = this.image.width;
            this.height = this.image.height;
            this.isReady = true;
        }
        this.textureData = {};
        this.textureData.origin = this.image;
        // this.textureData.over = this.image;
        // this.textureData.out = this.image;
    },

    isReady: false,

    // 设置事件纹理
    setEventTexture: function (over, out) {
        this.textureData.over = over || this.image;
        this.textureData.out = out || this.image;
    },

    // 图片剪切
    cut: function (x, y, w, h) {
        this._cutData = {
            x: x,
            y: y,
            w: w,
            h: h
        };
    },

    render: function (ctx) {
        if (this.isReady) {
            var pos = this.getPos();
            if (!this._cutData) {
                ctx.drawImage(this.image, pos.x, pos.y, this.width * (H7.Game.retina ? 2 : 1), this.height * (H7.Game.retina ? 2 : 1));
            } else {
                if (this._cutData.w == 0 || this._cutData.h == 0) {
                    return;
                }
                if (this.width == 0 || this.height == 0) {
                    return;
                }
                ctx.drawImage(this.image, this._cutData.x, this._cutData.y, this._cutData.w, this._cutData.h,
                    pos.x, pos.y, this.width * (H7.Game.retina ? 2 : 1), this.height * (H7.Game.retina ? 2 : 1));
            }
        }
    }
});