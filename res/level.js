/*global Level: true*/
Level =
(function () {
"use strict";

var SKY = '#008',
	GRASS = '#080',
	WOOD = '#f80',
	THORNS = '#f00',
	WATER = '#00f';

function Level (ground, blocks, thorns, rivers, start, end) {
	this.ground = ground;
	this.blocks = blocks;
	this.thorns = thorns;
	this.rivers = rivers;
	this.start = start;
	this.end = end;
	this.min = ground.min;
	this.max = ground.max;
	this.endTime = 0;
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

Level.prototype.getEnd = function (x, y) {
	var i;
	for (i = 0; i < this.thorns.length; i++) {
		if (this.thorns[i].inside(x, y)) {
			return 1;
		}
	}
	for (i = 0; i < this.rivers.length; i++) {
		if (this.rivers[i].inside(x, y)) {
			return 2;
		}
	}
	if (x >= this.end) {
		return -1;
	}
};

Level.prototype.draw = function (ctx, cat, noCatNoRestore) {
	var w, h, dx, dy, x, y, i;
	w = ctx.canvas.width;
	h = ctx.canvas.height;
	dx = (cat.x0 + cat.x1) / 2 - w / 2;
	dx = Math.min(this.max - w, dx);
	dx = Math.max(0, dx);
	dy = (cat.y0 + cat.y1) / 2 - h / 3;
	dy = Math.min(0, dy);

	//background
	ctx.fillStyle = SKY;
	ctx.fillRect(0, 0, w, h);

	ctx.save();
	ctx.translate(-dx, -dy);

	//ground
	ctx.fillStyle = GRASS;
	ctx.beginPath();
	ctx.moveTo(this.min, h);
	this.ground.path(ctx);
	ctx.lineTo(this.max, h);
	ctx.closePath();
	ctx.fill();
	//blocks
	ctx.fillStyle = WOOD; //TODO also allow GRASS
	ctx.beginPath();
	for (i = 0; i < this.blocks.length; i++) {
		this.blocks[i].path(ctx);
	}
	ctx.fill();
	//cat
	if (!noCatNoRestore) {
		cat.draw(ctx);
	}
	//grass
	/*ctx.beginPath()
	for (x = dx; x < dx + w; x++) {
		if (this.min <= x && x <= this.max && Math.sin(8.1344 * x) > 0.5) {
			y = this.ground.y(x);
			ctx.moveTo(x, y + 10);
			ctx.lineTo(x, y - 3);
		}
	}
	ctx.strokeStyle = GRASS;
	ctx.lineWidth = 1;
	ctx.stroke();*/
	//thorns and rivers
	ctx.fillStyle = THORNS;
	ctx.beginPath();
	for (i = 0; i < this.thorns.length; i++) {
		this.thorns[i].path(ctx);
	}
	ctx.fill();
	ctx.fillStyle = WATER;
	ctx.beginPath();
	for (i = 0; i < this.rivers.length; i++) {
		this.rivers[i].path(ctx);
	}
	ctx.fill();

	if (!noCatNoRestore) {
		ctx.restore();
	}
};

Level.prototype.drawEnd = function (ctx, cat, end, dt) {
	var x, y, i;
	this.endTime += dt;
	this.draw(ctx, cat, end !== -1);
	x = (cat.x0 + cat.x1) / 2;
	y = (cat.y0 + cat.y1) / 2;
	switch (end) {
	case 1:
		ctx.translate(x, y);
		ctx.fillStyle = '#000';
		for (i = 0; i < 100; i++) {
			ctx.beginPath();
			ctx.arc(0, (i + 1) * this.endTime / 200, 5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.rotate(0.5);
		}
		ctx.restore();
		break;
	case 2:
		ctx.fillStyle = WATER;
		ctx.beginPath();
		ctx.arc(x, y, this.endTime, 0, 2 * Math.PI);
		ctx.fill();
		cat.draw(ctx);
		ctx.restore();
	}
	ctx.fillStyle = 'rgba(0,0,0,' + (this.endTime / 2000) + ')';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	return this.endTime > 2000;
};

return Level;
})();