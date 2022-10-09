/**
 * @todo
 * 
 * @constructor
 * @returns	{self}
 */
export function Mesh(w, h, x, y) {
	return Object.assign(this, {
		vertices: new Float32Array([
			x,     y + h,
			x + w, y + h,
			x,     y,
			x + w, y,
		]),
		indices: new Uint16Array([
			0, 2, 1,
			2, 3, 1,
		]),
	});
}