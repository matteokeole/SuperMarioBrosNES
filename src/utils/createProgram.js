import {Renderer} from "../index.js";

/**
 * Creates a WebGLProgram.
 * NOTE: Attributes and uniforms must be located manually.
 * 
 * @async
 * @param	{string}	vertexPath		Vertex shader file path
 * @param	{string}	fragmentPath	Fragment shader file path
 * @returns	{WebGLProgram}
 */
export async function createProgram(vertexPath, fragmentPath) {
	const
		{gl} = Renderer,
		program = gl.createProgram();
	let source;

	// Load vertex shader
	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	source = await (await fetch(vertexPath, {headers: {"Cache-Control": "no-store"}})).text();

	gl.shaderSource(vertexShader, source);
	gl.compileShader(vertexShader);

	// Catch compilation errors before returning it
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		return console.error(`${vertexPath}: VERTEX SHADER ${gl.getShaderInfoLog(vertexShader)}`);
	}

	// Load fragment shader
	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	source = await (await fetch(fragmentPath, {headers: {"Cache-Control": "no-store"}})).text();

	gl.shaderSource(fragmentShader, source);
	gl.compileShader(fragmentShader);

	// Catch compilation errors before returning it
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		return console.error(`${fragmentPath}: FRAGMENT SHADER ${gl.getShaderInfoLog(fragmentShader)}`);
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	return program;
}