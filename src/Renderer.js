/**
 * Renderer singleton.
 * 
 * @constructor
 * @returns	{self}
 */
function Renderer() {
	const
		canvas = document.createElement("canvas"),
		gl = canvas.getContext("webgl2"),
		vao = gl.createVertexArray(),
		buffer = {
			position: gl.createBuffer(),
			resolution: gl.createBuffer(),
		},
		attribute = {},
		uniform = {};

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

			for (const mesh of scene.meshes) {
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					0, 0,
					200, 0,
					0, 100,
					0, 100,
					200, 0,
					200, 100,
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
			Object.assign(this.canvas, {
				width: innerWidth,
				height: innerHeight,
			});

			return this;
		},
	});

	// Stretch the canvas
	this.resize();

	document.body.appendChild(canvas);

	return this;
}

const renderer = new Renderer();

export {renderer as Renderer};