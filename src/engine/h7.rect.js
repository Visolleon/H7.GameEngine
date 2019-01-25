H7.Rect = H7.Node.extend({
    type: "Rect",

    // 初始化
    ctor: function (width, height) {
        this.width = width;
        this.height = height;
        this.fillStyle = "";
    },

    render: function (ctx) {
        var pos = this.getPos();

        if (this.fillStyle) {
            ctx.fillStyle = this.fillStyle;
        }
        ctx.fillRect(pos.x, pos.y, this.width * (H7.Game.retina ? 2 : 1), this.height * (H7.Game.retina ? 2 : 1));

        // 边框
        this.borderWidth = this.borderWidth || 0;
        if (this.borderWidth) {
            ctx.lineWidth = this.borderWidth * (H7.Game.retina ? 2 : 1);
            if (this.borderStyle) ctx.strokeStyle = this.borderStyle;
            ctx.strokeRect(pos.x, pos.y, this.width * (H7.Game.retina ? 2 : 1), this.height * (H7.Game.retina ? 2 : 1));
        }
    }
});