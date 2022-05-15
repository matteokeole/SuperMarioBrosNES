export const
	buffer = document.createElement("canvas"),
	pattern_buffer = document.createElement("canvas");

buffer.className = "buffer";
document.body.appendChild(buffer);

pattern_buffer.className = "buffer";
pattern_buffer.width = 48;
pattern_buffer.height = 48;
pattern_buffer.ctx = pattern_buffer.getContext("2d");
pattern_buffer.ctx.imageSmoothingEnabled = false;
document.body.appendChild(pattern_buffer);

// Initialize sprites.png
const sprites = new Image();
sprites.addEventListener("load", function() {
	// Resize the buffer to the image size
	buffer.width = this.width;
	buffer.height = this.height;

	buffer.getContext("2d").drawImage(this, 0, 0);
});
sprites.src = "assets/textures/sprites.png";