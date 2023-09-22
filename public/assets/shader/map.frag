uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 u_color;
uniform sampler2D u_map;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(u_map, vUv);
    gl_FragColor = color;
}