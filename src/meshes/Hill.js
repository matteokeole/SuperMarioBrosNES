import {TEXTURES} from "../index.js";
import {Mesh} from "./Mesh.js";

const HILLS = [
	{
		size: [48, 19],
		uv: [0, 40],
	}, {
		size: [80, 35],
		uv: [48, 40],
	},
];

/**
 * Hill constructor.
 * 
 * @constructor
 * @augments	Mesh
 * @return		{self}
 */
export function Hill({type = 0, position: p}) {
	Mesh.call(this, ...arguments);

	const {x, y} = p;
	const {size: [w, h], uv} = HILLS[type];

	return Object.assign(this, {
		vertices: new Float32Array([
			x,     y + h,
			x + w, y + h,
			x,     y,
			x + w, y,
		]),
		source: "assets/textures/environment.png",
		texture: TEXTURES.get("assets/textures/environment.png"),
		w,
		h,
		uv,
	});
}