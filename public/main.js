import {Color, Floor, Hill, Pipe, Renderer, Scene, Utils, Vector2} from "../src/index.js";

await Utils.loadTextures(
	"assets/textures/environment.png",
	"assets/textures/sprites.png",
);

// 0x9290ff
const scene = new Scene({background: new Color(0x000000)});

const hill = new Hill({
	type: 1,
	position: new Vector2(0, 0),
});
const floor = new Floor({
	width: 192,
	height: 96,
	position: new Vector2(0, 0),
});
const pipe = new Pipe({
	width: 96,
	height: 96,
	position: new Vector2(48, 96),
});

scene.add(floor, pipe);

// Load the shader program
const program = await Utils.createProgram(
	"assets/shaders/main.vert",
	"assets/shaders/main.frag",
);

// Link the program to the renderer
Renderer.linkProgram(program);

Renderer.render(scene);

addEventListener("resize", Renderer.resize);