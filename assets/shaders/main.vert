#version 300 es

in vec2 position;

uniform vec2 resolution;

void main() {
	vec2 newPosition = position / resolution * 2.0 - 1.0;

	gl_Position = vec4(newPosition, 0, 1);
}