H7.Layer = H7.Node.extend({
    type: "Layer",

    // 初始化
    ctor: function () {

    },

    anchor: 0,

    // 缓存层渲染
    cache: function () {
        if (!this._cacheCtx) {
            this._cacheCtx = H7.Base.createCanvas();
            document.body.appendChild(this._cacheCtx.canvas);
        }
        var size = this.getRealSize();
        this._cacheCtx.canvas.width = size.width * (H7.Game.retina ? 2 : 1);
        this._cacheCtx.canvas.height = size.height * (H7.Game.retina ? 2 : 1);
        this._cacheCtx.clearRect(0, 0, this._cacheCtx.canvas.width, this._cacheCtx.canvas.height);

        var originX = this.x, originY = this.y;
        this.x += size.width * this.anchorX;
        this.y += size.height * this.anchorY;
        H7.Base.render(this._cacheCtx, this, 0, true, true);
        this.x = originX;
        this.y = originY;
        this.isCached = true;
    },

    // 取消缓存层渲染
    uncache: function () {
        this.isCached = false;
    }
});