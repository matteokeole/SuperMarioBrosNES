/**
 * @todo
 * 
 * @constructor
 * @return	{self}
 */
export function Mesh({position}) {
	return Object.assign(this, {
		position,
		indices: new Uint16Array([
			0, 2, 1,
			2, 3, 1,
		]),
		uvs: new Float32Array([
			0, 0,
			1, 0,
			0, 1,
			1, 1,
		]),
	});
}