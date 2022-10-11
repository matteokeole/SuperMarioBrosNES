/**
 * Constructs a 2-dimensional vector.
 * 
 * @constructor
 * @param	{number}	x
 * @param	{number}	y
 * @return	{self}
 */
export function Vector2(x, y) {
	return this.set(x, y);
};

/**
 * Returns a copy of this vector.
 * 
 * @return	{Vector2}
 */
Vector2.prototype.clone = function() {
	return new Vector2(this);
};

/**
 * Divides the components of this vector by n.
 * 
 * @param	{number}	n
 * @return	{self}
 */
Vector2.prototype.divideScalar = function(n) {
	return this.multiplyScalar(1 / n);
};

/**
 * Multiplies the components of this vector by n.
 * 
 * @param	{number}	n
 * @return	{self}
 */
Vector2.prototype.multiplyScalar = function(n) {
	this.x *= n;
	this.y *= n;

	return this;
};

/**
 * Sets the components of this vector.
 * 
 * @param	{number|Vector2}	x
 * @param	{number}			[y]
 * @return	{self}
 */
Vector2.prototype.set = function(x, y) {
	return Object.assign(this, x instanceof Vector2 ? x : {x, y});
};