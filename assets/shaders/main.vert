#version 300 es

in vec2 a_position;
in vec2 a_uv;

uniform vec2 u_resolution;

out vec2 v_uv;

void main() {
	vec2 position = a_position / u_resolution * 2.0 - 1.0;

	gl_Position = vec4(position, 0, 1);

	v_uv = a_uv;
}