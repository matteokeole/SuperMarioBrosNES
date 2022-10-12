import {Color, Entity, Renderer, Scene, Utils, Vector2} from "../src/index.js";
import init from "./init.js";
import loop from "./loop.js";

await Utils.loadTextures(
	"assets/textures/environment.png",
	"assets/textures/sprites.png",
);

// 0x9290ff / 0x000000
const scene = new Scene({background: new Color(0x000000)});

const goomba = new Entity.Goomba({
	position: new Vector2(40, 32),
	velocity: new Vector2(.1, 0),
});
scene.addEntities(goomba);

init(scene);

// Load the shader program
const program = await Utils.createProgram(
	"assets/shaders/main.vert",
	"assets/shaders/main.frag",
);

// Link the program to the renderer
Renderer.linkProgram(program);

// Movement tests
addEventListener("resize", Renderer.resize);
addEventListener("keydown", e => {
	switch (e.code) {
		case "KeyA": goomba.movesLeft = true; break;
		case "KeyD": goomba.movesRight = true; break;
	}
});
addEventListener("keyup", e => {
	switch (e.code) {
		case "KeyA": goomba.movesLeft = false; break;
		case "KeyD": goomba.movesRight = false; break;
	}
});

export function update(dt) {
	goomba.movesLeft && (goomba.position.x -= goomba.velocity.x * dt);
	goomba.movesRight && (goomba.position.x += goomba.velocity.x * dt);
}
export function render() {
	Renderer.render(scene);
}

loop.start();