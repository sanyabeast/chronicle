uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 u_color;

varying vec2 vUv;

void main() {
    gl_FragColor = vec4(u_mouse, 0, 1.0);
}