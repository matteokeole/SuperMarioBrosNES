/**
 * Renderer singleton.
 * 
 * @constructor
 * @returns	{self}
 */
function Renderer() {
	const
		canvas	= document.createElement("canvas"),
		gl		= canvas.getContext("webgl2");

	if (!gl) return console.error("This browser does not support WebGL 2.");

	const
		vao			= gl.createVertexArray(),
		buffer		= {
			position: gl.createBuffer(),
			resolution: gl.createBuffer(),
		},
		attribute	= {},
		uniform		= {};

	Object.assign(this, {
		canvas,
		gl,
		vao,
		buffer,
		attribute,
		uniform,
		/**
		 * Links a WebGLProgram to this renderer.
		 * 
		 * @param	{WebGlProgram}	program
		 * @returns	{self}
		 */
		linkProgram: program => {
			const {gl} = this;

			gl.linkProgram(program);

			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.error(
				"Unable to link the program.",
				gl.getProgramInfoLog(program),
			);

			gl.useProgram(program);
			gl.bindVertexArray(vao);

			// Locate position attribute
			{
				attribute.position = gl.getAttribLocation(program, "position");

				gl.enableVertexAttribArray(attribute.position);
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
				gl.vertexAttribPointer(attribute.position, 2, gl.FLOAT, false, 0, 0);
			}

			// Locate resolution attribute
			uniform.resolution = gl.getUniformLocation(program, "resolution");

			return this;
		},
		/**
		 * Renders a frame from a specified scene.
		 * 
		 * @param	{Scene}	scene
		 * @returns	{self}
		 */
		render: scene => {
			const {gl} = this;

			gl.clearColor(...scene.background.toFloat32Array(), 1);
			gl.clear(gl.COLOR_BUFFER_BIT);

			gl.uniform2f(uniform.resolution, canvas.width, canvas.height);

			let w, h, x, y;
			for (const mesh of scene.meshes) {
				({w, h, x, y} = mesh);

				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					x,     y,
					x + w, y,
					x,     y + h,
					x,     y + h,
					x + w, y,
					x + w, y + h,
				]), gl.STATIC_DRAW);
			}

			gl.drawArrays(gl.TRIANGLES, 0, 6);

			return this;
		},
		/**
		 * Stretches the canvas to the page dimensions.
		 * 
		 * @returns	{self}
		 */
		resize: () => {
			const {gl, canvas} = this;

			Object.assign(canvas, {
				width: innerWidth,
				height: innerHeight,
			});

			gl.viewport(0, 0, canvas.width, canvas.height);

			return this;
		},
	});

	// Stretch the canvas
	this.resize();

	canvas.textContent = "This browser does not support Canvas API."
	document.body.appendChild(canvas);

	delete this.constructor;

	return this;
}

/** @type {Renderer} */
const renderer = new Renderer();

export {renderer as Renderer};