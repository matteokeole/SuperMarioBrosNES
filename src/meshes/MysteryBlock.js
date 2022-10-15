import {TEXTURES} from "../index.js";
import {Mesh} from "./Mesh.js";

/**
 * Mystery block constructor.
 * 
 * @constructor
 * @augments	Mesh
 * @return		{this}
 */
export function MysteryBlock() {
	Mesh.call(this, ...arguments);

	const size = [16, 16], uv = [64, 0];

	return Object.assign(this, {
		vertices: new Float32Array([
			0,       size[1],
			size[0], size[1],
			0,       0,
			size[0], 0,
		]),
		size,
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uv,
	});
}