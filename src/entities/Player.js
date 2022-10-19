import {TEXTURES} from "../index.js";
import {Entity} from "./Entity.js";

export function Player() {
	Entity.call(this, ...arguments);

	return Object.assign(this, {
		state: Player.IDLE,
		vertices: new Float32Array([
			0,  16,
			16, 16,
			0,  0,
			16, 0,
		]),
	});
}

Player.init = () => {
	Player.IDLE = {
		name: "idle",
		size: [16, 16],
		hitbox: [16, 16],
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uv: [0, 96],
	};

	Player.WALKING = {
		name: "walking",
		size: [16, 16],
		hitbox: [16, 16],
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uv: [16, 96],
	};

	Player.JUMPING = {
		name: "jumping",
		size: [16, 16],
		hitbox: [16, 16],
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uv: [80, 96],
	};
};