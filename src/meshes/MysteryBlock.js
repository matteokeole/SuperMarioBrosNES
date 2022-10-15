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

	return Object.assign(this, {
		vertices: new Float32Array([
			0,  16,
			16, 16,
			0,  0,
			16, 0,
		]),
		size: [16, 16],
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uv: [64, 0],
	});
}