import {TEXTURES, State, Vector2} from "../index.js";

export function Goomba({position, velocity}) {
	return Object.assign(this, {
		state: Goomba.IDLE,
		position,
		velocity,
		direction: new Vector2(1, 1),
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
	});
}

Goomba.init = function() {
	Goomba.IDLE = new State({
		size: [16, 16],
		texture: TEXTURES.get("assets/textures/entities.png"),
		uv: [0, 0],
	});

	Goomba.WALKING = new State({
		size: [16, 16],
		texture: TEXTURES.get("assets/textures/entities.png"),
		uv: [16, 0],
	});
}