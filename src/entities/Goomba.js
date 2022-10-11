import {TEXTURES} from "../index.js";

export function Goomba({position, velocity}) {
	const
		{x, y} = position,
		[w, h] = [16, 16],
		uv = [32, 0];

	return Object.assign(this, {
		position,
		velocity,
		vertices: new Float32Array([
			0,  16,
			16, 16,
			0,  0,
			16, 0,
		]),
		indices: new Uint16Array([
			0, 2, 1,
			2, 3, 1,
		]),
		uvs: new Float32Array([
			0, 0,
			1, 0,
			0, 1,
			1, 1,
		]),
		source: "assets/textures/sprites.png",
		texture: TEXTURES.get("assets/textures/sprites.png"),
		w,
		h,
		uv,
	});
}