import {TEXTURES} from "../index.js";
import {Mesh} from "./Mesh.js";

/**
 * A textured tile with variable size.
 * 
 * @constructor
 * @augments	Mesh
 * @return		{self}
 */
export function Tile({width: w, height: h}) {
	Mesh.call(this, ...arguments);

	const
		w2 = w / 16,
		h2 = h / 16;

	return Object.assign(this, {
		vertices: new Float32Array([
			0, h,
			w, h,
			0, 0,
			w, 0,
		]),
		size: [16, 16],
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uvs: new Float32Array([
			0,  0,
			w2, 0,
			0,  h2,
			w2, h2,
		]),
		uv: [0, 0],
	});
}