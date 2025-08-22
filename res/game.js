/*global Canvas, Curve, Block, Level*/
(function () {
"use strict";

var canvas, ground, block, thornyBush, river, level;

canvas = new Canvas(document.getElementById('c'), 700, 700, 1400); //first 700 = nominal height of level

ground = new Curve([{x: 0, y: 600}, {x: 200, y: 640}, {x: 400, y: 600}, {x: 800, y: 580}, {x: 1200, y: 500}, {x: 1400, y: 600}, {x: 2500, y: 600}]);
block = new Block(new Curve([{x: 600, y: 280}, {x: 800, y: 220}, {x: 1000, y: 260}]), new Curve([{x: 600, y: 340}, {x: 1000, y: 340}]));
thornyBush = new Block(new Curve([{x: 700, y: 550}, {x: 900, y: 550}]), new Curve([{x: 700, y: 650}, {x: 900, y: 650}]));
river = new Block(new Curve([{x: 1400, y: 599}, {x: 1500, y: 599}]), new Curve([{x: 1400, y: 650}, {x: 1500, y: 650}]));
level = new Level(ground, [block], [thornyBush], [river], [1950], [[1750, 2150]]);

function onEnd (end) {
	//TODO set text earlier
	switch (end) {
	case 1:
		canvas.setText('You die after falling into a thorny bush.');
		break;
	case 2:
		canvas.setText('You die after falling into a river.');
		break;
	case 3:
		canvas.setText('You die after a drone shot you.');
		break;
	case -1:
		canvas.setText('You win!');
	}
	if (end !== -1) {
		level.run(canvas, onEnd);
	}
}

level.run(canvas, onEnd);

})();