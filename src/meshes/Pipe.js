import {TEXTURES, Mesh} from "../index.js";

/**
 * @todo
 * 
 * @constructor
 * @augments	Mesh
 * @returns		{self}
 */
export function Pipe(w, h, x, y) {
	Mesh.call(this, ...arguments);

	w /= 96;
	h /= 96;

	return Object.assign(this, {
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uvs: new Float32Array([
			0, 0,
			w, 0,
			0, h,
			w, h,
		]),
		uw: 2 / 5,
		uh: 2 / 3,
		ux: 0,
		uy: 1 / 3,
	});
}