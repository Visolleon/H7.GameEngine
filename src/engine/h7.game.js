H7.Game = (function () {
    var game = {
        /**
        * 游戏初始化
        *	{
        *		id : string, //  canvas ID
        *	    clearColor: string, // 画布底色
        *		canvas: Canvas object, // Canvas Node
        *		fps : 60,
        *		height : 800,
        *		width : 600,
        *       sizeType: 0, // 适配模式: -1不适配，0宽高适配，1宽度适配，2高度适配，3拉升适配
        *       retina: false, // 是否retina高清
        *		isPush : false // 是否推送更新
        *	}
        */
        init: function (params) {
            // 期望的FPS
            this.expectFPS = params.fps || 60;
            // 画布底色
            this.clearColor = params.clearColor || "#000000";
            // 时间间隔
            this.interval = (1000 / params.fps) || 16;
            // 画布2D绘图对象
            this.ctx = H7.Base.createCanvas(params.canvas || params.id);
            // Debug模式
            this._isDebug = !!params.debug;
            // 是否Retina屏幕
            this.retina = !!params.retina;
            // 适配模式
            if (params.sizeType >= -1) {
                this.sizeType = params.sizeType;
            } else {
                this.sizeType = 0;
            }

            // 设置画布大小
            this.width = params.width;
            this.height = params.height;
            this.setSize(params.width, params.height);
            this.clear();

            H7.Events.init();
        },

        // 设置画布大小
        setSize: function (w, h) {
            var canvas = this.ctx.canvas;
            // sizeType: 0, // 适配模式: -1不适配，0宽高适配，1宽度适配，2高度适配，3拉升适配
            var ww = document.documentElement.clientWidth,
                wh = document.documentElement.clientHeight;
            if (this.sizeType == 1) {
                h = wh * w / ww;
            }
            if (w) {
                canvas.width = w * (this.retina ? 2 : 1);
            } else {
            }
            if (h) {
                canvas.height = h * (this.retina ? 2 : 1);
            }
            if (this.sizeType == 0) {
                canvas.style.height = wh + "px";
            } else if (this.sizeType == 1) {
                canvas.style.width = ww + "px";
            } else if (this.sizeType == 2) {
                var hp = this.height / window.screen.availHeight,
                    wp = this.width / window.screen.availWidth;
                if (wp > hp) {
                    canvas.style.width = ww + "px";
                } else {
                    canvas.style.height = wh + "px";
                }
            } else if (this.sizeType == 3) {
                canvas.style.width = ww + "px";
                canvas.style.height = wh + "px";
            }
        },

        // 获取画布大小
        getSize: function () {
            return {
                width: this.width,
                height: this.height,
                retina: this.retina
            }
        },

        // 获取显示大小
        getClientSize: function () {
            return {
                width: this.ctx.canvas.clientWidth,
                height: this.ctx.canvas.clientHeight
            };
        },

        // 获取主游戏的canvas对象
        getCanvas: function () {
            return this.ctx.canvas;
        },

        // 清除画布
        clear: function () {
            var size = this.getSize();
            this.ctx.fillStyle = this.clearColor;
            // this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.fillRect(0, 0, size.width * (this.retina ? 2 : 1), size.height * (this.retina ? 2 : 1));
        },

        // 时间
        requestAnimateFrame: function (fn) {
            var gaf = this._gameAnimateFrame;
            if (!gaf) {
                gaf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
                if (!gaf) {
                    gaf = function (callback) {
                        if (!this._startDate) {
                            this._startDate = new Date();
                        }
                        window.setTimeout(function () {
                            callback(new Date() - this._startDate);
                        }.bind(this), this.interval);
                    }.bind(this);
                }
                this._gameAnimateFrame = gaf;
            }
            gaf(fn.bind(this));
        },

        // 运行场景
        run: function (scene) {
            H7.Input.clear();
            this._currentScene = null;
            this._currentScene = scene;
            // if (this._currentScene) {
            //     this._preScene = scene;
            // } else {
            //     this._currentScene = scene;
            // }
        },

        // 获取当前场景
        currentScene: function () {
            return this._currentScene;
        },

        // 预渲染场景
        preScene: function (scene) {
            this._preScene = scene;
        },

        // 将预渲染场景转为正式场景
        popScene: function () {
            if (this._preScene) {
                this._currentScene = this._preScene;
                this._preScene = null;
            }
        },

        // 帧数统计
        frames: 0,

        // 当前FPS
        FPS: 0,

        // 开始游戏
        start: function (t1, t2) {
            t1 = t1 || 0;
            t2 = t2 || 0;
            if (!(this._currentScene instanceof H7.Scene)) {
                throw "scene invalid"
            }
            this.clear();
            H7.Thread.update(t2 - t1);
            if (this._preScene instanceof H7.Scene) {
                H7.Base.render(this.ctx, this._preScene, t2 - t1);
            } else {
                this._preScene = null;
            }
            H7.Base.render(this.ctx, this._currentScene, t2 - t1);

            if (this.frames == 0) {
                this._frameDate = new Date();
            }
            this.frames++;
            if (this.frames >= 60) {
                var time = new Date() - this._frameDate;
                var frameTime = time / this.frames;
                this.FPS = 1000 / frameTime;
                this.frames = 0;
            }

            this.requestAnimateFrame(function (time) {
                this.start(t2, time);
            });
        }
    };
    return game;
})();