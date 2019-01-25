H7.Thread = H7.Node.extend({
    type: "Thread",

    ctor: function () {
        this.threadList = [];
    },

    // 循环: 
    // fn-循环执行方法
    // interval-循环执行间隔时间
    // delya-延迟执行时间
    // time-执行次数
    loop: function (fn, interval, delay, times) {
        var t = {
            fn: fn,
            times: times || 0,
            interval: interval || 0,
            delay: delay || 0
        };
        this.threadList.push(t);
        return this;
    },

    // 延迟执行
    delay: function (fn, delay) {
        var t = {
            fn: fn,
            times: 1,
            interval: 0,
            delay: delay || 0
        };
        this.threadList.push(t);
        return this;
    },

    // 消除
    clear: function (t) {
        if (t) {
            for (var i = this.threadList.length - 1; i >= 0; i--) {
                if (t == this.threadList[i]) {
                    this.threadList.splice(i, 1);
                }
            }
        } else {
            if (this.threadList.length > 0) {
                this.threadList = [];
            }
        }
    },

    update: function (tick) {
        var threadList = this.threadList;
        for (var i = threadList.length - 1; i >= 0; i--) {
            var t = threadList[i];
            t.startTime = (t.startTime || 0) + tick;
            t.execTimes = t.execTimes || 0;
            if (t.startTime > t.delay + t.interval) {
                if (t.times == 0 || t.execTimes < t.times) {
                    // 当前需要执行的次数
                    var needExecTimes = Math.floor((t.startTime - t.delay) / t.interval);
                    if (needExecTimes > t.execTimes) {
                        t.execTimes++;
                        try {
                            t.fn && t.fn.call(t);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                } else {
                    threadList.splice(i, 1);
                }
            }
        }
    }
});

// 公用线程(慎用)
(function () {

    var thread = new H7.Thread();

    // 循环执行
    H7.Thread.loop = function () {
        console.warn("global loop thread.");
        thread.loop.apply(thread, arguments);
    };

    // 延迟执行
    H7.Thread.delay = thread.delay.bind(thread);

    // 消除
    H7.Thread.clear = thread.clear.bind(thread);

    // 更新处理
    H7.Thread.update = thread.update.bind(thread);
})();