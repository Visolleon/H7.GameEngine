H7.Audio = (function () {
    var m = {},
        isSupportSound = true,
        // 是否支持mp3
        g = !1,
        audioCtx,
        gainNode,
        audioContext = window.AudioContext || window.webkitAudioContext;

    var c = {};

    if (audioContext) {
        audioCtx = new audioContext();
        window.h7audio = audioCtx;
        gainNode = audioCtx.createGain();

        window.addEventListener("blur", function () {
            H7.Audio.pause();
        });
        window.addEventListener("focus", function () {
            H7.Audio.resume();
        });
    } else {
        if ("undefined" === typeof Audio) {
            isSupportSound = false;
        } else {
            var ua = navigator.userAgent.toLowerCase();
            if (-1 < ua.indexOf("firefox") || -1 < ua.indexOf("opera")) {
                g = !0
            } else {
                if (ua.match(/android/i) || ua.match(/webos/i) || ua.match(/iphone/i)
                    || ua.match(/ipad/i) || ua.match(/ipod/i) || ua.match(/blackberry/i)
                    || ua.match(/windows phone/i)) {
                    isSupportSound = true;
                }
            }
        }
    }

    c.canPlay = function () {
        return isSupportSound
    };
    c.load = function (id, src, callback) {
        if (m[id]) {
            callback && callback();
            return;
        }
        if (isSupportSound) {
            if (audioCtx) {
                var e = new XMLHttpRequest;
                e.open("get", src, !0);
                e.responseType = "arraybuffer";
                e.onload = function () {
                    audioCtx.decodeAudioData(e.response, function (a) {
                        m[id] = { buffer: a };
                        callback && callback()
                    })
                };
                e.send()
            } else {
                m[id] = new Audio();
                if (callback) {
                    m[id].preload = "auto";
                    m[id].onloadeddata = callback;
                }
                m[id].src = g ? src.replace(".mp3", ".ogg") : src;
            }
        } else {
            callback && callback()
        }
    };
    c.play = function (a) {
        var e;
        if (isSupportSound) {
            e = m[a];
            if (audioCtx) {
                c.stop(a);
                e.sourceNode = audioCtx.createBufferSource();
                e.sourceNode.buffer = e.buffer;
                e.sourceNode.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                if ("undefined" !== typeof e.sourceNode.noteOn) {
                    e.sourceNode.noteOn(0)
                } else {
                    e.sourceNode.start(0)
                }
            } else {
                e.currentTime = 0;
                e.play();
            }
        }
    };
    c.loop = function (a) {
        var e;
        if (isSupportSound) {
            e = m[a];

            if (audioCtx) {
                c.stop(a);
                e.sourceNode = audioCtx.createBufferSource();
                e.sourceNode.loop = true;
                e.sourceNode.buffer = e.buffer;
                e.sourceNode.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                if ("undefined" !== typeof e.sourceNode.noteOn) {
                    e.sourceNode.noteOn(0)
                } else {
                    e.sourceNode.start(0)
                }
            } else {
                if ("boolean" === typeof e.loop) {
                    e.loop = true;
                } else {
                    e.addEventListener("ended", function () {
                        this.currentTime = 0;
                        this.play()
                    }, false);
                }
                e.play();
            }
        }
    };
    c.stop = function (e) {
        if (isSupportSound) {
            e = m[e];
            if (audioCtx) {
                if (e.sourceNode) {
                    if ("undefined" !== typeof e.sourceNode.noteOff) {
                        e.sourceNode.noteOff(0);
                    } else {
                        e.sourceNode.stop(0);
                    }
                    e.sourceNode = null;
                }
            } else {
                e.pause();
                e.currentTime = 0;
            }
        }
    }

    c.pause = function () {
        if (audioCtx) {
            audioCtx.suspend();
        } else {
            for (var k in m) {
                m[k].pause && m[k].pause();
            }
        }
    };

    c.resume = function () {
        audioCtx && audioCtx.resume();
    };

    c.setVolume = function (v) {
        if (gainNode) {
            gainNode.gain.value = v;
        } else {
            for (var k in m) {
                m[k].volume = v;
            }
        }
    };

    c.getVolume = function () {
        if (gainNode) {
            return gainNode.gain.value;
        } else {
            var v = 1;
            for (var k in m) {
                v = m[k].volume;
                break;
            }
            return v;
        }
    };

    return c;
})();