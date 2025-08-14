/*global Curve, Cat*/
(function () {
"use strict";

var canvas, ctx, rAF, curve, cat, t0, keys;

keys = {
	left: false,
	right: false,
	jump: false
};

document.addEventListener('keydown', function (e) {
	var key = {37: 'left', 38: 'jump', 39: 'right'}[e.keyCode];
	if (key) {
		keys[key] = true;
	}
});

document.addEventListener('keyup', function (e) {
	var key = {37: 'left', 38: 'jump', 39: 'right'}[e.keyCode];
	if (key) {
		keys[key] = false;
	}
});

function drawBackground (ctx) {
	ctx.fillStyle = '#008';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawCurve (curve, ctx) {
	ctx.fillStyle = '#080';
	ctx.strokeStyle = '#0f0';
	ctx.beginPath();
	ctx.moveTo(0, ctx.canvas.height);
	curve.path(ctx);
	ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

canvas = document.getElementById('c');
canvas.width = 800;
canvas.height = 400;
ctx = canvas.getContext('2d', {alpha: false});
rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame;

curve = new Curve([{x: 0, y: 350}, {x: 100, y: 370}, {x: 200, y: 350}, {x: 400, y: 340}, {x: 600, y: 300}, {x: 700, y: 350}, {x: 800, y: 350}], true, true);
cat = new Cat(curve, 120);

function loop (t) {
	var dt;
	if (t0) {
		dt = t - t0;
		cat.move(keys.left, keys.right, keys.jump, dt);
	}

	drawBackground(ctx);
	drawCurve(curve, ctx);
	cat.draw(ctx);

	t0 = t;
	rAF(loop);
}

rAF(loop);

})();