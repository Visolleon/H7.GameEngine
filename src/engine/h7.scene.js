H7.Scene = H7.Node.extend({
    type: "Scene",
    // 初始化
    ctor: function () {

    },

    // 缓存渲染
    cache: function () {
        if (!this._cacheCtx) {
            this._cacheCtx = H7.Base.createCanvas();
        }
        var size = { width: 0, height: 0 };

        if (H7.Game.currentScene() == this) {
            size = H7.Game.getSize();
            this._cacheCtx.canvas.width = size.width * (H7.Game.retina ? 2 : 1);
            this._cacheCtx.canvas.height = size.height * (H7.Game.retina ? 2 : 1);
            this._cacheCtx.clearRect(0, 0, this._cacheCtx.canvas.width, this._cacheCtx.canvas.height);
            this._cacheCtx.drawImage(H7.Game.getCanvas(), 0, 0);
        } else {
            size = this.getRealSize();
            this._cacheCtx.canvas.width = size.width * (H7.Game.retina ? 2 : 1);
            this._cacheCtx.canvas.height = size.height * (H7.Game.retina ? 2 : 1);
            this._cacheCtx.clearRect(0, 0, this._cacheCtx.canvas.width, this._cacheCtx.canvas.height);
            var originX = this.x, originY = this.y;
            this.x += size.width * this.anchorX;
            this.y += size.height * this.anchorY;
            H7.Base.render(this._cacheCtx, this, 0, true);
            this.x = originX;
            this.y = originY;
        }
        this.isCached = true;
    }
});