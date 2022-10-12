import {update, render} from "./main.js";

export default {
	start: () => {
		then = performance.now();

		loop();
	},
	stop: () => cancelAnimationFrame(request),
};

let request, then, now, dt;

function loop() {
	request = requestAnimationFrame(loop);

	// dt = then - (now = then = performance.now());

	now = performance.now();
	dt = now - then;
	then = performance.now();

	update(dt);
	render();
}