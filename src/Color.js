/**
 * Creates an utility object for handling an hexadecimal color.
 * This does not supports alpha value.
 * 
 * @constructor
 * @returns	{self}
 */
export function Color(value) {
	return Object.assign(this, {
		/**
		 * Returns the color hexadecimal variant preceded by the hash.
		 * 
		 * @returns	{string}
		 */
		toHex: () => `#${value.toString(16).padStart(6, 0)}`,
		/**
		 * Returns a Float32Array with the color's red, green and blue values.
		 * 
		 * @returns	{Float32Array}
		 */
		toFloat32Array: () => new Float32Array([
			(value >> 16 & 255) / 255,
			(value >> 8 & 255) / 255,
			(value & 255) / 255,
		]),
	});
}