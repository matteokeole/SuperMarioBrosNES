import {TEXTURES, Mesh} from "../index.js";

const PIPE_SIZE = 32;

/**
 * @todo
 * 
 * @constructor
 * @augments	Mesh
 * @returns		{self}
 */
export function Pipe({width: w, height: h}) {
	Mesh.call(this, ...arguments);

	const {x, y} = this.position;

	return Object.assign(this, {
		vertices: new Float32Array([
			x,     y + h,
			x + w, y + h,
			x,     y,
			x + w, y,
		]),
		source: "assets/textures/sprites.png",
		texture: TEXTURES.get("assets/textures/sprites.png"),
		w: PIPE_SIZE,
		h: PIPE_SIZE,
		uv: [0, 16],
	});
}