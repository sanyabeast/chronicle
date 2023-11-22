uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_map;

varying vec2 vUv;

// Fixed color palette. Adjust these as desired.
const vec3 palette[4] = vec3[](
    vec3(0.0, 0.0, 0.0),   // black
    vec3(1.0, 0.0, 0.0),   // red
    vec3(0.0, 1.0, 0.0),   // green
    vec3(1.0, 1.0, 1.0)    // white
);

vec3 findClosestColor(vec3 color) {
    float minDistance = distance(color, palette[0]);
    vec3 closestColor = palette[0];
    for (int i = 1; i < 4; i++) {
        float d = distance(color, palette[i]);
        if (d < minDistance) {
            minDistance = d;
            closestColor = palette[i];
        }
    }
    return closestColor;
}

void main() {
    vec4 color = texture2D(u_map, vUv);
    
    // Simple dithering pattern based on pixel position.
    float ditherThreshold = fract(sin(dot(vUv * u_resolution, vec2(12.9898, 78.233))) * 43758.5453);
    
    if (color.r < ditherThreshold) {
        color.rgb = findClosestColor(color.rgb);
    }

    gl_FragColor = color;
}