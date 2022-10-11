import {TEXTURES} from "../index.js";
import {Mesh} from "./Mesh.js";

const PIPE_SIZE = 32;

/**
 * @todo
 * 
 * @constructor
 * @augments	Mesh
 * @return		{self}
 */
export function Pipe({width: w, height: h}) {
	Mesh.call(this, ...arguments);

	const {x, y} = this.position;

	return Object.assign(this, {
		vertices: new Float32Array([
			0, h,
			w, h,
			0, 0,
			w, 0,
		]),
		source: "assets/textures/sprites.png",
		texture: TEXTURES.get("assets/textures/sprites.png"),
		w: PIPE_SIZE,
		h: PIPE_SIZE,
		uv: [0, 16],
	});
}