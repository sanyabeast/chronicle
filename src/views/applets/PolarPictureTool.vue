<template>
    <div :class="{ mobile: is_mobile }" class="view polar-picture-tool" @mousemove="handle_mousemove"
        @mousedown="handle_mousedown" @mouseup="handle_mouseup" @contextmenu.prevent=""
        @dragenter.prevent="handle_dragenter" @dragover.prevent="handle_dragover" @drop.prevent="handle_drop">
        <ThreeRenderer ref="three_renderer" :download_image_name="download_image_name" :show_controls="!dragging">
            <p class="button open-file" @click="open_file">open file</p>
            <div class="separator"></div>
            <p class="button toggle-grid" :class="{ active: grid }" @click="grid = !grid">grid</p>
            <p class="button toggle-tiling" :class="{ active: tiling > 0 }" @click="set_tiling(tiling + 1)"
                v-html="tiling_label"></p>
            <div class="separator"></div>
            <p class="button mode" :class="{ active: mode === 0 }" @click="set_mode(0)">original</p>
            <p class="button mode" :class="{ active: mode === 1 }" @click="set_mode(1)">polar to carthesian</p>
            <p class="button mode" :class="{ active: mode === 2 }" @click="set_mode(2)">polar flip</p>
            <p class="button mode" :class="{ active: mode === 3 }" @click="set_mode(3)">carthesian to polar</p>
            <p class="button mode" :class="{ active: mode === 4 }" @click="set_mode(4)">carthesian to polar [b]</p>

        </ThreeRenderer>
        <!-- Add a drop target -->
        <div class="drop-target" v-if="!is_mobile" :class="{ dragging: dragging }">
            <p v-if="dragging">Drag and drop an image here</p>
        </div>

        <!-- Add file input for drag and drop -->
        <input type="file" accept="image/*" @change="handle_image_upload" style="display: none" ref="fileInput" />
        <div class="grid" v-if="grid">
            <div>
            </div>
            <div>
            </div>
        </div>
        <div class="info" v-if="!dragging">
            <p v-if="!is_mobile">offset: {{ round_to(texture_offset.x, 4) }}, {{ round_to(texture_offset.y, 4) }}</p>
            <p v-if="!is_mobile">scale: {{ round_to(texture_scale.x, 4) }}, {{ round_to(texture_scale.y, 3) }}</p>
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
  
<script >

import * as THREE from 'three';
import mixins from 'vue-typed-mixins'
import ThreeRenderer from '../../components/ThreeRenderer.vue';
import BaseComponent from '@/components/BaseComponent.vue';

const samples = [
    'assets/image/planet.png',
    'assets/image/moon.png',
    'assets/image/clock.png',
    'assets/image/pattern.png',
]

// export interface IPolarPictureToolData {
//     dragging: boolean;
//     download_image_name: string;
//     mouse_mode: number;
//     prev_pointer_position: { x: number, y: number };
//     mode: number;
//     grid: boolean;
//     texture_offset: THREE.Vector2;
//     texture_scale: THREE.Vector2;
//     tiling: number;

// }

export default mixins(BaseComponent).extend({
    name: 'PolarPictureTool',
    components: {
        ThreeRenderer,
    },
    data() {
        return {
            dragging: false,
            download_image_name: 'rendered_frame',
            mouse_mode: -1,
            prev_pointer_position: { x: 0, y: 0 },
            mode: 1,
            grid: true,
            texture_offset: new THREE.Vector2(0, 0),
            texture_scale: new THREE.Vector2(1, 1),
            tiling: 2
        };
    },
    computed: {
        is_mobile() {
            return this.$store.state.is_mobile_device;
        },
        tiling_label() {
            switch (this.tiling) {
                case 0: {
                    return 'tiling [disabled]';
                }
                case 1: {
                    return 'tiling [repeated]';
                }
                case 2: {
                    return 'tiling [mirrored]';
                }
            }
        }
    },
    props: {
        image: {
            type: String,
            default: '',
        },
    },
    mounted() {
        this.init()
        document.addEventListener('keydown', this.handle_keydown);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handle_keydown);
    },
    methods: {
        async init() {
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
                fragmentShader: await this.load_text('assets/shader/polar_picture_tool.frag'),
            });

            let plane = this.plane = new THREE.Mesh(plane_geometry, plane_material);
            this.$refs.three_renderer.scene.add(plane);

            let image = this.image

            if (image === 'random') {
                image = samples[Math.floor(Math.random() * samples.length)]
            }

            this.load_texture(image)
        },
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
            this.download_image_name = this.remove_extension(src)
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
        set_tiling(value) {
            value = value % 3
            this.tiling = value


            if (this.texture) {
                switch (value) {
                    case 0: {
                        this.texture.wrapS = THREE.ClampToEdgeWrapping
                        this.texture.wrapT = THREE.ClampToEdgeWrapping
                        break;
                    }
                    case 1: {
                        this.texture.wrapS = THREE.RepeatWrapping
                        this.texture.wrapT = THREE.RepeatWrapping
                        break;
                    }
                    case 2: {
                        this.texture.wrapS = THREE.MirroredRepeatWrapping
                        this.texture.wrapT = THREE.MirroredRepeatWrapping
                        break;
                    }
                }

                this.texture.needsUpdate = true
            }
        },
        async handle_image_upload(event) {
            const file = event.target.files[0];
            if (file) {
                const image_src = await this.get_image_src(file);
                let image = await this.load_image(image_src);
                this.download_image_name = this.remove_extension(file.name)
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
        },
        // New method to handle dropped files
        async handle_drop(event) {
            event.preventDefault();
            this.dragging = false;
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0]; // Assuming you only handle one file
                const image_src = await this.get_image_src(file);
                let image = await this.load_image(image_src);
                this.download_image_name = this.remove_extension(file.name)
                this.set_texture(new THREE.Texture(image))
            }
        },

        // New method to handle dragenter event
        handle_dragenter(event) {
            this.dragging = true;
            event.preventDefault();
        },

        // New method to handle dragover event
        handle_dragover(event) {
            event.preventDefault();
        },
        round_to(number, decimalPlaces) {
            if (isNaN(number) || isNaN(decimalPlaces)) {
                return NaN; // Return NaN if either the number or decimalPlaces is not a number
            }

            const multiplier = Math.pow(10, decimalPlaces);
            return Math.round(number * multiplier) / multiplier;
        },
        remove_extension(file_name) {
            if (typeof file_name !== 'string') {
                throw new Error('Input must be a string');
            }

            const last_dot_index = file_name.lastIndexOf('.');
            if (last_dot_index === -1) {
                return file_name; // No file extension found
            }

            return file_name.slice(0, last_dot_index);
        }
    },
});
</script>
<style lang="less">
.view.polar-picture-tool {
    padding: 0;

    .drop-target {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.2);
        width: 100%;
        height: 100%;
        position: absolute;
        box-sizing: border-box;
        top: 0;
        left: 0;
        z-index: 1;
        cursor: pointer;
        z-index: 2;

        transition: all 0.2s ease-in-out;

        &:after {
            content: "";
            position: absolute;
            opacity: 0;
            top: 32px;
            left: 32px;
            transition: all 0.2s ease-in-out;
            border-radius: 16px;
            width: calc(100% - 64px);
            height: calc(100% - 64px);
            background-color: black;
            border: 2px dotted #fff;
        }

        &.dragging {
            &:after {
                opacity: 0.4;
                transition: all 0.2s ease-in-out;
            }
        }

        p {
            font-size: 20px;
            color: white;
            z-index: 1;
        }
    }

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

            width: auto;
            display: table;
            background-color: #00000040;

            &.instructions {
                display: inline;
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