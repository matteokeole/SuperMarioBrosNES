/**
 * @todo
 * 
 * @constructor
 * @returns	{self}
 */
export function Mesh({width: w, height: h, position}) {
	const {x, y} = position;

	return Object.assign(this, {
		position,
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