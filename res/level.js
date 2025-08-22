/*global Level: true*/
/*global Curve, Drone, Cat, keys*/
Level =
(function () {
"use strict";

var SKY = '#004',
	HILL = '#8f8',
	GRASS = '#040',
	WOOD = '#620',
	THORNS = '#800',
	WATER = '#00a',
	SHADOW = '#111';

function Level (ground, blocks, thorns, rivers, shadows, drones) {
	var hillData = [], x, y;
	this.ground = ground;
	this.blocks = blocks;
	this.thorns = thorns;
	this.rivers = rivers;
	this.shadows = shadows;
	this.droneData = drones;
	this.min = ground.min;
	this.max = ground.max;

	x = this.min;
	y = 100 + 50 * Math.random();
	hillData.push({x: x, y: y});
	while (x < this.max) {
		x += 100 + 100 * Math.random();
		y = 100 + 50 * Math.random();
		hillData.push({x: x, y: y});
	}
	this.hills = new Curve(hillData);
}

Level.prototype.run = function (canvas, callback) {
	var cat, t0, start, end,
		level = this,
		rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame;
	this.startTime = 0;
	this.endTime = 0;
	this.animationTime = 0;
	this.drones = this.droneData.map(function (data) {
		return new Drone(data[0], data[1], data[2] || 0.1);
	});

	function loop (t) {
		var dt = 0, i, stopLoop;
		if (t0) {
			dt = t - t0;
			if (!start && !end) {
				for (i = 0; i < level.drones.length; i++) {
					level.drones[i].move(dt);
				}
				end = cat.move(keys.left, keys.right, keys.jump, dt);
			} else if (start || end === -1) {
				cat.move(false, false, false, dt);
			}
		}

		if (start) {
			start = !level.drawStart(canvas, cat, dt);
		} else if (end) {
			stopLoop = level.drawEnd(canvas, cat, dt, end);
		} else {
			level.draw(canvas, cat, dt);
		}
		if (!start && !end && (keys.left || keys.right || keys.jump)) {
			canvas.setText();
		}
		canvas.showText();

		t0 = t;
		if (!stopLoop) {
			rAF(loop);
		} else {
			callback(end);
		}
	}

	start = true;
	cat = new Cat(level);
	rAF(loop);
};

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
	if (x >= this.max - 140) {
		return -1;
	}
};

Level.prototype.getDroneEnd = function (x, y) {
	var i;
	for (i = 0; i < this.shadows.length; i++) {
		if (Math.abs(this.shadows[i] - x) < 60 && this.ground.y(x) - y < 40) {
			return;
		}
	}
	for (i = 0; i < this.drones.length; i++) {
		if (Math.abs(this.drones[i].x - x) < 10) {
			return 3;
		}
	}
};

Level.prototype.draw = function (canvas, cat, dt, noCatNoRestore) {
	var dx, dy, x, y, i;
	dx = (cat.x0 + cat.x1) / 2 - canvas.w / 2;
	dx = Math.min(this.max - canvas.w, dx);
	dx = Math.max(0, dx);
	dy = (cat.y0 + cat.y1) / 2 - canvas.h / 3;
	dy = Math.min(0, dy);
	this.animationTime += dt;

	//background
	canvas.ctx.fillStyle = SKY;
	canvas.ctx.fillRect(0, 0, canvas.w, canvas.h);

	canvas.ctx.save();
	canvas.ctx.translate(-dx / 2, -0.25 * dy);

	//hills
	canvas.ctx.fillStyle = HILL;
	canvas.ctx.beginPath();
	canvas.ctx.moveTo(this.min, canvas.h);
	this.hills.path(canvas.ctx);
	canvas.ctx.lineTo(this.max, canvas.h);
	canvas.ctx.closePath();
	canvas.ctx.fill();

	canvas.ctx.translate(-dx / 2, -0.75 * dy);

	//sign post at the end
	y = this.ground.y(this.max - 140);
	canvas.ctx.fillStyle = WOOD;
	canvas.ctx.beginPath();
	canvas.ctx.rect(this.max - 150, y - 200, 20, 220);
	canvas.ctx.moveTo(this.max - 190, y - 170);
	canvas.ctx.lineTo(this.max - 90, y - 170);
	canvas.ctx.lineTo(this.max - 80, y - 155);
	canvas.ctx.lineTo(this.max - 90, y - 140);
	canvas.ctx.lineTo(this.max - 190, y - 140);
	canvas.ctx.closePath();
	canvas.ctx.fill();

	//drones
	for (i = 0; i < this.drones.length; i++) {
		this.drones[i].draw(canvas.ctx, 10 + dy);
	}

	//shadows
	canvas.ctx.fillStyle = SHADOW;
	canvas.ctx.beginPath();
	for (i = 0; i < this.shadows.length; i++) {
		x = this.shadows[i];
		if (x - 110 > dx + canvas.w || x + 110 < dx) {
			continue;
		}
		y = this.ground.y(x);
		canvas.ctx.moveTo(x - 110, this.ground.y(x - 110) + 30);
		canvas.ctx.bezierCurveTo(x - 90, y - 140, x + 90, y - 140, x + 110, this.ground.y(x + 110) + 30);
		canvas.ctx.closePath();
	}
	canvas.ctx.fill();

	//ground
	canvas.ctx.fillStyle = GRASS;
	canvas.ctx.beginPath();
	canvas.ctx.moveTo(this.min, canvas.h);
	this.ground.path(canvas.ctx);
	canvas.ctx.lineTo(this.max, canvas.h);
	canvas.ctx.closePath();
	canvas.ctx.fill();

	//blocks
	canvas.ctx.fillStyle = WOOD; //TODO also allow GRASS
	canvas.ctx.beginPath();
	for (i = 0; i < this.blocks.length; i++) {
		if (this.blocks[i].min > dx + canvas.w || this.blocks[i].max < dx) {
			continue;
		}
		this.blocks[i].path(canvas.ctx);
	}
	canvas.ctx.fill();

	//cat
	if (!noCatNoRestore) {
		cat.draw(canvas.ctx);
	}

	//grass
	//TODO
	canvas.ctx.beginPath();
	for (x = dx; x < dx + canvas.w; x++) {
		if (this.min <= x && x <= this.max && Math.sin(8 * x) > 0.75) {
			y = this.ground.y(x);
			canvas.ctx.moveTo(x, y + 3);
			canvas.ctx.lineTo(x + 2 * Math.sin(this.animationTime / 300), y - 10);
			canvas.ctx.lineTo(x + 1, y + 3);
			canvas.ctx.closePath();
		}
	}
	canvas.ctx.fillStyle = GRASS;
	canvas.ctx.fill();

	//thorns and rivers
	canvas.ctx.fillStyle = THORNS;
	canvas.ctx.beginPath();
	for (i = 0; i < this.thorns.length; i++) {
		if (this.thorns[i].min > dx + canvas.w || this.thorns[i].max < dx) {
			continue;
		}
		this.thorns[i].thornyPath(canvas.ctx);
	}
	canvas.ctx.fill();
	canvas.ctx.fillStyle = WATER;
	canvas.ctx.beginPath();
	for (i = 0; i < this.rivers.length; i++) {
		if (this.rivers[i].min > dx + canvas.w || this.rivers[i].max < dx) {
			continue;
		}
		this.rivers[i].path(canvas.ctx);
	}
	canvas.ctx.fill();

	if (!noCatNoRestore) {
		canvas.ctx.restore();
	}
};

Level.prototype.drawStart = function (canvas, cat, dt) {
	this.startTime += dt;
	this.draw(canvas, cat, dt);
	canvas.fade(1 - this.startTime / 1000);
	return this.startTime > 1000;
};

Level.prototype.drawEnd = function (canvas, cat, dt, end) {
	var x, y, i;
	this.endTime += dt;
	this.draw(canvas, cat, dt, end !== -1);
	x = (cat.x0 + cat.x1) / 2;
	y = (cat.y0 + cat.y1) / 2;
	switch (end) {
	case 3:
		canvas.ctx.strokeStyle = '#f00';
		canvas.ctx.lineWidth = 2;
		canvas.ctx.beginPath();
		canvas.ctx.moveTo(x, y);
		canvas.ctx.lineTo(x, 50 + Math.min(0, y - canvas.h / 3));
		canvas.ctx.stroke();
		/*falls through*/
	case 1:
		canvas.ctx.translate(x, y + this.endTime * this.endTime / 4000);
		canvas.ctx.fillStyle = '#000';
		for (i = 0; i < 100; i++) {
			canvas.ctx.beginPath();
			canvas.ctx.arc(0, (i + 1) * this.endTime / 180, 4, 0, 2 * Math.PI);
			canvas.ctx.fill();
			canvas.ctx.rotate(2.4); //this is the so-called golden angle
		}
		canvas.ctx.restore();
		break;
	case 2:
		canvas.ctx.fillStyle = WATER;
		canvas.ctx.beginPath();
		canvas.ctx.arc(x, y, this.endTime, 0, 2 * Math.PI);
		canvas.ctx.fill();
		cat.draw(canvas.ctx);
		canvas.ctx.restore();
	}
	canvas.fade(this.endTime / 2000);
	return this.endTime > 2000;
};

return Level;
})();