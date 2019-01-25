H7.Number = H7.Node.extend({
    type: "Number",

    // 初始化
    ctor: function (texture, unitWidth, unitHeight) {
        if (texture.constructor == String) {
            var cache = H7.Texture.get(texture);
            if (cache) {
                this.texture = cache;
            } else {
                this.texture = H7.Base.loadImage(texture);
            }
        } else {
            this.texture = texture;
        }
        this.unitWidth = unitWidth;
        this.height = unitHeight;
        this.width = unitWidth;
        this._text = 0;
    },

    // 设置数字
    setText: function (s) {
        this._text = [s, ""].join("");
        this.width = this.unitWidth * this._text.length;
        this.cache();
    },

    // 缓存层渲染
    cache: function () {
        if (!this._cache || !this.image) {
            this._cache = H7.Base.createCanvas();
            this.image = this._cache.canvas;
            // this.image.id = "cache_" + this.id;
            this.image.height = this.height;
        }
        var len = this._text.length;
        if (len > 0) {
            this.image.width = this.width;
            this._cache.clearRect(0, 0, this.width, this.height);
            H7.Base.render(this._cache, this, 0, true);
            for (var i = 0; i < len; i++) {
                var n = parseInt(this._text[i]);
                var sx = n * this.unitWidth;
                this._cache.drawImage(this.texture, sx, 0, this.unitWidth, this.height, i * this.unitWidth, 0, this.unitWidth, this.height);
            }
        }
    },

    render: function (ctx) {
        var pos = this.getPos();
        ctx.drawImage(this.image, pos.x, pos.y, this.width * (H7.Game.retina ? 2 : 1), this.height * (H7.Game.retina ? 2 : 1));
    }
});