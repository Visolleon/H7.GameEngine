/**
 * 动画库
 * attr: 游戏精灵基础Node类属性名(包含:width、height、x、y、scale、opacity、skew)
 * from: 起始位置数据
 * to: 结束位置数据
 * delay: 延迟执行
 * duration: 时间长度(毫秒)
 * times: 循环次数(如果为0则表示循环重复执行)
 * ok: 单次完成执行
 * complete: 全部完成后执行(如果无限循环,则无效)
 */
H7.Animate = function (params) {
    if (!params || !params.attr) {
        throw "args err"
    }
    // 0-未开始，1-进行中，2-暂停，-3-准备结束, -1-已结束, -2-异常
    this._status = 0;

    // 动画数据
    this._animateDate = params;

    // 检测次数数据
    if (this._animateDate.times == undefined) {
        this._animateDate.times = 1;
    } else {
        this._animateDate.times = parseInt(this._animateDate.times);
    }
    this._animateDate.delay = this._animateDate.delay || 0;

    // 时间统计
    this._msTotal = 0;

    // 次数统计
    this._timeTotle = 0;
    var t = this;

    // 分配update函数
    this._update = function (time) {
        // 是否暂停
        if (t._status == 2 || t._status == 0) {
            return;
        }

        var p = t._animateDate;

        var node = this;

        // 如果是准备结束,则置为最终状态等待结束
        if (t._status == -3) {
            node[p.attr] = p.to;
            t._status = -1;
        }
        // 判断是否可结束
        if (t._status < 0) {
            p.complete && p.complete.call(t, t._timeTotle, t._status);
            node.removeUpdate(t._update);
            return;
        }
        t._msTotal += time;
        // 处理延迟时间
        if (t._msTotal < p.delay) {
            return;
        }

        // 如果时间已经超过周期时间了,则开始准备结束
        if (t._msTotal - p.delay >= p.duration) {
            node[p.attr] = p.to;
            t._timeTotle++;
            // 设置动画次数大于0表示不是一直循环动画
            if (p.times > 0 && t._timeTotle >= p.times) {
                t._status = -1;
            } else {
                node[p.attr] = p.from;
            }
            t._msTotal = 0;
            if (p.attr == "scale" || p.attr == "width" || p.attr == "height") {
                node.culSize();
            }
            p.ok && p.ok.call(t, t._timeTotle, t._status);
        } else {
            // 计算百分比
            var percent = (t._msTotal - p.delay) / p.duration;
            node[p.attr] = p.from + (p.to - p.from) * percent;
        }
    };

    this._update.type = "animate";
};

// 动画开始
H7.Animate.prototype.start = function (node) {
    if (!node) {
        throw "node err";
    }
    if (this._status == 0) {
        if (this._animateDate.from == null || this._animateDate.from == undefined) {
            this._animateDate.from = node[this._animateDate.attr];
        }
        this.startDate = new Date();
        node.update = this._update;
    } else if (this._status == -1) {
        this.startDate = new Date();
        node.update = this._update;
        this._timeTotle = 0;
        this._msTotal = 0;
    }
    this._status = 1;
};

// 停止动画
H7.Animate.prototype.stop = function () {
    this._status = -3;
};

// 暂停动画
H7.Animate.prototype.pause = function () {
    this._status = 2;
};

// 恢复动画
H7.Animate.prototype.resume = function () {
    this._status = 1;
};

// 动画状态
Object.defineProperty(H7.Animate.prototype, "status", {
    get: function () {
        return this._status;
    }
});

// 多动画参数处理
H7.Animate.create = function () {
    var ans = [];
    for (var i = 0; i < arguments.length; i++) {
        ans.push(new H7.Animate(arguments[i]));
    }
    ans.start = function (node) {
        var len = ans.length;
        for (var n = 0; n < len; n++) {
            ans[n].start(node);
        }
    };
    ans.stop = function (node) {
        var len = ans.length;
        for (var n = 0; n < len; n++) {
            ans[n].stop(node);
        }
    };
    ans.pause = function (node) {
        var len = ans.length;
        for (var n = 0; n < len; n++) {
            ans[n].pause(node);
        }
    };
    ans.resume = function (node) {
        var len = ans.length;
        for (var n = 0; n < len; n++) {
            ans[n].resume(node);
        }
    };
    return ans;
};

/**一些示例
    // var animate = new H7.Animate({
    //     attr: "rotate",
    //     from: 0,
    //     to: 360,
    //     duration: 1000,
    //     times: 0,
    //     ok: function (count, status) {
    //         console.log("OK:", count, status);
    //     },
    //     complete: function (count, status) {
    //         console.log("Complete:", status, new Date() - animate.startDate);
    //     }
    // });

    // setTimeout(function () {
    //     animate.start(fpsLabel);
    // }, 1000);

    // var animate = new H7.Animate({
    //     attr: "rotate",
    //     from: 0,
    //     to: 360,
    //     delay: 1000,
    //     duration: 1000,
    //     times: 0,
    //     // ok: function (count, status) {
    //     //     console.log("OK:", count, status);
    //     // },
    //     // complete: function (count, status) {
    //     //     console.log("Complete:", status, new Date() - animate.startDate);
    //     // }
    // });
    // // animate.start(fpsLabel);


    // var a1 = new H7.Animate({
    //     attr:"opacity",
    //     from: 1,
    //     to: 0,
    //     duration:1000,
    //     ok: function () {
    //         a2.start(label);
    //     }
    // });
    // var a2 = new H7.Animate({
    //     attr:"opacity",
    //     from: 0,
    //     to: 1,
    //     duration:1000,
    //     ok: function () {
    //         a1.start(label);
    //     }
    // });

    // // a1.start(label);

    // var b1 = new H7.Animate({
    //     attr: "scale",
    //     from: 0,
    //     to: 5,
    //     delay: 100,
    //     duration: 1000,
    //     ok: function () {
    //         b2.start(label);
    //     }
    // });
    // var b2 = new H7.Animate({
    //     attr: "scale",
    //     from: 5,
    //     to: 0,
    //     duration: 1000,
    //     ok: function () {
    //         b1.start(label);
    //     }
    // });
    // b1.start(label);


    // var animate2 = new H7.Animate.create({
    // label.animate({
    //     attr:"opacity",
    //     from: 1,
    //     to: 0,
    //     duration:1000,
    //     times: 0
    // },{
    //     attr: "scale",
    //     from: 0.1,
    //     to: 10,
    //     duration: 1000,
    //     times: 0,
    //     ok: function (count, status) {
    //         console.log("OK:", count, status);
    //     },
    //     complete: function (count, status) {
    //         console.log("Complete:", status, new Date() - animate.startDate);
    //     }
    // });
    // animate2.start(label);
 */