import {Loader, Mesh, Renderer, Scene, Utils} from "../src/index.js";

// Loader.load();

// 0x9290ff
const scene = new Scene();

// 1 tile = 48x48
// const pipe = new Pipe();
const mesh = new Mesh(96, 96, 48, 96);

scene.add(mesh);

// Load the shader program
const program = await Utils.createProgram(
	"assets/shaders/main.vert",
	"assets/shaders/main.frag",
);

// Link the program to the renderer
Renderer.linkProgram(program);

Renderer.render(scene);

addEventListener("resize", Renderer.resize);