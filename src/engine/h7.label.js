H7.Label = H7.Node.extend({
    type: "Label",

    // 初始化
    ctor: function (txt) {
        this._text = [txt, ""].join("");
        this._needCul = true;

        this.define("text", {
            get: function () {
                return this._text;
            },
            set: function (v) {
                this._text = [v, ""].join("");
                this._needCul = true;
            }
        });
    },

    // integer
    shadowX: 0,

    // integer
    shadowY: 0,

    // integer
    shadowBlur: 0,

    // rgba(0, 0, 0, 0.5)
    shadowStyle: "#000000",

    // 文字
    text: "",

    // "Arial"
    font: "Black",

    // normal, italic, oblique
    fontWeight: "normal",

    fontSize: 12,

    fillColor: "#FFFFFF",

    fontStyle: "normal",

    // normal, small-caps
    fontVariant: "normal",


    lineHeight: 0,

    borderStyle: null,

    borderWidth: 0,

    // start, end, left, right, center
    align: 'left',

    // top, hanging, middle, alphabetic, ideographic, bottom
    valign: 'top',

    render: function (ctx) {
        this._text = (this._text || '').toString();
        if (!this.lineHeight) this.lineHeight = this.fontSize;
        if (this.shadowX) ctx.shadowOffsetX = this.shadowX;

        if (this.shadowY) ctx.shadowOffsetY = this.shadowY;

        if (this.shadowBlur) {
            ctx.shadowBlur = this.shadowBlur;
        }

        if (this.shadowStyle) {
            ctx.shadowStyle = this.shadowStyle;
        } else {
            ctx.shadowStyle = this.style;
        }

        this.align && (ctx.textAlign = this.align);

        this.valign && (ctx.textBaseline = this.valign);

        ctx.font = [this.fontStyle, this.fontWeight, this.fontSize * (H7.Game.retina ? 2 : 1) + "px", this.font].join(" ");

        if (this.borderStyle) {
            ctx.strokeStyle = this.borderStyle;
            ctx.lineWidth = this.borderWidth || 0;
        }

        if (this.width > 0 && !this._autoWidth) {
            if (!this._needCul && this._textList) {
                var textList = this._textList;
                var pos = this.getPos();
                var lineHeight = this.lineHeight * (H7.Game.retina ? 2 : 1);
                var len = textList.length;
                for (var i = 0; i < len; i++) {
                    if (this.borderWidth) {
                        ctx.strokeText(textList[i], pos.x, pos.y + i * lineHeight + (lineHeight - this.fontSize) / 2);
                    }
                    ctx.fillText(textList[i], pos.x, pos.y + i * lineHeight + (lineHeight - this.fontSize) / 2);
                }
            } else {
                var textList = [];

                // 计算一个字的长度
                var unitSize = ctx.measureText(this._text.substr(0, 1)).width;
                var charCount = Math.floor(this.width / unitSize);
                // 递归得出结果
                var t = this;

                var width = t.width * (H7.Game.retina ? 2 : 1);

                var textArry = this._text.split("\n");

                for (var nn = 0; nn < textArry.length; nn++) {
                    var index = 0;
                    var isHalf = false;
                    (function (txt, cc) {
                        var hangSize = ctx.measureText(txt.substr(index, cc)).width;
                        if (hangSize > width) {
                            cc--;
                            if (!isHalf) {
                                arguments.callee(txt, cc);
                                return;
                            }
                        }
                        if (hangSize < width && index + cc < txt.length) {
                            // 一半确认
                            isHalf = true;
                            cc++;
                            arguments.callee(txt, cc);
                            return;
                        }

                        textList.push(txt.substr(index, cc));
                        index += cc;

                        if (index < txt.length) {
                            isHalf = false;
                            arguments.callee(txt, charCount);
                        }
                    })(textArry[nn], charCount);
                }

                this._textList = textList;

                var pos = this.getPos();
                var lineHeight = this.lineHeight * (H7.Game.retina ? 2 : 1);
                var len = textList.length;
                for (var i = 0; i < len; i++) {
                    if (this.borderWidth) {
                        ctx.strokeText(textList[i], pos.x, pos.y + i * lineHeight + (lineHeight - this.fontSize) / 2);
                    }
                    ctx.fillText(textList[i], pos.x, pos.y + i * lineHeight + (lineHeight - this.fontSize) / 2);
                }

                var size = ctx.measureText(textList[0]);
                this._height = lineHeight * textList.length / (H7.Game.retina ? 2 : 1);
                if (this.target) {
                    this.target.culSize();
                }
                this._needCul = false;
            }
        } else {
            this._autoWidth = true;
            var pos = this.getPos();

            if (this._needCul) {
                var size = ctx.measureText(this._text);
                this._width = size.width / (H7.Game.retina ? 2 : 1);
                this._height = this.lineHeight;
                if (this.target) {
                    this.target.culSize();
                }
                this._needCul = false;
            }
            ctx.fillText(this._text, pos.x, pos.y);
        }
    }
});
