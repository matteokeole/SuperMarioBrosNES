import {Entity, Mesh} from "../src/index.js";
import {keys, player, scene} from "./main.js";
import {Keybinds} from "./config.js";

export default dt => {
	const newGY = player.position.y - 2 * dt;

	if (!player.intersectsMeshes(scene.meshes, player.position.x, newGY)) {
		player.position.y = newGY;
	} else {
		player.position.y = Math.floor(player.position.y);
	}

	if (keys.has(Keybinds.LEFT)) {
		player.state = Entity.Player.WALKING;
		player.direction.x = -1;

		const newX = player.position.x - player.velocity.x * dt;

		if (!player.intersectsMeshes(scene.meshes, newX, player.position.y)) {
			player.position.x = newX;
		} else {
			keys.has(Keybinds.RIGHT) && keys.delete(Keybinds.LEFT);

			player.position.x = Math.floor(player.position.x);
		}
	}

	if (keys.has(Keybinds.RIGHT)) {
		player.state = Entity.Player.WALKING;
		player.direction.x = 1;

		const newX = player.position.x + player.velocity.x * dt;

		if (!player.intersectsMeshes(scene.meshes, newX, player.position.y)) {
			player.position.x = newX;
		} else {
			keys.has(Keybinds.LEFT) && keys.delete(Keybinds.RIGHT);

			player.position.x = Math.ceil(player.position.x);
		}
	}

	if (keys.has(Keybinds.TOP)) {
		player.state = Entity.Player.JUMPING;

		const newY = player.position.y + player.velocity.y * dt;

		if (!player.intersectsMeshes(scene.meshes, player.position.x, newY)) {
			player.position.y = newY;
		} else {
			keys.has(Keybinds.BOTTOM) && keys.delete(Keybinds.TOP);

			player.position.y = Math.ceil(player.position.y);
		}
	}
};