/*global Curve, Block, Level, Cat, keys*/
(function () {
"use strict";

var canvas, ctx, rAF, ground, block, level, cat, t0;

canvas = document.getElementById('c');
canvas.width = 800;
canvas.height = 400;
ctx = canvas.getContext('2d', {alpha: false});
rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame;

ground = new Curve([{x: 0, y: 350}, {x: 100, y: 370}, {x: 200, y: 350}, {x: 400, y: 340}, {x: 600, y: 300}, {x: 700, y: 350}, {x: 800, y: 350}]);
block = new Block(new Curve([{x: 300, y: 180}, {x: 400, y: 150}, {x: 500, y: 170}]), new Curve([{x: 300, y: 200}, {x: 500, y: 200}]));
level = new Level(ground, [block], 120);
cat = new Cat(level);

function loop (t) {
	var dt;
	if (t0) {
		dt = t - t0;
		cat.move(keys.left, keys.right, keys.jump, dt);
	}

	level.draw(ctx, cat);

	t0 = t;
	rAF(loop);
}

rAF(loop);

})();