var MainScene = H7.Scene.extend({
    ctor: function () {

        var fpsLabel = H7.Label.create({
            // fpsLabel.attr({
            text: H7.Game.FPS,
            x: 100,
            y: 100,
            fillColor: "#FF0000",
            // _isDrawRect: true,
            // scale:[1,2],
            // rotate: 90,
            // skew: [0,0],
            // anchor: 0,
            fontSize: 20
        });
        this.add(fpsLabel, 100);

        // fpsLabel.cache();
        fpsLabel.update = function (t) {
            fpsLabel.text = "FPS帧数:" + H7.Game.FPS.toFixed(2) + " | " + t.toFixed(1);
            // fpsLabel.skewX++;
            // fpsLabel.skewY--;
        };

        var wSize = H7.Game.getSize();
        var layer = new MainLayer(1);
        // layer.attr({
        //     x: wSize.width / 2,
        //     y: wSize.height / 2
        // });
        this.add(layer);
        this.layer = layer;
    },

    scrollTo: function (x, y) {
        this.layer.scrollTo(x, y);
    }

});