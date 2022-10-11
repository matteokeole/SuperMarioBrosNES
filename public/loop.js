import {update, render} from "./main.js";

export default {
	start: loop,
	stop: () => cancelAnimationFrame(request),
};

let request;

function loop() {
	request = requestAnimationFrame(loop);

	update();
	render();
}