import {CELL_SIZE, TEXTURES, Mesh} from "../index.js";

/**
 * @todo
 * 
 * @constructor
 * @augments	Mesh
 * @returns		{self}
 */
export function Floor({width: w, height: h}) {
	Mesh.call(this, ...arguments);

	w /= CELL_SIZE;
	h /= CELL_SIZE;

	return Object.assign(this, {
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uvs: new Float32Array([
			0, 0,
			w, 0,
			0, h,
			w, h,
		]),
		uw: 1 / 5,
		uh: 1 / 3,
		ux: 0,
		uy: 0,
	});
}