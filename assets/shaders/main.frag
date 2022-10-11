#version 300 es

precision mediump float;

in vec2 v_uv;

uniform sampler2D u_texture;
uniform vec4 u_repeat;

out vec4 fragColor;

void main() {
    // fragColor = vec4(1);
	fragColor = texture(u_texture, mod(v_uv, vec2(1)) * u_repeat.zw + u_repeat.xy);
}