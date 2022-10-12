#version 300 es

in vec2 a_position;
in vec2 a_uv;

uniform vec2 u_resolution;
uniform mat3 u_world;

out vec2 v_uv;

void main() {
	vec2 position =
		vec2(u_world * vec3(a_position, 1))
		/ u_resolution
		* 4.0 // Must be a multiple of 4
		- 1.0;

	gl_Position = vec4(position, 0, 1);

	v_uv = a_uv;
}