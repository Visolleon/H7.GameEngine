H7.FrameSprite = H7.Node.extend({
    type: "FrameSprite",

    // 初始化
    // textureList: 动画frames列表
    // duration: 每次动画周期
    // isManul: 是否手动启动动画
    ctor: function (textureList, duration, isManul) {
        this.interval = duration / textureList.length;
        this.frameIndex = 0;
        this.setTexture(textureList[this.frameIndex]);
        this.textureList = textureList;
        if (!isManul) {
            this.start();
        }
    },

    // 开始动画
    start: function () {
        var t = this;
        this.passInterval = 0;
        this._stopAnimate = false;
    },

    update: function (tick) {
        if (!this._stopAnimate) {
            var t = this;
            this.passInterval += tick;
            if (this.passInterval > this.interval) {
                this.passInterval = 0;
                t.frameIndex++;
                if (t.frameIndex > t.textureList.length - 1) {
                    t.frameIndex = 0;
                }
                t.setTexture(t.textureList[t.frameIndex]);
            }
        }
    },

    // 销毁对象
    destroy: function () {
        this.__destroy = true;
    },

    // 停止动画
    stop: function () {
        this._stopAnimate = true;
    },

    // 设置资源
    setTexture: function (obj, isCache) {
        this.image = H7.Texture.get(obj);
        this.width = this.image.width;
        this.height = this.image.height;
    },

    render: function (ctx) {
        var pos = this.getPos();
        ctx.drawImage(this.image, pos.x, pos.y, this.width * (H7.Game.retina ? 2 : 1), this.height * (H7.Game.retina ? 2 : 1));
    }
});