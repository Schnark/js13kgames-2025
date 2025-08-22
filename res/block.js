/*global Block: true*/
Block =
(function () {
"use strict";

function Block (top, bottom) {
	this.top = top;
	this.bottom = bottom;
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

Block.prototype.path = function (ctx) {
	this.bottom.pathBottom(ctx);
	this.top.path(ctx);
	ctx.closePath();
};

Block.prototype.thornyPath = function (ctx) {
	//TODO
	this.path(ctx);
};

Block.prototype.y = function (x) {
	return this.top.y(x);
};

return Block;
})();