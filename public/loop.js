import update from "./update.js";
import render from "./render.js";

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