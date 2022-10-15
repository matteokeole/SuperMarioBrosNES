import {Matrix3} from "./index.js";

/**
 * Renderer singleton.
 * 
 * @constructor
 * @return	{this}
 */
function Renderer() {
	const
		canvas	= document.createElement("canvas"),
		gl		= canvas.getContext("webgl2");

	if (!gl) return console.error("This browser does not support WebGL 2.");

	// Enable texture transparency
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);

	const
		vao			= gl.createVertexArray(),
		buffer		= {
			vertex:	gl.createBuffer(),
			index:	gl.createBuffer(),
			uv:		gl.createBuffer(),
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
		 * @return	{this}
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

			// Initialize index buffer
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.index);

			// Locate vertex (position) attribute
			attribute.position = gl.getAttribLocation(program, "a_position");
			gl.enableVertexAttribArray(attribute.position);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertex);
			gl.vertexAttribPointer(attribute.position, 2, gl.FLOAT, false, 0, 0);

			// Locate UV attribute
			attribute.uv = gl.getAttribLocation(program, "a_uv");
			gl.enableVertexAttribArray(attribute.uv);
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer.uv);
			gl.vertexAttribPointer(attribute.uv, 2, gl.FLOAT, true, 0, 0);

			// Locate world matrix uniform
			uniform.world = gl.getUniformLocation(program, "u_world");

			// Locate direction uniform
			uniform.direction = gl.getUniformLocation(program, "u_direction");

			// Locate resolution uniform
			uniform.resolution = gl.getUniformLocation(program, "u_resolution");

			// Locate repeat uniform
			uniform.repeat = gl.getUniformLocation(program, "u_repeat");

			return this;
		},
		/**
		 * Renders a frame from a specified scene.
		 * 
		 * @param	{Scene}	scene
		 * @return	{this}
		 */
		render: scene => {
			const {gl} = this;

			gl.clearColor(...scene.background.toFloat32Array(), 1);
			gl.clear(gl.COLOR_BUFFER_BIT);

			gl.uniform2f(uniform.resolution, canvas.width, canvas.height);

			let world, position, vertices, indices, texture, uvs, size, uv;

			// Render environment meshes
			for (const mesh of scene.environment) {
				({position, vertices, indices, texture, uvs, size, uv} = mesh);
				world = Matrix3.translation(position);

				// Pass the world matrix
				gl.uniformMatrix3fv(uniform.world, false, world);

				// Default view direction
				gl.uniform2f(uniform.direction, 1, 1);

				// Pass the indexed vertices
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertex);
				gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

				// Pass the texture coordinates
				gl.bindTexture(gl.TEXTURE_2D, texture.texture);
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer.uv);
				gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

				gl.uniform4fv(uniform.repeat, new Float32Array([
					uv[0] / texture.width,
					uv[1] / texture.height,
					size[0] / texture.width,
					size[1] / texture.height,
				]));

				gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
			}

			// Render meshes
			for (const mesh of scene.meshes) {
				({position, vertices, indices, texture, uvs, size, uv} = mesh);
				world = Matrix3.translation(position);

				// Pass the world matrix
				gl.uniformMatrix3fv(uniform.world, false, world);

				// Default view direction
				gl.uniform2f(uniform.direction, 1, 1);

				// Pass the indexed vertices
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertex);
				gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

				// Pass the texture coordinates
				gl.bindTexture(gl.TEXTURE_2D, texture.texture);
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer.uv);
				gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

				gl.uniform4fv(uniform.repeat, new Float32Array([
					uv[0] / texture.width,
					uv[1] / texture.height,
					size[0] / texture.width,
					size[1] / texture.height,
				]));

				gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
			}

			// Render entities
			for (const entity of scene.entities) {
				const {vertices, position, direction, indices, state} = entity;
				const {size, texture, uv} = state;

				// Pass the world matrix
				world = Matrix3.translation(position);
				gl.uniformMatrix3fv(uniform.world, false, world);

				// Pass the indexed vertices
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertex);
				gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

				// Entity view direction
				gl.uniform2f(uniform.direction, direction.x, direction.y);

				// Pass the texture coordinates
				gl.bindTexture(gl.TEXTURE_2D, texture.texture);
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer.uv);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
					0, 0,
					1, 0,
					0, 1,
					1, 1,
				]), gl.STATIC_DRAW);

				gl.uniform4fv(uniform.repeat, new Float32Array([
					uv[0] / texture.width,
					uv[1] / texture.height,
					size[0] / texture.width,
					size[1] / texture.height,
				]));

				gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
			}

			return this;
		},
		/**
		 * Stretches the canvas to the page dimensions.
		 * 
		 * @return	{this}
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