/*global audio*/
(function () {
"use strict";

window.setInterval(audio.tick, 50);

document.getElementById('play').addEventListener('click', audio.start);
document.getElementById('stop').addEventListener('click', audio.stop);
document.getElementById('sound-move').addEventListener('click', function () {
	audio.sound('move');
});
document.getElementById('sound-open').addEventListener('click', function () {
	audio.sound('open');
});
document.getElementById('sound-close').addEventListener('click', function () {
	audio.sound('close');
});
document.getElementById('sound-teleport').addEventListener('click', function () {
	audio.sound('teleport');
});
document.getElementById('sound-switch').addEventListener('click', function () {
	audio.sound('switch');
});
document.getElementById('sound-win').addEventListener('click', function () {
	audio.sound('win');
});
document.getElementById('sound-die').addEventListener('click', function () {
	audio.sound('die');
});
document.getElementById('sound-jump').addEventListener('click', function () {
	audio.sound('jump');
});
document.getElementById('sound-pew').addEventListener('click', function () {
	audio.sound('pew');
});
document.getElementById('sound-blow').addEventListener('click', function () {
	audio.sound('blow');
});

})();