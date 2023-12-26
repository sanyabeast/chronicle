uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_map;
uniform float u_scale;
uniform int u_invert_height;
uniform int u_invert_alpha;
uniform float u_contrast;
uniform float u_brightness;
uniform int u_iterations;
uniform int u_directx;
uniform int u_preview;
uniform float u_alpha_level;
uniform int u_alpha_apply;
uniform int u_radial_kernel;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

float process_coord(float value)
{
    return value;
    // return value - floor(value);
}

vec2 get_gradient_at_point(vec2 point_uv, vec2 uv_offset) {
    vec4 h_left = texture2D(u_map, vec2(process_coord(point_uv.x - uv_offset.x), point_uv.y));
    vec4 h_right = texture2D(u_map, vec2(process_coord(point_uv.x + uv_offset.x), point_uv.y));
    vec4 h_up = texture2D(u_map, vec2(point_uv.x, process_coord(point_uv.y - uv_offset.y)));
    vec4 h_down = texture2D(u_map, vec2(point_uv.x, process_coord(point_uv.y + uv_offset.y)));
    
    float h_left_value = length(h_left.xyz) / 3.;
    float h_right_value = length(h_right.xyz) / 3.;
    float h_up_value = length(h_up.xyz) / 3.;
    float h_down_value = length(h_down.xyz) / 3.;

    float h_left_alpha = abs(h_left.a - u_alpha_level);
    float h_right_alpha = abs(h_right.a - u_alpha_level);
    float h_up_alpha = abs(h_up.a - u_alpha_level);
    float h_down_alpha = abs(h_down.a - u_alpha_level);

    h_left_value *= u_brightness;
    h_right_value *= u_brightness;
    h_up_value *= u_brightness;
    h_down_value *= u_brightness;
    
    h_left_value = pow(h_left_value, u_contrast);
    h_right_value = pow(h_right_value, u_contrast);
    h_up_value = pow(h_up_value, u_contrast);
    h_down_value = pow(h_down_value, u_contrast);

    if (u_alpha_apply == 1) {
        h_left_alpha *= u_brightness;
        h_right_alpha *= u_brightness;
        h_up_alpha *= u_brightness;
        h_down_alpha *= u_brightness;
        
        h_left_alpha = pow(h_left_alpha, u_contrast);
        h_right_alpha = pow(h_right_alpha, u_contrast);
        h_up_alpha = pow(h_up_alpha, u_contrast);
        h_down_alpha = pow(h_down_alpha, u_contrast);
    }

    if (u_invert_height == 1) {
        h_left_value = 1.0 - h_left_value;
        h_right_value = 1.0 - h_right_value;
        h_up_value = 1.0 - h_up_value;
        h_down_value = 1.0 - h_down_value;
    }

    if (u_invert_alpha == 1) {
        h_left_alpha = 1.0 - h_left_alpha;
        h_right_alpha = 1.0 - h_right_alpha;
        h_up_alpha = 1.0 - h_up_alpha;
        h_down_alpha = 1.0 - h_down_alpha;
    }

    h_left_value *= h_left_alpha;
    h_right_value *= h_right_alpha;
    h_up_value *= h_up_alpha;
    h_down_value *= h_down_alpha;

    // Calculate the gradient
    vec2 local_gradient = vec2(h_left_value - h_right_value, h_up_value - h_down_value);
    return local_gradient;
}

vec2 polar_to_cartesian(float radius, float angle) {
    return vec2(radius * cos(angle), radius * sin(angle));
}

void main() {

    if (u_preview == 1) {
        gl_FragColor = texture2D(u_map, vUv);
    } 
    else {
        vec2 uv_offset = (1.0 / u_resolution.xy) * u_scale;

        // Calculate the gradient
        int iterations = 0;
        vec2 gradient = vec2(0.0, 0.0);

        if (u_radial_kernel == 0){
            for (int x = -u_iterations + 1; x <= u_iterations; x++){
                for (int y = -u_iterations + 1; y <= u_iterations; y++){
                    gradient += get_gradient_at_point(vUv + vec2(x, y) * uv_offset, uv_offset);
                    iterations++;
                }
            }
        } 
        else {
            for (int r = -u_iterations + 1; r <= u_iterations; r++){
                int angle_iterations = int(2.0 * PI * float(r));

                for (int a = -angle_iterations + 1; a <= angle_iterations; a++){
                    vec2 vec = polar_to_cartesian(float(r), (float(a) / float(angle_iterations)) * PI);

                    gradient += get_gradient_at_point(vUv + vec * uv_offset, uv_offset);
                    iterations++;
                }
            }
            
        }

        

        gradient /= float(iterations);
        vec3 normal = normalize(vec3(gradient, 1.0));

        if (u_directx == 1) {
            normal = normal * vec3(1.0, -1.0, 1.0);
        }
        // Map normal to [0, 1] range
        normal = normal * 0.5 + 0.5;
        // Output normal as color
        gl_FragColor = vec4(normal, 1.0);
    }
}