# H7.GameEngine

轻量级H5游戏引擎

* 初始化引擎
```
H7.Game.init({
	id: "#main",
	height: 600,
	retina: true,
	width: 360
});
```

* 新建场景

``` 
var MainScene = H7.Scene.extend({
    ctor: function () {
		// TODO: something
    }

});
var scene = new MainScene();

// 或者直接创建场景
var scene = new H7.Scene();
```

* 新建层

``` 
var MainLayer = H7.Layer.extend({
    ctor: function (type) {
		// TODO: something
    }
});
var layer = new MainLayer(1);

// 或者直接创建场景
var layer = new H7.Layer();

layer.attr({
	x: 0,
	y: 0 //wSize.height / 2
});
```

* 将层加入场景
```
scene.add(layer);
```

* 新建Sprite
```
var sprite = new H7.Sprite("assets/meinv.png");
sprite.attr({
	width: 180,
	height: 300,
});
// scene.add(sprite);
layer.add(sprite);
```

* 新建Label
```
var fpsLabel = new H7.Label(H7.Game.FPS);
fpsLabel.attr({
	x: 100,
	y: 100,
	fillColor: "#FF0000",
	// scale:[1,2],
	// rotate: 90,
	// skew: [0,0],
	// anchor: 0,
	fontSize: 20
});
layer.add(fpsLabel, 100);
```

* 运行场景
```
H7.Game.run(scene);
```

* 开始游戏
```
H7.Game.start();
```