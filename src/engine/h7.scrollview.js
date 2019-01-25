H7.ScrollView = H7.Node.extend({
    type: "ScrollView",

    // 初始化
    ctor: function (width, height) {
        this.width = width;
        this.height = height;

        this.layer = new H7.Layer();
        this.layer.type = "SV_Layer";
        this.layer.anchor = [0.5, 0];
        this.layer.swallow = false;
        this.layer.target = this;
        this._childrenList.push({
            node: this.layer,
            index: 0
        });

        var thread = new H7.Thread();
        this._eventThread = thread;
        this._childrenList.push({
            node: thread,
            index: 0
        });
    },

    autoSize: false,

    // 增加内容元素
    add: function (node, index) {
        node.swallow = false;
        this.layer.add(node, index);
    },

    // 设置内容宽高
    setContentSize: function (width, height) {
        this._contentSize = {
            width: width,
            height: height
        };
        this.layer.attr({
            width: width,
            height: height
        });
    },

    // 滚动到指定位置
    scrollTo: function (x, y) {
        this.layer.attr({
            x: x,
            y: y
        });
    },

    // 动画方式滚动到指定的位置
    animateTo: function (x, y) {
        this.layer.animate({
            attr: "x",
            to: x,
            duration: 500
        }, {
                attr: "y",
                to: y,
                duration: 500
            });
    },

    // 渲染
    render: function (ctx) {
        var pos = this.getPos();
        ctx.beginPath();
        ctx.rect(pos.x, pos.y, this.width * (H7.Game.retina ? 2 : 1), this.height * (H7.Game.retina ? 2 : 1));
        ctx.clip();
        ctx.closePath();
    },


    // 清空子元素
    clear: function () {
        this.layer._childrenList = [];
        this.layer.x = 0;
        this.layer.y = 0;
        this.layer.culSize();
    },

    // 移动位置
    move: function (dx, dy) {
        if (this.layer.x <= 0) {
            if (dx == NaN || typeof dx != "number") {
                return;
            }
            if (this.layer.width + this.layer.x >= this.width) {
                if (this.layer.x + dx > 0) {
                    this.layer.x = 0;
                } else if (this.layer.width + this.layer.x + dx < this.width) {
                    this.layer.x = this.width - this.layer.width;
                } else {
                    this.layer.x += dx;
                }
            }
        } else {
            this.layer.x = 0;
        }
        if (this.layer.y <= 0) {
            if (dy == NaN || typeof dy != "number") {
                return;
            }
            if (this.layer.height + this.layer.y >= this.height) {
                if (this.layer.y + dy > 0) {
                    this.layer.y = 0;
                } else if (this.layer.height + this.layer.y + dy < this.height) {
                    this.layer.y = this.height - this.layer.height;
                } else {
                    this.layer.y += dy;
                }
            }
        } else {
            this.layer.y = 0;
        }
    },

    touchStart: function (pos) {
        this.startPos = pos;
        this.tPos = pos;
        this._touchTime = new Date();
        if (this._eventThread) {
            this._eventThread.clear();
        }
    },

    touchMove: function (pos) {
        if (this.tPos) {
            var dx = pos.x - this.tPos.x,
                dy = pos.y - this.tPos.y;
            this.move(dx, dy);
            this.tPos = pos;
        }
    },

    touchEnd: function (pos) {
        if (this.tPos) {
            var dx = pos.x - this.tPos.x,
                dy = pos.y - this.tPos.y;
            this.move(dx, dy);
            var unitTick = 16;
            var count = Math.floor((new Date() - this._touchTime) / unitTick) || 1;
            var speedX = (pos.x - this.startPos.x) / count;
            var speedY = (pos.y - this.startPos.y) / count;
            var t = this;

            if (this._eventThread) {
                this._eventThread.clear();
                this._eventThread.loop(function () {
                    var ddx = speedX - this.execTimes * speedX / 30,
                        ddy = speedY - this.execTimes * speedY / 30;
                    var stopX = false, stopY = false;
                    if ((speedX >= 0 && ddx <= 0) || (speedX < 0 && ddx >= 0)) {
                        stopX = true;
                    }
                    if ((speedY >= 0 && ddy <= 0) || (speedY < 0 && ddy >= 0)) {
                        stopY = true;
                    }
                    if (ddx <= 1) {
                        stopX = true;
                    }
                    if (ddy <= 1) {
                        stopY = true;
                    }
                    if (stopX && stopY) {
                        t._eventThread.clear();
                    } else {
                        t.move(ddx, ddy);
                    }
                }, unitTick, 0, 0);
            }
            this.tPos = null;
        }
    },

    touchCancel: function (pos) {
        if (this.tPos) {
            var dx = pos.x - this.tPos.x,
                dy = pos.y - this.tPos.y;
            this.move(dx, dy);
            this.tPos = null;
        }
    }
});