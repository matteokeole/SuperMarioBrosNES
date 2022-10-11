import {Color} from "./index.js";

/**
 * Scene constructor.
 * 
 * @constructor
 * @param	{Color}	background	Background color
 * @return	{self}
 */
export function Scene({background = new Color(0x000000)} = {}) {
	return Object.assign(this, {
		background,
		meshes: new Set(),
		add: (...meshes) => {
			for (const mesh of meshes) this.meshes.add(mesh);

			return this;
		},
		remove: (...meshes) => {
			for (const mesh of meshes) this.meshes.delete(mesh);

			return this;
		},
	});
}