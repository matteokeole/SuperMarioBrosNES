import {TEXTURES, Color, Entity, Renderer, Scene, Utils, Vector2} from "../src/index.js";
import init from "./init.js";
import loop from "./loop.js";

// Shader initialization
{
	const program = await Utils.createProgram(
		"assets/shaders/main.vert",
		"assets/shaders/main.frag",
	);

	Renderer.linkProgram(program);
}

await Utils.loadTextures(
	"assets/textures/environment.png",
	"assets/textures/sprites.png",
	"assets/textures/entities.png",
);

Entity.Goomba.init();

// 0x9290ff / 0x000000 / 0x754b3d
const scene = new Scene({background: new Color(0x754b3d)});

init(scene);

const goomba = new Entity.Goomba({
	position: new Vector2(40, 32),
	velocity: new Vector2(2, 0),
});
scene.addEntities(goomba);

addEventListener("resize", Renderer.resize);
addEventListener("keydown", e => {
	switch (e.code) {
		case "KeyA": {
			goomba.state = Entity.Goomba.WALKING;
			goomba.MOVES_LEFT = true;
			goomba.direction.x = -1;

			break;
		}
		case "KeyD": {
			goomba.state = Entity.Goomba.WALKING;
			goomba.MOVES_RIGHT = true;
			goomba.direction.x = 1;

			break;
		}
	}
});
addEventListener("keyup", e => {
	switch (e.code) {
		case "KeyA": {
			goomba.state = Entity.Goomba.IDLE;
			goomba.MOVES_LEFT = false;

			break;
		}
		case "KeyD": {
			goomba.state = Entity.Goomba.IDLE;
			goomba.MOVES_RIGHT = false;

			break;
		}
	}
});

export function update(dt) {
	if (goomba.state === Entity.Goomba.WALKING) {
		if (goomba.MOVES_LEFT) goomba.position.x -= goomba.velocity.x * dt;
		if (goomba.MOVES_RIGHT) goomba.position.x += goomba.velocity.x * dt;
	}
}
export const render = () => Renderer.render(scene);

loop.start();