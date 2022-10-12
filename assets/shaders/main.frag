#version 300 es

precision mediump float;

in vec2 v_uv;

uniform vec2 u_direction;
uniform sampler2D u_texture;
uniform vec4 u_repeat;

out vec4 fragColor;

void main() {
	vec2 direction = sign(u_direction);
	vec2 uv = mod(v_uv * direction, vec2(1));

	fragColor = texture(u_texture, uv * u_repeat.zw + u_repeat.xy);
}