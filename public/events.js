import {Entity, Renderer} from "../src/index.js";
import {keys, player} from "./main.js";
import {Keybinds} from "./config.js";

export const initEvents = () => {
	addEventListener("resize", Renderer.resize);

	addEventListener("keydown", e => keys.add(e.code));

	addEventListener("keyup", e => {
		keys.delete(e.code);

		if (
			!keys.has(Keybinds.LEFT) &&
			!keys.has(Keybinds.RIGHT) &&
			!keys.has(Keybinds.TOP)
		) player.state = Entity.Player.IDLE;
	});
};