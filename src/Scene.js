import {Color} from "./index.js";

/**
 * @todo
 * 
 * @constructor
 * @returns	{self}
 */
export function Scene({background = new Color(0x000000)} = {}) {
	return Object.assign(this, {
		background,
		objects: new Set(),
		add: (...objects) => {
			for (const object of objects) this.objects.add(object);

			return this;
		},
		remove: (...objects) => {
			for (const object of objects) this.objects.delete(object);

			return this;
		},
	});
}