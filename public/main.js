import {Color, Scene, Renderer, Utils} from "../src/index.js";

const scene = new Scene({background: new Color(0xff9800)});

const program = await Utils.createProgram(Renderer.gl,
	"assets/shaders/main.vert",
	"assets/shaders/main.frag",
);

Renderer.linkProgram(program);
Renderer.render(scene);

addEventListener("resize", Renderer.resize);