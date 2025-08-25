/*global levels: true*/
/*global Curve, Block, Level*/
levels = [
	new Level(new Curve([{x: 0, y: 600}, {x: 200, y: 640}, {x: 400, y: 600}, {x: 800, y: 580}, {x: 1200, y: 500}, {x: 1400, y: 600}, {x: 1401, y: 650}, {x: 1499, y: 650}, {x: 1500, y: 600}, {x: 2500, y: 600}]), [new Block(new Curve([{x: 600, y: 280}, {x: 800, y: 220, xc: 700, yc: 240}, {x: 1000, y: 260, xc: 900}]), new Curve([{x: 600, y: 340}, {x: 1000, y: 340}]), 1), new Block(new Curve([{x: 700, y: 550}, {x: 900, y: 550}]), new Curve([{x: 700, y: 650}, {x: 900, y: 650}]), 2), new Block(new Curve([{x: 1400, y: 600}, {x: 1500, y: 600}]), new Curve([{x: 1400, y: 700}, {x: 1500, y: 700, xc: 1450, yc: 800}]), 3)], [[1750, 2150]], [1950])
];