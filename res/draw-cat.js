/*global drawCat: true*/
drawCat =
(function () {
"use strict";

function drawCatPlaceholder (ctx, l) {
	ctx.fillStyle = '#000';
	ctx.fillRect(0, -60, l, 60);
	ctx.fillStyle = '#ff0';
	ctx.fillRect(l - 20, -40, 10, 10);
}

function drawCat (ctx, l, a, w, v) {
	var xb0, yb0, xb1, yb1, xb2, yb2, xb3, yb3, //body
		xbc0, ybc0, xbc1, ybc1, xbc2, ybc2, xbc3, ybc3,
		xt, yt, //tail
		xtc0, ytc0, xtc1, ytc1,
		xf0, yf0, xf1, yf1, xf2, yf2, xf3, yf3, //feet
		m;

	xb0 = 25 + 25 * Math.sin(a);
	yb0 = -40;
	xb1 = l - 25 + 25 * Math.sin(a);
	yb1 = -40;
	xb2 = xb1 + 5;
	yb2 = -17;
	xb3 = xb0 - 5;
	yb3 = -17;
	xbc0 = (xb0 + xb1) / 2;
	ybc0 = (yb0 + yb1) / 2 + 2 * Math.sin(2 * Math.PI * v) + Math.min(0, l - 100);
	xbc1 = (xb1 + xb2) / 2 + 2 + Math.sin(6 * v);
	ybc1 = (yb1 + yb2) / 2;
	xbc2 = xbc0;
	ybc2 = ybc0 + 23;
	xbc3 = (xb3 + xb0) / 2 - 2 - Math.sin(6 * v);
	ybc3 = (yb3 + yb0) / 2;

	xt = 1.5 * Math.sin(7 * v);
	yt = Math.sin(6 * v) - 12;
	xtc0 = xb0 - 20;
	m = (ybc0 - yb0) / (xbc0 - xb0);
	ytc0 = m * xtc0 + ybc0 - m * xbc0;
	xtc1 = xt + 10;
	ytc1 = yt - 10;

	xf0 = 0;
	yf0 = 0;
	xf1 = xb3;
	yf1 = 0;
	xf2 = xb2;
	yf2 = 0;
	xf3 = l;
	yf3 = 0;

	ctx.save();
	ctx.fillStyle = '#000';
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 7;
	ctx.lineCap = 'round';

	ctx.beginPath();
	ctx.moveTo(xb0, yb0);
	ctx.quadraticCurveTo(xbc0, ybc0, xb1, yb1);
	ctx.quadraticCurveTo(xbc1, ybc1, xb2, yb2);
	ctx.quadraticCurveTo(xbc2, ybc2, xb3, yb3);
	ctx.quadraticCurveTo(xbc3, ybc3, xb0, yb0);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(xb0, yb0);
	ctx.bezierCurveTo(xtc0, ytc0, xtc1, ytc1, xt, yt);

	ctx.moveTo(xb3, yb3);
	ctx.lineTo(xf0, yf0);
	ctx.moveTo(xb3, yb3);
	ctx.lineTo(xf1, yf1);
	ctx.moveTo(xb2, yb2);
	ctx.lineTo(xf2, yf2);
	ctx.moveTo(xb2, yb2);
	ctx.lineTo(xf3, yf3);
	ctx.stroke();

	ctx.translate(xb1 - 5, yb1 + 10);
	ctx.rotate(0.2 * Math.sin(v) - 0.4 * Math.sin(a));

	ctx.beginPath();
	ctx.arc(15, -15, 15, 0, 2 * Math.PI);
	ctx.fill();

	ctx.fillStyle = '#ff0';
	ctx.beginPath();
	ctx.arc(20, -17, 2.5, 0, 2 * Math.PI);
	ctx.fill();

	ctx.restore();
}

return drawCat;
})();