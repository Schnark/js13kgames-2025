/*global Canvas, levels*/
(function () {
"use strict";

var canvas, state, msgs, hints, hintsForLevels;

canvas = new Canvas(document.getElementById('c'), 700, 700, 1400); //first 700 = nominal height of level

state = {
	level: 0,
	deaths: 0,
	hints: [-1]
};

msgs = ['Level 1', 'Level 2'];
hints = ['', 'You die after a drone shot you.', 'You die after falling into a thorny bush.', 'You die after falling into a river.'];
hintsForLevels = [[1, 2, 3], [-1]];

levels[1] = levels[0];

function onMsg (msg) {
	var showMsg = false;
	if (state.hints.indexOf(msg) === -1) {
		state.hints.push(msg);
		showMsg = true;
	}
	if (hintsForLevels[state.level].indexOf(msg) > -1) {
		showMsg = true;
	}
	if (showMsg) {
		if (msg === -1) {
			hints[msg] = 'You win after ' + state.deaths + ' deaths!';
		}
		canvas.setText(hints[msg]);
	}
}

function playLevel (n, callback) {
	var level = levels[n];

	function onEnd (end) {
		if (end !== -1) {
			state.deaths++;
			level.run(canvas, onMsg, onEnd);
		} else {
			callback();
		}
	}

	canvas.setText(msgs[n]);
	state.level = n;
	level.run(canvas, onMsg, onEnd);
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

playLevels(state.level, function () {});

})();