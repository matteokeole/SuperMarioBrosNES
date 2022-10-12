import {update, render} from "./main.js";

export default {
	start: () => {
		then = performance.now();

		loop();
	},
	stop: () => cancelAnimationFrame(request),
};

let request, then, now, dt, interval = 1000 / 60;

function loop() {
	request = requestAnimationFrame(loop);

	dt = ((now = performance.now()) - then) / interval;

	update(dt);
	render();

	then = performance.now();
}