export function Texture({image, texture}) {
	const {width, height} = image;

	return Object.assign(this, {width, height, texture});
}