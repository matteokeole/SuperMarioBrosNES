import {Game, Background, Level} from "./main.js";
import {buffer, pattern_buffer} from "./buffer.js";
import {uv} from "./vars.js";

/**
 * Load a level file. The file should be located in levels/ with a JSON extension.
 * @param	{string}	path	File path
 */
export const load_level = path => {
	fetch(path)
		.then(response => response.json())
		.then(response => {
			// Draw background color
			Background.style.backgroundColor = response.background;

			// Initialize level parts
			for (let part of response.level) {
				if (part.pattern) {
					// Store pattern
					pattern_buffer.ctx.drawImage(
						buffer,
						uv[part.id][0],
						uv[part.id][1],
						16,
						16,
						0,
						0,
						Game.scale,
						Game.scale,
					);

					// Draw pattern
					const pattern = Level.ctx.createPattern(pattern_buffer, "repeat");
					Level.ctx.fillStyle = pattern;
					Level.ctx.fillRect(
						part.pattern.from[0] * Game.scale,
						part.pattern.from[1] * Game.scale,
						(part.pattern.to[0] - part.pattern.from[0] + 1) * Game.scale,
						(part.pattern.to[1] - part.pattern.from[1] + 1) * Game.scale,
					);
				} else {
					// Standard part
					Level.ctx.drawImage(
						buffer,
						uv[part.id][0],
						uv[part.id][1],
						16,
						16,
						part.pos[0] * Game.scale,
						part.pos[1] * Game.scale,
						Game.scale,
						Game.scale,
					);
				}
			}
		})
		.catch(error => console.error(error));
};