/*global Drone: true*/
Drone =
(function () {
"use strict";

function Drone (min, max, v) {
	this.min = min;
	this.max = max;
	this.v = v;
	this.x = min;
}

Drone.prototype.move = function (dt) {
	this.x += this.v * dt;
	if (this.x > this.max) {
		this.x = 2 * this.max - this.x;
		this.v *= -1;
	} else if (this.x < this.min) {
		this.x = 2 * this.min - this.x;
		this.v *= -1;
	}
};

Drone.prototype.draw = function (ctx, y) {
	var lr = this.x % 1 < 0.5;
	ctx.fillStyle = '#888';
	ctx.strokeStyle = '#666';
	ctx.lineWidth = 2;
	ctx.fillRect(this.x - 40, y + 15, 80, 25);
	ctx.beginPath();
	ctx.moveTo(this.x - 30, y + 15);
	ctx.lineTo(this.x - 30, y);
	ctx.lineTo(this.x - (lr ? 20 : 40), y);
	ctx.moveTo(this.x + 30, y + 15);
	ctx.lineTo(this.x + 30, y);
	ctx.lineTo(this.x + (lr ? 20 : 40), y);
	ctx.stroke();
};

return Drone;
})();