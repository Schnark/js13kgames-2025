/*global Curve: true*/
Curve =
(function () {
"use strict";

function Curve (points) {
	this.points = points;
	this.min = points[0].x;
	this.max = points[points.length - 1].x;
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

Curve.prototype.pathBottom = function (ctx) {
	/*like .path, but
	(1) starts with a moveTo
	(2) from right to left
	(3) with visual offset to top to accommodate for height of cat*/
	var i, l = this.points.length;
	ctx.moveTo(this.points[l - 1].x, this.points[l - 1].y - 30);
	for (i = l - 2; i >= 0; i--) {
		ctx.lineTo(this.points[i].x, this.points[i].y - 30);
	}
};

return Curve;
})();