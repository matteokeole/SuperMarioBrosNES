/**
 * 3x3 matrix class.
 * 
 * @class
 * @extends	Array
 * @param	{...number}	[elements=0, 0, 0, 0, 0, 0, 0, 0, 0]	Matrix elements
 */
export class Matrix3 extends Array {
	constructor(...elements) {
		9 !== elements.length ?
			super(0, 0, 0, 0, 0, 0, 0, 0, 0) :
			super(...elements);
	}
}

/**
 * Creates a translation matrix.
 * 
 * @param	{Vector2}	v
 * @returns	{Matrix3}
 */
Matrix3.translation = v => {
	const {x, y} = v;

	return new Matrix3(
		1, 0, 0,
		0, 1, 0,
		x, y, 1,
	);
};