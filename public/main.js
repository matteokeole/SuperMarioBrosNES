import {Color, Mesh, Renderer, Scene, Utils, Vector2} from "../src/index.js";

await Utils.loadTextures(
	"assets/textures/environment.png",
	"assets/textures/sprites.png",
);

// 0x9290ff
const scene = new Scene({background: new Color(0x000000)});

const meshes = {
	hill1: new Mesh.Hill({
		type: 1,
		position: new Vector2(16, 32),
	}),
	hill2: new Mesh.Hill({
		type: 1,
		position: new Vector2(91, 32),
	}),
	floor: new Mesh.Tile({
		width: 224,
		height: 32,
		position: new Vector2(0, 0),
	}),
	pipe: new Mesh.Pipe({
		width: 32,
		height: 32,
		position: new Vector2(16, 32),
	}),
};

scene.add(...Object.values(meshes));

// Load the shader program
const program = await Utils.createProgram(
	"assets/shaders/main.vert",
	"assets/shaders/main.frag",
);

// Link the program to the renderer
Renderer.linkProgram(program);

Renderer.render(scene);

addEventListener("resize", Renderer.resize);