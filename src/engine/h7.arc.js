/**
 * 画圆形或扇形
 */
H7.Arc = H7.Node.extend({
    type: "Arc",

    // 初始化
    ctor: function (radius) {
        this.define("radius", {
            get: function () {
                return this._radius;
            },
            set: function (v) {
                this._radius = v;
                this.width = this.radius * 2;
                this.height = this.radius * 2;
            }
        });
        this.radius = radius;
    },

    // 开始角度
    startAngle: 0,

    // 结束角度
    endAngle: 360,

    // 是否逆时针
    antiClockWise: false,

    render: function (ctx) {
        var pos = this.getPos();
        var deg = Math.PI / 180;

        ctx.beginPath();
        ctx.arc(0, 0, this.radius * (H7.Game.retina ? 2 : 1), this.startAngle * deg, this.endAngle * deg, this.antiClockWise);
        ctx.closePath();

        if (this.fillStyle) {
            ctx.fillStyle = this.fillStyle;
            ctx.fill();
        }

        // 边框
        this.borderWidth = this.borderWidth || 0;
        if (this.borderWidth) {
            ctx.lineWidth = this.borderWidth * (H7.Game.retina ? 2 : 1);
            if (this.borderStyle) ctx.strokeStyle = this.borderStyle;
            ctx.strokeRect(pos.x, pos.y, this.width * (H7.Game.retina ? 2 : 1), this.height * (H7.Game.retina ? 2 : 1));
            ctx.stroke();
        }
    }
});