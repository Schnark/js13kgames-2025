/*global Curve, Block, Level, Cat, keys*/
(function () {
"use strict";

var canvas, ctx, rAF, ground, block, thornyBush, river, level, cat, t0, end;

canvas = document.getElementById('c');
canvas.width = 1000;
canvas.height = 600; //must be nominal height of level
ctx = canvas.getContext('2d', {alpha: false});
rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame;

ground = new Curve([{x: 0, y: 500}, {x: 200, y: 540}, {x: 400, y: 500}, {x: 800, y: 480}, {x: 1200, y: 400}, {x: 1400, y: 500}, {x: 2000, y: 500}]);
block = new Block(new Curve([{x: 600, y: 160}, {x: 800, y: 100}, {x: 1000, y: 140}]), new Curve([{x: 600, y: 220}, {x: 1000, y: 220}]));
thornyBush = new Block(new Curve([{x: 700, y: 450}, {x: 900, y: 450}]), new Curve([{x: 700, y: 550}, {x: 900, y: 550}]));
river = new Block(new Curve([{x: 1400, y: 499}, {x: 1500, y: 499}]), new Curve([{x: 1400, y: 550}, {x: 1500, y: 550}]));
level = new Level(ground, [block], [thornyBush], [river], 240, 1970);
cat = new Cat(level);

function loop (t) {
	var dt, stopLoop;
	if (t0) {
		dt = t - t0;
		if (!end) {
			end = cat.move(keys.left, keys.right, keys.jump, dt);
		} else {
			cat.move(false, false, false, dt);
		}
	}

	if (end) {
		stopLoop = level.drawEnd(ctx, cat, end, dt);
	} else {
		level.draw(ctx, cat);
	}

	t0 = t;
	if (!stopLoop) {
		rAF(loop);
	} else {
		switch (end) {
		case 1:
			window.alert('You die after falling into a thorny bush.');
			break;
		case 2:
			window.alert('You die after falling into a river.');
			break;
		case -1:
			window.alert('You win!');
		}
	}
}

rAF(loop);

})();