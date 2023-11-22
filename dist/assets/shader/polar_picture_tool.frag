uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_map;
uniform int u_mode;
uniform vec2 u_offset;
uniform vec2 u_scale;

varying vec2 vUv;

vec2 square_to_polar(vec2 coords){
    vec2 center = vec2(0.5);
    vec2 delta = coords - center;
    float radius = length(delta);
    float angle = atan(delta.y, delta.x);
    // Convert the angle to a normalized value between 0 and 1
    angle = (angle + 3.14159265359) / (2.0 * 3.14159265359);

    return (vec2(angle, radius * 2.)  + u_offset) * u_scale;
}

vec2 square_to_polar_b(vec2 coords){
    
    vec2 center = vec2(0.5);
    vec2 delta = coords - center;
    float radius = length(delta);
    float angle = atan(delta.y, delta.x);
    // Convert the angle to a normalized value between 0 and 1
    angle = (angle + 3.14159265359) / (2.0 * 3.14159265359);

    return (vec2(angle, 1.-(radius * 2.))  + u_offset) * u_scale;
}

vec2 polar_to_square(vec2 coords) {
    float angle = coords.x * (2.0 * 3.14159265359) - 3.14159265359;
    float radius = coords.y;
    
    // Calculate the corresponding Cartesian coordinates
    float x = radius * cos(angle);
    float y = radius * sin(angle);

    // Offset the coordinates by the center
    vec2 center = vec2(0.5, 0.5) + u_offset;
    return (center + vec2(x, y)) * u_scale;
}

vec2 polar_flip(vec2 coords) {
    vec2 center = vec2(0.5);
    vec2 polarCoords = square_to_polar(coords);
    polarCoords.x = 1.0 - polarCoords.x;  // Flip the angle
    polarCoords.y = 1.0 - polarCoords.y;  // Flip the radius
    return polar_to_square(polarCoords);
}

void main() {
    vec4 map = vec4(0.0);

    if (u_mode == 0) {
        map = texture2D(u_map, (vUv + u_offset) * u_scale);
        }  else if (u_mode == 1) {
        map = texture2D(u_map, polar_to_square(vUv));
        }  else if (u_mode == 2) {
        map = texture2D(u_map, polar_flip(vUv));
        }   else if (u_mode == 3) {
        map = texture2D(u_map, square_to_polar(vUv));
        } else if (u_mode == 4) {
        map = texture2D(u_map, square_to_polar_b(vUv));
    }
    gl_FragColor = vec4(map);
}