import {TEXTURES} from "../index.js";
import {Environment} from "./Environment.js";

const TYPES = [
	{
		size: [32, 24],
		uv: [0, 0],
	}, {
		size: [48, 24],
		uv: [32, 0],
	}, {
		size: [64, 24],
		uv: [80, 0],
	},
];

/**
 * Cloud constructor.
 * 
 * @constructor
 * @augments	Environment
 * @return		{this}
 */
export function Cloud({type = 0}) {
	Environment.call(this, ...arguments);

	const {size, uv} = TYPES[type];

	return Object.assign(this, {
		vertices: new Float32Array([
			0,       size[1],
			size[0], size[1],
			0,       0,
			size[0], 0,
		]),
		size,
		texture: TEXTURES.get("assets/textures/environment.png"),
		uv,
	});
}