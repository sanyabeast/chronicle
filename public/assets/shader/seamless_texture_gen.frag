uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 u_color;
uniform sampler2D u_map;
uniform float u_viewscale;
uniform vec2 u_offset;
uniform vec2 u_contrast;
uniform float u_rotation;
uniform float u_crop;

varying vec2 vUv;

vec4 smoothstep_blend(vec4 color_a, vec4 color_b, float t) {
    // Use smoothstep for smooth interpolation
    t = smoothstep(0.0, 1.0, t);
    return mix(color_a, color_b, t);
}

vec4 get_seamless_value(vec2 uv){
    vec4 color_a = texture2D(u_map, uv);
    vec4 color_x = texture2D(u_map, vec2(1. - uv.x, uv.y));
    vec4 color_y = texture2D(u_map, vec2(uv.x, 1. - uv.y));

    vec4 color_ax = mix(color_a, color_x, pow(uv.x, u_contrast.x));
    vec4 color_ay = mix(color_ax, color_y, pow(uv.y, u_contrast.y));

    vec4 result = color_ay;

    return result;
}

void main() {
    vec2 uv = vUv * u_crop;
    uv = vec2(uv.x * cos(u_rotation) - uv.y * sin(u_rotation), uv.x * sin(u_rotation) + uv.y * cos(u_rotation));
    uv = vec2(fract(uv.x * u_viewscale), fract(uv.y * u_viewscale));

    // rotating uv

    vec4 color = texture2D(u_map, uv);
    gl_FragColor = get_seamless_value(uv);
}