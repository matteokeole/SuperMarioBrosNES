import {TEXTURES} from "../index.js";
import {Mesh} from "./Mesh.js";

/**
 * Warp pipe constructor.
 * 
 * @constructor
 * @augments	Mesh
 * @return		{this}
 */
export function Pipe({width: w, height: h}) {
	Mesh.call(this, ...arguments);

	return Object.assign(this, {
		vertices: new Float32Array([
			0, h,
			w, h,
			0, 0,
			w, 0,
		]),
		size: [32, 32],
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uv: [0, 64],
	});
}