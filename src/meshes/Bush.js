import {TEXTURES} from "../index.js";
import {Mesh} from "./Mesh.js";

const TYPES = [
	{
		size: [32, 16],
		uv: [0, 24],
	}, {
		size: [48, 16],
		uv: [32, 24],
	}, {
		size: [64, 16],
		uv: [80, 24],
	}
];

export function Bush({type = 0, position}) {
	Mesh.call(this, ...arguments);

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