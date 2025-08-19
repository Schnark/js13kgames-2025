/*global Curve, Block, Level, Cat, keys*/
(function () {
"use strict";

var canvas, ctx, rAF, ground, block, level, cat, t0;

canvas = document.getElementById('c');
canvas.width = 1000;
canvas.height = 600; //must be nominal height of level
ctx = canvas.getContext('2d', {alpha: false});
rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame;

ground = new Curve([{x: 0, y: 500}, {x: 200, y: 540}, {x: 400, y: 500}, {x: 800, y: 480}, {x: 1200, y: 400}, {x: 1400, y: 500}, {x: 1600, y: 500}]);
block = new Block(new Curve([{x: 600, y: 160}, {x: 800, y: 100}, {x: 1000, y: 140}]), new Curve([{x: 600, y: 200}, {x: 1000, y: 200}]));
level = new Level(ground, [block], 240);
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