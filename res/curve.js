/*global Curve: true*/
Curve =
(function () {
"use strict";

function Curve (points, closed0, closed1) {
	this.points = points;
	this.min = points[0].x;
	this.max = points[points.length - 1].x;
	this.closed0 = closed0;
	this.closed1 = closed1;
}

Curve.prototype.y = function (x) {
	var i = 0;
	while (this.points[i + 1].x < x) {
		i++;
	}
	return this.points[i].y + (this.points[i + 1].y - this.points[i].y) * (x - this.points[i].x) / (this.points[i + 1].x - this.points[i].x);
};

Curve.prototype.path = function (ctx) {
	var i;
	for (i = 0; i < this.points.length; i++) {
		ctx.lineTo(this.points[i].x, this.points[i].y);
	}
};

return Curve;
})();