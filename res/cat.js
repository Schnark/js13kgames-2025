/*global Cat: true*/
Cat =
(function () {
"use strict";

var WIDTH = 50, HEIGHT = 30,
	VX_MAX = 0.1,
	VY_MAX = 0.1,
	ACCEL = 0.0001,
	GRAVITY = 0.0001,
	JUMP = 0.25,
	TURNING_TIME = 200;

function Cat (curve, x0) {
	this.curve0 = curve;
	this.x0 = x0;
	this.y0 = curve.y(x0);
	this.curve1 = curve;
	this.x1 = x0 - WIDTH;
	this.y1 = curve.y(this.x1);

	this.ground = curve;

	this.vx = 0;
	this.vy = 0;
	this.turning = 0;
}

Cat.prototype.draw = function (ctx) {
	var dx, dy;
	dx = this.x0 - this.x1;
	dy = this.y0 - this.y1;
	ctx.save();
	ctx.translate(this.x1, this.y1);
	ctx.rotate(Math.atan2(dy, dx));
	if (dx < 0) {
		ctx.scale(1, -1);
	}
	ctx.fillStyle = '#000';
	ctx.fillRect(0, -HEIGHT, Math.sqrt(dx * dx + dy * dy), HEIGHT);
	ctx.fillStyle = '#ff0';
	ctx.fillRect(WIDTH - 10, 10 - HEIGHT, 5, 5);
	ctx.restore();
};

Cat.prototype.move = function (left, right, jump, dt) {
	if (this.turning > 0) {
		this.turning -= dt;
		if (this.turning >= 0) {
			return;
		}
		dt = -this.turning;
		this.turning = 0;
	}
	if (this.curve0 && this.curve1) {
		this.walk(left, right, jump, dt);
	} else if (!this.curve0 && !this.curve1) {
		this.fly(dt);
	} else {
		this.slide(left, right, jump, dt);
	}
};

Cat.prototype.walk = function (left, right, jump, dt) {
	var x, y, dx, end;
	if (left === right) {
		//if neither or both keys are pressed just stop
		this.vx = 0;
	} else {
		if (
			(left && this.x0 > this.x1) ||
			(right && this.x0 < this.x1)
		) {
			this.turning = TURNING_TIME;
			x = this.x0;
			y = this.y0;
			this.x0 = this.x1;
			this.y0 = this.y1;
			this.x1 = x;
			this.y1 = y;
			this.vx = 0;
			return;
		}
		if (left) {
			this.vx -= dt * ACCEL;
			this.vx = Math.max(this.vx, -VX_MAX);
		} else {
			this.vx += dt * ACCEL;
			this.vx = Math.min(this.vx, VX_MAX);
		}
	}

	dx = this.vx * dt;
	if (this.x0 + dx > this.curve0.max) {
		dx = this.curve0.max - this.x0;
		end = 1;
	}
	if (this.x0 + dx < this.curve0.min) {
		dx = this.curve0.min - this.x0;
		end = 2;
	}
	if (this.x1 + dx > this.curve1.max) {
		dx = this.curve1.max - this.x1;
		end = 3;
	}
	if (this.x1 + dx < this.curve1.min) {
		dx = this.curve1.min - this.x1;
		end = 4;
	}

	this.x0 += dx;
	this.y0 = this.curve0.y(this.x0);
	this.x1 += dx;
	this.y1 = this.curve1.y(this.x1);

	if (end) {
		switch (end) {
		case 1:
			if (this.curve0.closed1) {
				this.vx = 0;
			} else {
				this.curve0 = null;
				dt = dt - dx / this.vx;
				this.slide(left, right, jump, dt);
			}
			break;
		case 2:
			if (this.curve0.closed0) {
				this.vx = 0;
			} else {
				this.curve0 = null;
				dt = dt - dx / this.vx;
				this.slide(left, right, jump, dt);
			}
			break;
		case 3:
			if (this.curve1.closed1) {
				this.vx = 0;
			} else {
				this.curve1 = null;
				dt = dt - dx / this.vx;
				this.slide(left, right, jump, dt);
			}
			break;
		case 4:
			if (this.curve1.closed0) {
				this.vx = 0;
			} else {
				this.curve1 = null;
				dt = dt - dx / this.vx;
				this.slide(left, right, jump, dt);
			}
			break;
		}
	} else if (jump) {
		this.curve0 = null;
		this.curve1 = null;
		this.vy = -JUMP;
	}
};

Cat.prototype.slide = function (left, right, jump, dt) {
	var dy, y;
	this.vy += GRAVITY * dt;
	this.vy = Math.min(this.vy, VY_MAX);
	dy = this.vy * dt;
	if (!this.curve0) {
		this.y0 += dy;
		if (this.x0 >= this.ground.min && this.x0 <= this.ground.max) {
			y = this.ground.y(this.x0);
			if (this.y0 >= y) {
				this.y0 = y;
				this.curve0 = this.ground;
			}
		}
	}
	if (!this.curve1) {
		this.y1 += dy;
		if (this.x1 >= this.ground.min && this.x1 <= this.ground.max) {
			y = this.ground.y(this.x1);
			if (this.y1 >= y) {
				this.y1 = y;
				this.curve1 = this.ground;
			}
		}
	}
};

Cat.prototype.fly = function (dt) {
	var dx, dy, y;
	this.vy += GRAVITY * dt;
	this.vy = Math.min(this.vy, VY_MAX);
	dx = this.vx * dt;
	dy = this.vy * dt;
	this.x0 += dx;
	this.y0 += dy;
	this.x1 += dx;
	this.y1 += dy;
	//TODO
	//rotate while jumping
	//if we hit something from below then stop before it and set vy = 0

	if (this.x0 >= this.ground.min && this.x0 <= this.ground.max) {
		y = this.ground.y(this.x0);
		if (this.y0 >= y) {
			this.y0 = y;
			this.curve0 = this.ground;
			this.vx = 0; //TODO?
		}
	}
	if (this.x1 >= this.ground.min && this.x1 <= this.ground.max) {
		y = this.ground.y(this.x1);
		if (this.y1 >= y) {
			this.y1 = y;
			this.curve1 = this.ground;
			this.vx = 0; //TODO?
		}
	}
	//TODO? apply slide for rest time
};

return Cat;
})();