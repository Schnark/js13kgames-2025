/*global Block: true*/
Block =
(function () {
"use strict";

function Block (top, bottom, type) {
	this.top = top;
	this.bottom = bottom;
	this.type = type;
	this.min = top.min; //must be === bottom.min
	this.max = top.max; //must be === bottom.max
}

Block.prototype.inside = function (x, y) {
	var top, bottom;
	if (x <= this.min || x >= this.max) {
		return false;
	}
	top = this.top.y(x);
	bottom = this.bottom.y(x);
	return y > top && y < bottom && {l: x - this.min, r: this.max - x, t: y - top, b: bottom - y, block: this};
};

Block.prototype.path = function (ctx, t) {
	if (this.type === 2) {
		this.thornyPath(ctx);
		return;
	}
	this.bottom.pathBottom(ctx);
	this.top.path(ctx);
	ctx.closePath();
	if (this.type === 3) {
		this.waterPath(ctx, t);
	}
};

Block.prototype.thornyPath = function (ctx) {
	//TODO
	var x, y, Y, out = true;
	x = this.min;
	y = this.top.y(x);
	ctx.moveTo(x, y);
	while (x < this.max - 10) {
		x += 5;
		y = this.top.y(x);
		out = !out;
		ctx.lineTo(x, y + (out ? -1 : 10));
	}
	x = this.max;
	y = this.top.y(x);
	ctx.lineTo(x, y);
	out = true;
	Y = this.bottom.y(x);
	while (y < Y - 10) {
		y += 5;
		out = !out;
		ctx.lineTo(x + (out ? 1 : -10), y);
	}
	y = Y;
	ctx.lineTo(x, y);
	out = true;
	while (x > this.min + 10) {
		x -= 5;
		y = this.bottom.y(x);
		out = !out;
		ctx.lineTo(x, y + (out ? 1 : -10));
	}
	x = this.min;
	y = this.bottom.y(x);
	ctx.lineTo(x, y);
	out = true;
	Y = this.top.y(x);
	while (y > Y + 10) {
		y -= 5;
		out = !out;
		ctx.lineTo(x + (out ? -1 : 10), y);
	}
	ctx.closePath();
};

Block.prototype.waterPath = function (ctx, t) {
	//TODO
	var top = this.top;

	function wave (x) {
		ctx.moveTo(x - 20, top.y(x - 20) + 2);
		ctx.quadraticCurveTo(x, top.y(x) - 5, x + 20, top.y(x + 20) + 2);
	}

	wave(this.min + 20 + (this.max - this.min - 40) * (1 + Math.sin(t / 700)) / 2);
	wave(this.min + 20 + (this.max - this.min - 40) * (1 + Math.sin(t / 600)) / 2);
	wave(this.min + 20 + (this.max - this.min - 40) * (1 + Math.sin(t / 500)) / 2);
	ctx.closePath();
};

Block.prototype.y = function (x) {
	return this.top.y(x);
};

return Block;
})();