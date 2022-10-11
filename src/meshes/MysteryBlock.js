import {TEXTURES} from "../index.js";
import {Mesh} from "./Mesh.js";

/**
 * Mystery block constructor.
 * 
 * @constructor
 * @augments	Mesh
 * @return		{self}
 */
export function MysteryBlock({position: p}) {
	Mesh.call(this, ...arguments);

	const
		{x, y} = p,
		[w, h] = [16, 16],
		uv = [64, 0];

	return Object.assign(this, {
		vertices: new Float32Array([
			x,     y + h,
			x + w, y + h,
			x,     y,
			x + w, y,
		]),
		source: "assets/textures/sprites.png",
		texture: TEXTURES.get("assets/textures/sprites.png"),
		w,
		h,
		uv,
	});
}