import {Color} from "./index.js";

/**
 * Scene constructor.
 * 
 * @constructor
 * @param	{Color}	background	Background color
 * @return	{this}
 */
export function Scene({background = new Color(0x000000)} = {}) {
	return Object.assign(this, {
		background,
		environment: new Set(),
		meshes: new Set(),
		entities: new Set(),
		addEnvironment: (...environment) => {
			for (const mesh of environment) this.environment.add(mesh);

			return this;
		},
		addMeshes: (...meshes) => {
			for (const mesh of meshes) this.meshes.add(mesh);

			return this;
		},
		addEntities: (...entities) => {
			for (const mesh of entities) this.entities.add(mesh);

			return this;
		},
	});
}