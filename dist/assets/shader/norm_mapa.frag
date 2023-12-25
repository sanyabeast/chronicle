uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_map;
uniform float u_scale;
uniform int u_invert_height;
uniform float u_contrast;
uniform float u_brightness;
uniform int u_iterations;
uniform int u_directx;
uniform int u_preview;

varying vec2 vUv;

float process_coord(float value)
{
    return value;
    // return value - floor(value);
}

void main() {
    if (u_preview == 1) {
        gl_FragColor = texture2D(u_map, vUv);
    } 
    else {
        vec2 uvOffset = (1.0 / u_resolution.xy) * u_scale;

        // Calculate the gradient
        int iterations = 0;

        vec2 gradient = vec2(0.0, 0.0);

        for (int x = -u_iterations + 1; x <= u_iterations; x++){
            for (int y = -u_iterations + 1; y <= u_iterations; y++){
                vec2 local_uv = vUv + vec2(x, y) * uvOffset;

                vec4 h_left = texture2D(u_map, vec2(process_coord(local_uv.x - uvOffset.x), local_uv.y));
                vec4 h_right = texture2D(u_map, vec2(process_coord(local_uv.x + uvOffset.x), local_uv.y));
                vec4 h_up = texture2D(u_map, vec2(local_uv.x, process_coord(local_uv.y - uvOffset.y)));
                vec4 h_down = texture2D(u_map, vec2(local_uv.x, process_coord(local_uv.y + uvOffset.y)));
    
                float h_left_value = length(h_left.xyz) / 3.;
                float h_right_value = length(h_right.xyz) / 3.;
                float h_up_value = length(h_up.xyz) / 3.;
                float h_down_value = length(h_down.xyz) / 3.;

                h_left_value *= u_brightness;
                h_right_value *= u_brightness;
                h_up_value *= u_brightness;
                h_down_value *= u_brightness;
                
                h_left_value = pow(h_left_value, u_contrast);
                h_right_value = pow(h_right_value, u_contrast);
                h_up_value = pow(h_up_value, u_contrast);
                h_down_value = pow(h_down_value, u_contrast);

                if (u_invert_height == 1) {
                    h_left_value = 1.0 - h_left_value;
                    h_right_value = 1.0 - h_right_value;
                    h_up_value = 1.0 - h_up_value;
                    h_down_value = 1.0 - h_down_value;
                }

                h_left_value *= h_left.a;
                h_right_value *= h_right.a;
                h_up_value *= h_up.a;
                h_down_value *= h_down.a;

                // Calculate the gradient
                vec2 local_gradient = vec2(h_left_value - h_right_value, h_up_value - h_down_value);

                gradient += local_gradient;
                iterations++;
                
            }
        }

        gradient /= float(iterations);

        // Calculate the normal from the gradient
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