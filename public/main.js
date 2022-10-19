import {TEXTURES, Color, Entity, Renderer, Scene, Utils, Vector2} from "../src/index.js";
import init from "./init.js";
import loop from "./loop.js";
import {initEvents} from "./events.js";

// Shader initialization
{
	const program = await Utils.createProgram(
		"assets/shaders/main.vert",
		"assets/shaders/main.frag",
	);

	Renderer.linkProgram(program);
}

// Load textures
await Utils.loadTextures(
	"assets/textures/environment.png",
	"assets/textures/sprites.png",
);

// Initialize the states after the textures loading
Entity.Player.init();
Entity.Goomba.init();

export const
	keys = new Set(),
	// 0x9290ff / 0x000000 / 0x754b3d
	scene = new Scene({background: new Color(0x754b3d)}),
	player = new Entity.Player({
		position: new Vector2(24, 64),
		velocity: new Vector2(2, 4),
	});

init(scene);
scene.addEntities(player);

console.log(Entity.Player.IDLE)

loop.start();
initEvents();