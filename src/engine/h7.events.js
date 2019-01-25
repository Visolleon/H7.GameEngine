/**
 * 游戏触屏事件
 */
H7.Events = (function() {
    return {
        nodeList: [],

        /**
         * 注册事件
         */
        on: function(eventName, fn) {
            var t = this;
            if (window.addEventListener) {
                this.gamecanvas.addEventListener(eventName, function() {
                    fn && fn.apply(t, arguments);
                }, false);
            } else {
                this.gamecanvas.attachEvent("on" + eventName, function() {
                    fn && fn.apply(t, arguments);
                });
            }
        },

        /**
         * 注销事件
         */
        off: function(obj, eventName, fn) {
            if (obj.removeEventListener) {
                obj.removeEventListener(eventName, fn, false);
            } else {
                obj.detachEvent("on" + eventName, fn);
            }
        },

        /**
         * 获取相对位置
         */
        getPos: function(e) {
            e.stopPropagation && e.stopPropagation();
            e.preventDefault && e.preventDefault();
            if (e.changedTouches) {
                var lx = e.changedTouches[0].pageX,
                    ly = e.changedTouches[0].pageY;
            } else {
                var lx = e.x,
                    ly = e.y;
            }
            var topOffset = 0;
            var leftOffset = 0;
            if (!this.offset) {
                var obj = this.gamecanvas;
                while (obj && obj.tagName != 'BODY') {
                    topOffset += (obj.offsetTop || 0);
                    leftOffset += (obj.offsetLeft || 0);
                    obj = obj.offsetParent;
                }
                lx -= leftOffset;
                ly -= topOffset;
                this.offset = {
                    top: topOffset,
                    left: leftOffset
                };
            } else {
                topOffset = this.offset.top;
                leftOffset = this.offset.left;
            }

            var wSize = H7.Game.getSize(),
                clientSize = H7.Game.getClientSize();
            var bitX = 1,
                bitY = 1;
            if (H7.Game.sizeType == 1) {
                bitX = bitY = wSize.width / clientSize.width;
            } else if (H7.Game.sizeType == 2) {
                bitX = bitY = wSize.height / clientSize.height;
            } else if (H7.Game.sizeType == 3) {
                bitX = wSize.width / clientSize.width;
                bitY = wSize.height / clientSize.height;
            }
            return {
                x: lx * bitX,
                y: ly * bitY
            };
        },

        // 监测点是否在节点上
        checkPointInNode: function(x, y, node) {
            var pos = node.getAbsolutePos();
            var size = node.getAbsoluteSize();
            // x轴是否包涵在内
            if (x < pos.x || x > pos.x + size.width) {
                return false;
            }
            // y轴是否包含在内
            if (y < pos.y || y > pos.y + size.height) {
                return false;
            }
            return true;
        },

        _execEvent: function(e, name) {
            var t = this;
            var pos = this.getPos(e);
            var scene = H7.Game.currentScene();
            var eNs = (function(parent, eventNodes) {
                if (parent._childrenList) {
                    var len = parent._childrenList.length;
                    for (var i = 0; i < len; i++) {
                        var node = parent._childrenList[i].node;
                        if (node.visible && (t.checkPointInNode(pos.x, pos.y, node) || node instanceof H7.Layer)) {
                            var isHad = false;
                            for (var ii = eventNodes.length - 1; ii >= 0; ii--) {
                                if (eventNodes[ii] == node) {
                                    isHad = true;
                                    break;
                                }
                            }
                            if (!isHad) {
                                eventNodes.push(node);
                            }
                            arguments.callee.call(this, node, eventNodes);
                        }
                    }
                }
                return eventNodes;
            })(scene, []);

            var len = eNs.length;
            for (var i = len - 1; i >= 0; i--) {
                var swallow = (function(eNode) {
                    if (eNode && eNode._events && eNode._events[name]) {
                        var ret = eNode._events[name].call(eNode, pos);
                        if (ret == false) {
                            return true;
                        }
                    }
                    if (eNode && !eNode.swallow) {
                        var ret = arguments.callee.call(eNode.target, eNode.target);
                        if (ret != undefined) {
                            return ret;
                        }
                    }
                    if (eNode) {
                        return eNode.swallow
                    }
                })(eNs[i]);
                if (swallow) {
                    break;
                }
            }
        },

        _touchStart: function(e) {
            this._execEvent(e, "touchStart");
        },

        _touchMove: function(e) {
            this._execEvent(e, "touchMove");
        },

        _touchEnd: function(e) {
            this._execEvent(e, "touchEnd");
        },

        _touchCancel: function(e) {
            this._execEvent(e, "touchCancel");
        },

        /**
         * 初始化事件
         */
        init: function() {
            this.gamecanvas = H7.Game.ctx.canvas;

            this.on("touchstart", this._touchStart);
            this.on("touchmove", this._touchMove);
            this.on("touchend", this._touchEnd);
            this.on("touchcancel", this._touchCancel);

            this.on("mousedown", this._touchStart);
            this.on("mousemove", this._touchMove);
            this.on("mouseup", this._touchEnd);
            this.on("mouseover", this._touchCancel);
        },

        /**
         * 加入需要事件处理的Node
         */
        set: function(node, index) {
            this.nodeList.push(node);
        },

        /**
         * 场景事件清除
         */
        clear: function() {
            this.nodeList = [];
        },

        /**
         * 新建事件
         */
        newEvent: function(name, x, y, w, h, fn) {
            var n = {
                _events: {},
                x: x,
                y: y,
                width: w,
                height: h
            };
            n._events[name] = fn;
            this.set(n, 10000);
        },

        touchStart: function(x, y, w, h, fn) {
            this.newEvent("touchStart", x, y, w, h, fn);
        },

        touchMove: function(x, y, w, h, fn) {
            this.newEvent("touchMove", x, y, w, h, fn);
        },

        touchEnd: function(x, y, w, h, fn) {
            this.newEvent("touchEnd", x, y, w, h, fn);
        },

        touchCancel: function(x, y, w, h, fn) {
            this.newEvent("touchCancel", x, y, w, h, fn);
        }
    };
})();