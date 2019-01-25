H7.Input = H7.Node.extend({
    type: "Input",

    ctor: function(value, w, h) {
        this.originText = this.value = value;
        this.width = w;
        this.height = h;

        this.define("value", {
            get: function() {
                return this._value;
            },
            set: function(v) {
                this._value = v;
                if (this._input) {
                    this._input.value = this._value;
                }
            }
        });
    },

    // 文字
    _value: "",

    // "Arial"
    font: "Black",

    // normal, italic, oblique
    fontWeight: "normal",

    fontSize: 12,

    fillColor: "#000000",

    fontStyle: "normal",

    borderStyle: null,

    letterSpacing: 0,

    // start, end, left, right, center
    align: 'left',

    // top, hanging, middle, alphabetic, ideographic, bottom
    valign: 'top',

    render: function(ctx) {
        if (this._input) {
            return;
        }

        var canvas = H7.Game.getCanvas();
        var top = canvas.offsetTop,
            left = canvas.offsetLeft;
        var pos = this.getAbsolutePos();
        top += pos.y;
        left += pos.x;
        var wSize = H7.Game.getSize();
        var hp = wSize.height / document.documentElement.clientHeight,
            wp = wSize.width / document.documentElement.clientWidth;
        var input = document.createElement("input");
        input.type = "value";
        input.className = "h7_input";
        input.style.position = "absolute";
        input.style.width = this.width + "px";
        input.style.height = this.height + "px";
        input.style.zIndex = 9999;
        input.style.top = (top / hp) + "px";
        input.style.left = (left / wp) + "px";
        input.style.outline = "none";
        input.style.align = this.align;
        input.style.valign = this.valign;
        input.style.background = "transparent";
        input.placeholder = this.originText;
        input.style.color = this.fillColor;
        input.style.fontWeight = this.fontWeight;
        input.style.border = this.borderStyle || "none";
        input.style.fontSize = this.fontSize + "px";
        input.style.transformOrigin = "0% 0%";
        input.style.transform = ["scale(", 1 / wp, ",", 1 / hp, ")"].join("");
        input.style.letterSpacing = this.letterSpacing + "px";
        document.body.appendChild(input);
        // input.focus();
        input.blur();
        input.addEventListener("keyup", function() {
            t.value = input.value;
        });
        var t = this;
        this._input = input;
    },

    touchStart: function() {
        this.isFocus = true;
    },
    touchEnd: function() {
        if (this.isFocus) {
            this.isFocus = false;

        }
    },
    touchCancel: function() {
        if (!this.value) {
            this.value = this.originText;
        }
        this.isFocus = false;
    }
});


H7.Input.clear = function() {
    var inputs = document.querySelectorAll("input.h7_input");
    for (var i = 0; i < inputs.length; i++) {
        document.body.removeChild(inputs[i]);
    }
};