import {CELL_SIZE, TEXTURES, Mesh} from "../index.js";

/**
 * @todo
 * 
 * @constructor
 * @augments	Mesh
 * @returns		{self}
 */
export function Hill({type = 1, position: p}) {
	Mesh.call(this, ...arguments);

	const {x, y} = p;
	let [w, h] = [48 * 4, 19 * 4];

	this.vertices = new Float32Array([
		x,     y + h,
		x + w, y + h,
		x,     y,
		x + w, y,
	]);

	w = 1;
	h = 1 + 1 / 19;

	return Object.assign(this, {
		texture: TEXTURES.get("assets/textures/environment.png"),
		uvs: new Float32Array([
			0, 0,
			w, 0,
			0, h,
			w, h,
		]),
		uw: 48 / 144,
		uh: 19 / 78,
		ux: 0,
		uy: 40 / 78,
	});
}