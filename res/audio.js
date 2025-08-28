/*global audio: true*/
audio =
(function () {
"use strict";

var audioMode = 2, isPlaying = false, AC, audioContext, nodes = [], staffs;

function getFreq (note, key) {
	return key[note];
}

function getNode (time, type) {
	var i, osc, gain;
	type = type || 'sine';
	for (i = 0; i < nodes.length; i++) {
		if (nodes[i].osc.type === type && nodes[i].t < time) {
			return i;
		}
	}
	osc = audioContext.createOscillator();
	gain = audioContext.createGain();
	osc.type = type;
	gain.gain.value = 0;
	osc.connect(gain);
	gain.connect(audioContext.destination);
	osc.start();
	nodes.push({osc: osc, gain: gain});
	return nodes.length - 1;
}

function playNote (start, end, freq, volume) {
	var i = getNode(start);
	nodes[i].osc.frequency.setValueAtTime(freq, start);
	nodes[i].gain.gain.setValueAtTime(0.001, start);
	nodes[i].gain.gain.exponentialRampToValueAtTime(volume, start + 0.05);
	nodes[i].gain.gain.linearRampToValueAtTime(volume, end - 0.05);
	nodes[i].gain.gain.exponentialRampToValueAtTime(0.001, end);
	nodes[i].gain.gain.setValueAtTime(0, end + 0.01);
	nodes[i].t = end + 0.01;
}

function playNotes (notes, dur, start, key, volume) {
	var i, end = start + dur;
	for (i = 0; i < notes.length; i++) {
		playNote(start, end, getFreq(notes[i], key), volume);
	}
	return end;
}

function playStaff (staff) {
	var notes;
	while (staff.time - audioContext.currentTime < 1) {
		notes = staff.notes[staff.pos];
		if (notes[0][0] === 'z') {
			staff.time += notes[1] * staff.baseDur;
		} else {
			staff.time = playNotes(
				notes[0], notes[1] * staff.baseDur,
				staff.time,
				staff.key,
				staff.volume
			);
		}
		staff.pos = (staff.pos + 1) % staff.notes.length;
	}
}

function playStaffs () {
	var i, time;
	if (!isPlaying || audioMode !== 2) {
		return;
	}
	if (!audioContext) {
		audioContext = new AC();
	}
	for (i = 0; i < staffs.length; i++) {
		if (staffs[i].time === -1) {
			if (!time) {
				time = audioContext.currentTime + 0.1;
			}
			staffs[i].time = time;
		}
		playStaff(staffs[i]);
	}
}

function stop () {
	var i, time;
	isPlaying = false;
	if (!audioContext) {
		return;
	}
	time = audioContext.currentTime + 0.1;
	for (i = 0; i < nodes.length; i++) {
		nodes[i].osc.frequency.cancelScheduledValues(time);
		nodes[i].gain.gain.cancelScheduledValues(time);
		nodes[i].gain.gain.setValueAtTime(0, time);
		nodes[i].t = time;
	}
	for (i = 0; i < staffs.length; i++) {
		staffs[i].time = -1;
		staffs[i].pos = 0;
	}
}

function initStaff (notes, key, volume, baseDur) {
	staffs.push({
		time: -1,
		pos: 0,
		notes: notes,
		key: key,
		volume: volume,
		baseDur: baseDur
	});
}

function parseNotes (notes) {
	return notes.split(' ').map(function (n) {
		var l;
		n = n.split(/([\^_]?[a-zA-Z][',]*)/);
		l = Number(n.pop() || 1);
		return [
			n.filter(function (a) {
				return a;
			}),
			l
		];
	});
}

function init (data, baseDur) {
	var i;
	staffs = [];
	for (i = 0; i < data.length; i++) {
		initStaff(parseNotes(data[i][0]), data[i][1], data[i][2], baseDur);
	}
}

function setMelody () {
	var cMajorOctaveLower = {
		//C: Math.pow(2, -9 / 12) * 220,
		'^C': Math.pow(2, -8 / 12) * 220,
		D: Math.pow(2, -7 / 12) * 220,
		E: Math.pow(2, -5 / 12) * 220,
		//F: Math.pow(2, -4 / 12) * 220,
		'^F': Math.pow(2, -3 / 12) * 220,
		G: Math.pow(2, -2 / 12) * 220,
		A: 220,
		B: Math.pow(2, 2 / 12) * 220,
		c: Math.pow(2, 3 / 12) * 220,
		d: Math.pow(2, 5 / 12) * 220
	},

	parts = [
		'D G B2 G D ^C2 D G B d c3',
		'B G A B A ^F G A G E ^F G4',
		'B d c B A c B A G B A ^F4 G'
	],
	melody = [], i;

	melody.push(parts[0], parts[1], parts[0], parts[2], parts[0]);
	for (i = 0; i < 10; i++) {
		melody.push(parts[Math.max(0, Math.floor(Math.random() * 4) - 1)]);
	}

	init([[melody.join(' '), cMajorOctaveLower, 0.2]], 40 / 100); //20 .. 60
}

function generateSound (freq, incr, delay, times, vol, type) {
	//based on https://github.com/foumart/JS.13kGames/blob/master/lib/SoundFX.js
	//which is why the parameters are a little odd
	var i, start, end;

	if (!audioContext) {
		audioContext = new AC();
	}
	start = audioContext.currentTime + 0.01;
	end = start + delay * times / 1000;
	i = getNode(start, ['square', 'sawtooth', 'triangle', 'sine'][type || 0]);

	nodes[i].osc.frequency.setValueAtTime(freq, start);
	nodes[i].osc.frequency.linearRampToValueAtTime(freq + incr * times, end);
	nodes[i].gain.gain.setValueAtTime(vol, start);
	nodes[i].gain.gain.linearRampToValueAtTime(0, end);
	nodes[i].t = end;
}

function playSound (sound) {
	if (audioMode === 0) {
		return;
	}
	switch (sound) {
	case 'move': //Landen
		generateSound(100, -10, 15, 15, 0.7, 2);
		break;
	case 'open':
		generateSound(220, 15, 60, 15, 0.3, 2);
		break;
	case 'close':
		generateSound(440, -15, 60, 15, 0.3, 2);
		break;
	case 'teleport':
		generateSound(150, 30, 2, 20, 0.5, 2);
		setTimeout(function () {
			generateSound(150, 30, 2, 20, 0.5, 2);
		}, 150);
		break;
	case 'switch':
		generateSound(750, -30, 5, 20, 0.25);
		setTimeout(function () {
			generateSound(150, 30, 5, 20, 0.25);
		}, 100);
		break;
	case 'win':
		generateSound(510, 0, 15, 20, 0.1);
		setTimeout(function () {
			generateSound(2600, 1, 10, 50, 0.2);
		}, 80);
		break;
	case 'die': //Drohne
		generateSound(100, -10, 10, 25, 0.5);
		generateSound(125, -5, 20, 45, 0.1, 1);
		generateSound(40, 2, 20, 20, 1, 2);
		generateSound(200, -4, 10, 100, 0.25, 2);
		break;
	case 'jump': //Springen
		generateSound(150, 30, 15, 20, 0.3);
		break;
	case 'pew': //Wasser
		generateSound(920, -80, 20, 15, 0.3);
		break;
	case 'blow': //Dornen
		generateSound(120, -6, 20, 15, 0.1, 1);
		generateSound(40, -2, 20, 25, 1, 2);
		generateSound(60, 10, 15, 15, 0.1, 1);
		generateSound(160, -5, 20, 30, 0.1, 3);
	}
}

AC = window.AudioContext || window.webkitAudioContext;
setMelody();

return {
	setMode: function (mode) {
		if (mode === audioMode) {
			return;
		}
		if (audioMode === 2 && isPlaying) {
			stop();
			isPlaying = true; //technically, we are still playing, just muted
		}
		audioMode = mode;
	},
	start: function () {
		isPlaying = true;
	},
	stop: stop,
	tick: AC ? playStaffs : function () {},
	sound: AC ? playSound : function () {}
};

})();