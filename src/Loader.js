import {RESOURCES, Renderer} from "./index.js";

/**
 * Loader singleton.
 * 
 * @constructor
 * @returns	{self}
 */
function Loader() {
	return Object.assign(this, {
		load: () => {
			const {gl} = Renderer;

			console.log("Loading...");
		},
	});
}

/** @type {Loader} */
const loader = new Loader();

export {loader as Loader};