import {Color, Floor, Pipe, Renderer, Scene, Utils} from "../src/index.js";

await Utils.loadTextures("assets/textures/sprites.png");

// 0x9290ff
const scene = new Scene({background: new Color(0x000000)});

const floor = new Floor(innerWidth, 96, 0, 0);
const pipe = new Pipe(96, 96, 48, 96);

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