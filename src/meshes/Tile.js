import {TEXTURES} from "../index.js";
import {Mesh} from "./Mesh.js";

const CELL_SIZE = 16;

/**
 * @todo
 * 
 * @constructor
 * @augments	Mesh
 * @returns		{self}
 */
export function Tile({width: w, height: h}) {
	Mesh.call(this, ...arguments);

	const
		{x, y} = this.position,
		w2 = w / CELL_SIZE,
		h2 = h / CELL_SIZE;

	return Object.assign(this, {
		vertices: new Float32Array([
			x,     y + h,
			x + w, y + h,
			x,     y,
			x + w, y,
		]),
		source: "assets/textures/sprites.png",
		texture: TEXTURES.get("assets/textures/sprites.png"),
		uvs: new Float32Array([
			0,  0,
			w2, 0,
			0,  h2,
			w2, h2,
		]),
		w: CELL_SIZE,
		h: CELL_SIZE,
		uv: [0, 0],
	});
}