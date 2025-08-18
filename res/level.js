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
	var i;
	//background
	ctx.fillStyle = '#008';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	//ground
	ctx.fillStyle = '#080';
	ctx.beginPath();
	ctx.moveTo(0, ctx.canvas.height);
	this.ground.path(ctx);
	ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
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
};

return Level;
})();