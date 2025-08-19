/*global drawCat*/
(function () {
"use strict";

var canvas = document.getElementById('c'),
	ctx = canvas.getContext('2d'),
	inputs = {
		length: document.getElementById('length'),
		angle: document.getElementById('angle'),
		walk: document.getElementById('walk'),
		vary: document.getElementById('vary')
	},
	rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame,
	t0;

function testCat (l, a, w, v) {
	ctx.fillStyle = '#88f';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#080';
	ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
	ctx.save();
	ctx.translate(10, 70);
	drawCat(ctx, l, a, w, v);
	ctx.strokeStyle = '#f00';
	ctx.strokeRect(0, -60, l, 60);
	ctx.restore();
}

function loop (t) {
	var dt, l, a, w, v;
	if (!t0) {
		t0 = t;
	}
	dt = t - t0;
	if (inputs.length.checked) {
		l = 100 + 20 * Math.sin(dt / 300);
	} else {
		l = 100;
	}
	if (inputs.angle.checked) {
		a = Math.PI / 2 * Math.sin(dt / 400);
	} else {
		a = 0;
	}
	if (inputs.walk.checked) {
		w = dt / 2000;
	} else {
		w = 0;
	}
	if (inputs.vary.checked) {
		v = dt / 1500;
	} else {
		v = 0;
	}
	testCat(l, a, w, v);
	rAF(loop);
}

rAF(loop);

})();