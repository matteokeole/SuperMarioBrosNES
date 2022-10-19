import {Vector2} from "../index.js";

export function Entity({position, velocity}) {
	return Object.assign(this, {
		position,
		velocity,
		direction: new Vector2(1, 1),
		lastIntersection: Array(4).fill(true),
		indices: new Uint16Array([
			0, 2, 1,
			2, 3, 1,
		]),
		intersects: (mesh, x, y) => {
			const
				es = this.state.hitbox,
				mp = mesh.position,
				ms = mesh.realSize ?? mesh.size;

			return (
				x < mp.x + ms[0] &&
				x + es[0] > mp.x &&
				y + es[1] > mp.y &&
				y < mp.y + ms[1]
			);
		},
		intersectsMeshes: (meshes, x, y) => {
			for (const mesh of meshes) {
				if (this.intersects(mesh, x, y)) return true;
			}

			return false;
		},
	});
}