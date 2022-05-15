import {load_level} from "./loader.js";

export const
	Background = document.querySelector("div#background"),
	Level = {
		canvas: document.querySelector("canvas#level"),
		get ctx() {return this.canvas.getContext("2d")},
	},
	Game = {
		scale: 48,
	};

Level.canvas.width = innerWidth;
Level.canvas.height = 13 * Game.scale;
Level.ctx.imageSmoothingEnabled = false;

load_level("levels/1-1.json");