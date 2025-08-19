/*global Level: true*/
Level =
(function () {
"use strict";

function Level (ground, blocks, start) {
	this.ground = ground;
	this.blocks = blocks;
	this.start = start;
	this.min = ground.min;
	this.max = ground.max;
}

Level.prototype.insideBlock = function (x, y) {
	var i, inside;
	for (i = 0; i < this.blocks.length; i++) {
		inside = this.blocks[i].inside(x, y);
		if (inside) {
			return inside;
		}
	}
};

Level.prototype.draw = function (ctx, cat) {
	var w, h, x, y, i;
	w = ctx.canvas.width;
	h = ctx.canvas.height;
	x = (cat.x0 + cat.x1) / 2 - w / 2;
	x = Math.min(this.max - w, x);
	x = Math.max(0, x);
	y = (cat.y0 + cat.y1) / 2 - h / 3;
	y = Math.min(0, y);

	//background
	ctx.fillStyle = '#008';
	ctx.fillRect(0, 0, w, h);

	ctx.save();
	ctx.translate(-x, -y);

	//ground
	ctx.fillStyle = '#080';
	ctx.beginPath();
	ctx.moveTo(this.min, h);
	this.ground.path(ctx);
	ctx.lineTo(this.max, h);
	ctx.closePath();
	ctx.fill();
	//blocks
	ctx.fillStyle = '#f80';
	ctx.beginPath();
	for (i = 0; i < this.blocks.length; i++) {
		this.blocks[i].path(ctx);
	}
	ctx.fill();
	//cat
	cat.draw(ctx);

	ctx.restore();
};

return Level;
})();