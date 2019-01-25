var MainLayer = H7.Layer.extend({
    ctor: function (type) {
        // if (type == 1) {
            var wSize = H7.Game.getSize();
            var scroll = new H7.ScrollView();
            scroll.attr({
                width: 200,
                height: 300
            });
            this.add(scroll);
            this.scroll = scroll;
        // }

        // for (var i = 0; i < 10; i++) {
        //     var sprite = new H7.Sprite("assets/meinv.png");
        //     sprite.attr({
        //         x: Math.floor(Math.random() * 360) - 180,
        //         y: Math.floor(Math.random() * 680) - 340,
        //         width: 180,
        //         height: 300,
        //     });
        //     // if (type == 1) {
        //     //     scroll.add(sprite);
        //     // } else {
        //     this.add(sprite);
        // }
        // }

        var label = new H7.Label("我爱你|,./?:'~我爱你我爱你我爱你我爱你1234567890我爱你zbcdefghijklmnopqrstuvwxyz;!@#$%^&*()_-+=ILoveYou,123456");
        label.attr({
            width: 200,
            fontSize: 18,
            lineHeight: 28,
            y: 220,
            x: 0
        });
        if (type == 1) {
            scroll.add(label, 10);
        } else {
            this.add(label, 10);
        }

        var t = this;

        var texture = new Image();
        texture.onload = function () {
            var num = new H7.Number(this, 25, 27);
            num.setText(52684);
            num.attr({
                x: 150,
                y: 300
            });
            t.add(num, 100);
        };
        texture.src = "assets/sz.png";
        this.scale = 0.5;

        H7.Texture.load("assets/sp1.json", function () {
            t.add(new H7.Sprite("haohuamaojiazi", true));
            var s2 = new H7.Sprite(H7.Texture.get("putongguantou"));
            s2.touchStart = function () {
                console.log("s2 touched...");
            };
            s2._isDrawRect = true;
            s2.x = 200;
            s2.y = 500;
            s2.anchorX = 1;
            s2.anchorY = 1;
            s2.scale = 0.5;
            t.add(s2);
        });


        var rect = new H7.Rect(100, 100);
        rect.attr({
            y: 120,
            x: 150,
            // scale: 2,
            _isDrawRect: true,
            fillStyle: "#00F0F0"
        });
        this.add(rect, 100);

        rect.animate({
            attr: "rotate",
            from: 0,
            to: 360,
            duration: 1000,
            times: 0
        });

        var arc = new H7.Arc(100);
        arc.attr({
            _isDrawRect: true,
            y: 100,
            fillStyle: "#FEA000",
            startAngle: 0,
            endAngle: 180
        });
        this.add(arc, 101);

        arc.animate({
            attr: "rotate",
            from: 0,
            to: 360,
            duration: 2000,
            times: 0
        });

        arc.touchStart = function (e) {
            console.log("Arc:", e);
        };

        // H7.Audio.registerSound("assets/sound/bgm_org.ogg", "assets/sound/bgm_org.ogg", function () {
        // });

        // H7.Audio.playSound("assets/sound/bgm_org.ogg");
    },

    scrollTo: function () {
        this.scroll && this.scroll.animateTo.apply(this.scroll, arguments);
    }
});