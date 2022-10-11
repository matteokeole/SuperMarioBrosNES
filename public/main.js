import {Color, Entity, Mesh, Renderer, Scene, Utils, Vector2} from "../src/index.js";
import loop from "./loop.js";

await Utils.loadTextures(
	"assets/textures/environment.png",
	"assets/textures/sprites.png",
);

// 0x9290ff
const scene = new Scene({background: new Color(0x000000)});

const meshes = [
	new Mesh.Hill({
		type: 1,
		position: new Vector2(16, 32),
	}),
	new Mesh.Hill({
		type: 1,
		position: new Vector2(91, 32),
	}),
	new Mesh.Tile({
		width: 224,
		height: 32,
		position: new Vector2(0, 0),
	}),
	new Mesh.Pipe({
		width: 32,
		height: 32,
		position: new Vector2(16, 32),
	}),
	new Mesh.MysteryBlock({
		position: new Vector2(112, 64),
	}),
];

const goomba = new Entity.Goomba({
	position: new Vector2(32, 32),
	velocity: new Vector2(1, 0),
});

scene.add(...meshes, goomba);
scene.remove(...meshes);

// Load the shader program
const program = await Utils.createProgram(
	"assets/shaders/main.vert",
	"assets/shaders/main.frag",
);

// Link the program to the renderer
Renderer.linkProgram(program);

addEventListener("resize", Renderer.resize);
addEventListener("keydown", e => {
	switch (e.code) {
		case "KeyD": goomba.position.x++; break;
	}
})

export function update() {}
export function render() {
	Renderer.render(scene);
}

loop.start();