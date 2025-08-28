/*global Canvas, levels, intro*/
(function () {
"use strict";

var i, l, canvas, state, hints, hintsForLevel;

l = levels.length;
for (i = 0; i < l - 1; i++) {
	levels[i][0].next = (i + 2) + '/' + l;
}
levels[l - 1][0].next = 'End';

canvas = new Canvas(document.getElementById('c'), 700, 700, 1400); //first 700 = nominal height of level

state = {
	level: 0,
	deaths: 0,
	hints: [-1]
};

hints = [
	'',
	'As a black cat, you can hide from drones in the shadows.',
	'Keep away from thorns.',
	'Keep away from water.'
];

function onMsg (msg) {
	var showMsg = false, hint;
	if (state.hints.indexOf(msg) === -1) {
		state.hints.push(msg);
		showMsg = true;
	}
	if (hintsForLevel.indexOf(msg) > -1) {
		showMsg = true;
	}
	if (showMsg) {
		if (msg === -1) {
			switch (state.deaths) {
			case 0:
				hint = 'You win without ever dying!';
				break;
			case 1:
				hint = 'You win (after having died once)!';
				break;
			default:
				hint = 'You win (after having died ' + state.deaths + ' times)!';
			}
			hints[msg] = hint;
		}
		canvas.setText(hints[msg]);
	}
}

function playLevel (n, callback) {
	var level = levels[n];

	function onEnd (end) {
		if (end !== -1) {
			state.deaths++;
			level[0].run(canvas, onMsg, onEnd);
		} else {
			callback();
		}
	}

	hintsForLevel = level[2] || [];
	if (n === levels.length - 1) {
		hintsForLevel.push(-1);
	}
	canvas.setText(level[1]);
	state.level = n;
	level[0].run(canvas, onMsg, onEnd);
}

function playLevels (n, callback) {
	if (n === levels.length) {
		callback();
	} else {
		playLevel(n, function () {
			playLevels(n + 1, callback);
		});
	}
}

intro.start();
document.getElementById('r').addEventListener('click', function () {
	intro.stop();
	document.getElementById('s').hidden = true;
	document.getElementById('g').hidden = false;
	playLevels(state.level, function () {
		canvas.ctx.fillText('Finally! I found my owner!', canvas.w / 2, 200, canvas.w);
		canvas.ctx.fillText('Now where is my dinner?', canvas.w / 2, 250, canvas.w);
	});
});

})();