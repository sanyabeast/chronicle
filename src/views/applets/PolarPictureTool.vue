<template>
    <div :class="{ mobile: is_mobile }" class="view polar-picture-tool" @mousemove="handle_mousemove" @mousedown="handle_mousedown"
        @mouseup="handle_mouseup" @contextmenu.prevent="">
        <ThreeRenderer ref="three_renderer" :helpers="true" orbit_controls>
            <p class="button open-file" @click="open_file">open file</p>
            <div class="separator"></div>
            <p class="button toggle-grid" :class="{ active: grid }" @click="grid = !grid">grid</p>
            <p class="button toggle-tiling" :class="{ active: tiling }" @click="set_tiling(!tiling)">tiling</p>
            <div class="separator"></div>
            <p class="button mode" :class="{ active: mode === 0 }" @click="set_mode(0)">original</p>
            <p class="button mode" :class="{ active: mode === 1 }" @click="set_mode(1)">polar to carthesian</p>
            <p class="button mode" :class="{ active: mode === 2 }" @click="set_mode(2)">polar flip</p>
            <p class="button mode" :class="{ active: mode === 3 }" @click="set_mode(3)">carthesian to polar</p>
            <p class="button mode" :class="{ active: mode === 4 }" @click="set_mode(4)">carthesian to polar [b]</p>

        </ThreeRenderer>
        <!-- Add file input for drag and drop -->
        <input type="file" accept="image/*" @change="handle_image_upload" style="display: none" ref="fileInput" />
        <div class="grid" v-if="grid">
            <div>
            </div>
            <div>
            </div>
        </div>
        <div class="info">
            <p v-if="!is_mobile">offset: {{ texture_offset.x }}, {{ texture_offset.y }}</p>
            <p v-if="!is_mobile">scale: {{ texture_scale.x }}, {{ texture_scale.y }}</p>
            <div v-if="!is_mobile" class="separator"></div>
            <p v-if="!is_mobile" class="instructions">
                This applet allows you to transform the content of an image with radial symmetry into a tileable pattern.
                You can also do the reverse - wrap a seamless pattern around a circle, turning it into an object with radial
                symmetry.
            </p>
            <div v-if="!is_mobile" class="separator"></div>
            <p v-if="!is_mobile" class="instructions">Adjust the <span class="offset">offset</span> with the <span
                    class="offset">left</span>
                mouse button,
                <span class="scale">scale</span> with the
                <span class="scale">right</span> mouse button, and
                <span class="reset">reset</span> transformations
                with the <span class="reset">middle</span> mouse button or the <span class="reset">space</span> key.
            </p>
            <p v-if="is_mobile" class="instructions">
                The applet does not have full functionality support on mobile devices - it's better to switch to a PC.
            </p>
        </div>
    </div>
    <!-- Other components and UI elements -->
</div></template>
  
<script>

import * as THREE from 'three';
import ThreeRenderer from '../../components/ThreeRenderer.vue';

export default {
    name: 'PolarPictureTool',
    components: {
        ThreeRenderer,
    },
    data() {
        return {
            mouse_mode: -1,
            prev_pointer_position: { x: 0, y: 0 },
            mode: 1,
            grid: true,
            texture_offset: new THREE.Vector2(0, 0),
            texture_scale: new THREE.Vector2(1, 1),
            tiling: false
        };
    },
    computed: {
        is_mobile() {
            return this.$store.state.is_mobile_device;
        },
    },
    props: {
        image: {
            type: String,
            default: '',
        },
    },
    mounted() {
        console.log(this.$refs.three_renderer)
        let plane_geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        let plane_material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_mouse: { value: new THREE.Vector2() },
                u_map: { value: null },
                u_mode: { value: this.mode },
                u_offset: { value: this.texture_offset },
                u_scale: { value: this.texture_scale },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position * 2., 1.0 );
                }
            `,
            fragmentShader: `
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
            `,
        });

        let plane = this.plane = new THREE.Mesh(plane_geometry, plane_material);
        this.$refs.three_renderer.scene.add(plane);

        this.load_texture(this.image)
        document.addEventListener('keydown', this.handle_keydown);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handle_keydown);
    },
    methods: {
        set_mode(mode) {
            this.mode = mode;
            this.$refs.three_renderer.scene.children.forEach((child) => {
                if (child.material instanceof THREE.ShaderMaterial) {
                    child.material.uniforms.u_mode.value = this.mode;
                }
            });
        },
        open_file() {
            this.$refs.fileInput.click();
        },
        load_texture(src, on_load) {
            return new Promise((resolve, reject) => {
                let loader = new THREE.TextureLoader();
                loader.load(src, (texture) => {
                    this.set_texture(texture)
                    resolve(texture);
                });
            })
        },
        load_image(src) {
            return new Promise((resolve, reject) => {
                let image = new Image();
                image.src = src;
                image.onload = () => {
                    resolve(image);
                };
            });
        },
        get_image_src(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
        },
        set_texture(texture) {
            this.reset_transformations()
            this.texture = texture
            this.set_tiling(this.tiling)
            texture.needsUpdate = true
            this.plane.material.uniforms.u_map.value = texture;
        },
        set_tiling(enabled) {
            this.tiling = enabled
            if (this.texture) {
                this.texture.wrapS = enabled ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
                this.texture.wrapT = enabled ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping
                this.texture.needsUpdate = true
            }
        },
        async handle_image_upload(event) {
            const file = event.target.files[0];
            if (file) {
                const image_src = await this.get_image_src(file);
                let image = await this.load_image(image_src);
                this.set_texture(new THREE.Texture(image))
            }
        },
        handle_mousedown(event) {
            event.preventDefault()
            this.prev_pointer_position.x = event.clientX
            this.prev_pointer_position.y = event.clientY

            this.mouse_mode = event.button

            if (this.mouse_mode === 1) {
                this.reset_transformations()
            }
        },
        reset_transformations() {
            this.texture_offset.set(0, 0)
            this.texture_scale.set(1, 1)
        },
        handle_mouseup(event) {
            this.mouse_mode = -1
        },
        handle_mousemove(event) {
            if (this.mouse_mode > -1) {
                let delta_x = event.clientX - this.prev_pointer_position.x
                let delta_y = event.clientY - this.prev_pointer_position.y

                this.prev_pointer_position.x = event.clientX
                this.prev_pointer_position.y = event.clientY

                let dx = delta_x / this.$refs.three_renderer.width / 4
                let dy = delta_y / this.$refs.three_renderer.height / 4

                switch (this.mouse_mode) {
                    case 0: {
                        this.texture_offset.x += dx
                        this.texture_offset.y -= dy // Invert the y axis
                        break;
                    }
                    case 2: {
                        this.texture_scale.x += dx
                        this.texture_scale.y -= dy // Invert the y axis
                        break;
                    }
                    default:
                        break;
                }
            }
        },
        handle_keydown(event) {
            if (event.keyCode === 27 || event.keyCode === 32) {
                this.reset_transformations()
            }
        }
    },
};
</script>
<style lang="less">
.view.polar-picture-tool {
    padding: 0;

    .renderer_container {
        width: 100%;
        height: 100%;

        .controls {
            .separator {
                height: 16px;
                border-bottom: 1px solid #fff;
            }

            .button {
                box-sizing: border-box;

                &.open-file {
                    font-size: 24px;
                }

                &.toggle-grid,
                &.toggle-tiling {
                    &.active {
                        color: red;
                    }
                }

                &.mode {
                    color: #555;

                    &.active {
                        color: #fff;
                    }
                }
            }
        }
    }

    .info {
        position: absolute;
        top: 16px;
        left: 16px;
        width: 256px;

        .separator {
            height: 16px;
        }

        p {
            margin: 0;
            font-size: 12px;
            background-color: #00000040;

            &.instructions {
                color: #d7d7d7;
                opacity: 0;

                span {
                    color: #fff;
                    font-weight: 800;

                    &.offset {
                        color: cyan;
                    }

                    &.scale {
                        color: yellow;
                    }

                    &.reset {
                        color: magenta;
                    }
                }
            }
        }

        &:hover {
            p.instructions {
                opacity: 1;
            }
        }
    }

    .grid {
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        div:nth-child(1) {
            position: absolute;
            border-top: 1px dashed #eeeeee51;
            top: 50%;
            width: 100%;
        }

        div:nth-child(2) {
            position: absolute;
            border-left: 1px dashed #eeeeee51;
            left: 50%;
            height: 100%;
        }
    }

    &.mobile {
        .info {

            .instructions {
                background-color: #0000009a;
                opacity: 1;
            }
        }
    }
}
</style>