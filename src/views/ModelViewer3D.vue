<template>
    <div @keydown="handle_keydown" :class="{ mobile: is_mobile }" class="model-viewer-3d"
        @dragenter.prevent="handle_dragenter" @dragover.prevent="handle_dragover" @drop.prevent="handle_drop">
        <ThreeRenderer ref="three_renderer" :download_image_name="download_image_name" :show_controls="!dragging"
            :show_helpers="show_helpers" :orbit_controls="orbit_controls" :rendering_mode="rendering_mode"
            :camera_fov="camera_fov">
            <div class="separator"></div>
            <p class="button open-file" @click="open_file">open file</p>
            <div class="separator"></div>
            <p class="button" :class="{ active: show_flashlight }" @click="show_flashlight = !show_flashlight">flashlight
            </p>
            <p class="button"
                :class="{ active: show_background, disabled: rendering_mode !== EThreeSceneRenderinMode.Default }"
                @click="show_background = !show_background">background
            </p>
            <p class="button rendering-mode" :data-rendering-mode="rendering_mode_label" @click="toggle_rendering_mode"
                v-html="rendering_mode_label"></p>
            <div class="separator"></div>
            <p class="button clear scene" @click="clear_scene" v-if="model || hdri">clear all</p>
        </ThreeRenderer>
        <Showdown class="model-info" :src="info" v-if="info" />
        <div class="loader-container" v-if="is_loading">
            <Preloader />
        </div>
        <!-- Add a drop target -->
        <div class="drop-target" v-if="!is_mobile" :class="{ dragging: dragging }">
            <p v-if="dragging">Drag and drop an image here</p>
        </div>

        <!-- Add file input for drag and drop -->
        <input type="file" accept="*" @change="handle_file_upload" style="display: none" ref="fileInput" />
        <div class="info" v-if="!dragging"></div>
    </div>
</template>
  
<script lang="ts">

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import mixins from 'vue-typed-mixins'
import ThreeRenderer, { EThreeSceneRenderinMode } from '@/components/ThreeRenderer.vue';
import Preloader from '@/components/Preloader.vue';
import BaseComponent from '@/components/BaseComponent.vue';
import { debounce, isArray } from 'lodash';
import { get_file_extension } from '@/tools';


const draco_loader = new DRACOLoader();
draco_loader.setDecoderPath('assets/bin/draco/gltf/');
const gltf_loader = new GLTFLoader(); // Create a GLTFLoader instance
gltf_loader.setDRACOLoader(draco_loader);
const rgbe_loader = new RGBELoader(); // Create a RGBELoader instance

export default mixins(BaseComponent).extend({
    name: 'ModelViewer3D',
    components: {
        ThreeRenderer,
        Preloader
    },
    data() {
        return {
            dragging: false,
            download_image_name: 'rendered_frame',
            mouse_mode: -1,
            prev_pointer_position: { x: 0, y: 0 },
            mode: 1,
            grid: true,
            tiling: 2,
            environment: null,
            model: null,
            hdri: null,
            is_loading: false,
            flashlight: null,
            EThreeSceneRenderinMode: EThreeSceneRenderinMode
        };
    },
    computed: {
        is_mobile() {
            return this.$store.state.is_mobile_device;
        },
        rendering_mode_label() {
            return EThreeSceneRenderinMode[this.rendering_mode].toLocaleLowerCase()
        }
    },
    props: {
        model_src: {
            type: String,
            default: null,
        },
        hdri_src: {
            type: String,
            default: 'assets/hdri/studio.hdr',
        },
        show_background: {
            type: Boolean,
            default: false,
        },
        show_helpers: {
            type: Boolean,
            default: false,
        },
        orbit_controls: {
            type: Boolean,
            default: true,
        },
        orbit_controls_autorotate: {
            type: Boolean,
            default: false,
        },
        orbit_controls_autorotate_speed: {
            type: Number,
            default: 0.5,
        },
        orbit_controls_pan: {
            type: Boolean,
            default: false,
        },
        orbit_controls_zoom: {
            type: Boolean,
            default: true,
        },
        orbit_controls_rotate: {
            type: Boolean,
            default: true,
        },
        reset_camera_on_space: {
            type: Boolean,
            default: true,
        },
        default_camera_distance: {
            type: Number,
            default: 1,
        },
        camera_fov: {
            type: Number,
            default: 60,
        },
        show_flashlight: {
            type: Boolean,
            default: true,
        },
        model_orientation: {
            type: Number,
            default: 0,
        },
        info: {
            type: String,
            default: null
        },
        rendering_mode: {
            type: Number,
            default: EThreeSceneRenderinMode.Default,
        },

    },
    mounted() {
        debounce(this.set_loading.bind(this), 500);
        this.init()
        document.addEventListener('keydown', this.handle_keydown);

        console.log(this.info, this.model_src)

        if (this.orbit_controls) {

            this.$refs.three_renderer.controls.maxDistance = 3
            this.$refs.three_renderer.controls.maxPolarAngle = Math.PI

            this.$refs.three_renderer.controls.enableDamping = true;
            this.$refs.three_renderer.controls.dampingFactor = 0.05;
            this.$refs.three_renderer.controls.rotateSpeed = 0.75;
            this.$refs.three_renderer.controls.zoomSpeed = 0.75;
            this.$refs.three_renderer.controls.panSpeed = 0.75;


            this.$refs.three_renderer.controls.enableZoom = this.orbit_controls_zoom;
            this.$refs.three_renderer.controls.enableRotate = this.orbit_controls_rotate;
            this.$refs.three_renderer.controls.enablePan = this.orbit_controls_pan;

            if (this.orbit_controls_autorotate) {
                this.$refs.three_renderer.controls.autoRotate = true;
                this.$refs.three_renderer.controls.autoRotateSpeed = this.orbit_controls_autorotate_speed;
                this.$refs.three_renderer.controls.enableZoom = false;
                this.$refs.three_renderer.controls.enableRotate = false;
                this.$refs.three_renderer.controls.enablePan = false;
            }

        }


        // this.$refs.three_renderer.scene.background = new THREE.Color(0x000000);
    },
    beforeDestroy() {
        this.clear_scene()
        document.removeEventListener('keydown', this.handle_keydown);
    },
    watch: {
        show_flashlight() {
            this.flashlight.visible = this.show_flashlight
        },
        show_background(new_val, old_val) {
            console.log(new_val, this.hdri)
            this.$refs.three_renderer.scene.background = new_val ? this.hdri : null;
        },
    },
    methods: {
        async init() {
            if (this.hdri_src) {
                this.set_hdri(await this.load_hdri_file(this.hdri_src))
            }
            if (this.model_src) {
                this.set_model(await this.load_gltf_file(this.model_src))
            }

            let flashlight = this.flashlight = new THREE.PointLight(0xffffff, 0.5)
            flashlight.visible = this.show_flashlight
            this.$refs.three_renderer.camera.add(flashlight);
        },
        set_loading(is_loading) {
            this.is_loading = is_loading

        },
        open_file() {
            // Trigger the file input click event
            this.$refs.fileInput.click();
        },
        // New method to handle dropped files
        async handle_drop(event) {
            event.preventDefault();
            this.dragging = false;
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0]; // Assuming you only handle one file
                console.log(`File dropped: ${file.name}`)
                this.info = null
                await this.load_file(file)
            }
        },
        fit_camera_to_model() {
            let bounding_box = new THREE.Box3().setFromObject(this.model);
            let center = bounding_box.getCenter(new THREE.Vector3());
            let size = bounding_box.getSize(new THREE.Vector3());
            let max_dim = Math.max(size.x, size.y, size.z);

            let scale = 1 / max_dim;
            this.model.position.set(
                -center.x * scale,
                -center.y * scale,
                -center.z * scale
            );

            this.model.rotation.y = Math.PI / 3 + (this.model_orientation * Math.PI / 180);
            this.model.scale.setScalar(scale);
            this.reset_camera()
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
        handle_file_upload(event) {
            console.log(`File uploaded: ${event.target.files[0].name}`)
            const file = event.target.files[0];
            if (!file) return;

            this.info = null
            this.load_file(file)
        },
        async load_file(file): Promise<any> {
            let extension = get_file_extension(file.name);
            console.log(`File extension: ${extension}`)
            switch (extension) {
                case 'hdr':
                    let hdri = await this.load_hdri_file(URL.createObjectURL(file))
                    this.set_hdri(hdri)
                    break;
                case 'gltf':
                case 'glb':
                    let model = await this.load_gltf_file(URL.createObjectURL(file))
                    this.set_model(model)
                    break;
                default:
                    console.error(`Unsupported file extension: ${extension}`)
            }
        },
        dispose_model() {
            this.model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
            this.$refs.three_renderer.scene.remove(this.model);
            this.model = null
        },
        patch_model(model) {
            model.traverse((object) => {
                if (object.isMesh) {
                    let materials = isArray(object.material) ? object.material : [object.material]
                    materials.forEach((element) => {
                        if (element.transparent) {
                            element.depthWrite = true
                            element.alphaHash = true
                        }
                    });
                }
            })
        },
        set_hdri(hdri) {
            this.hdri = hdri
            this.$refs.three_renderer.scene.environment = hdri;
            if (this.show_background) {
                this.$refs.three_renderer.scene.background = hdri;
            }

        },
        set_model(model) {
            this.$refs.three_renderer.scene.remove(this.model);
            this.model = model
            this.$refs.three_renderer.scene.add(model);
            this.patch_model(this.model)
            this.fit_camera_to_model()

        },
        load_hdri_file(file_src) {
            console.log(`loading hdri: ${file_src}`)

            return new Promise((resolve, reject) => {
                this.set_loading(true);
                // Load a HDR texture
                rgbe_loader.load(
                    file_src,
                    (texture) => {
                        // The HDR texture has loaded
                        // You can now use the texture for renderings
                        texture.mapping = THREE.EquirectangularReflectionMapping;
                        resolve(texture)
                        this.set_loading(false);
                    },
                    undefined,
                    (error) => {
                        // An error occurred
                        console.error('Error loading HDR texture:', error);
                        reject(error)
                        this.set_loading(false);
                    }
                );
            })
        },
        load_gltf_file(file_src) {
            console.log(`File uploaded: ${file_src}`)
            return new Promise((resolve, reject) => {
                this.set_loading(true)
                // Load the GLTF model
                gltf_loader.load(
                    file_src,
                    (gltf) => {
                        // The GLTF model has loaded successfully
                        // You can add the loaded model to your Three.js scene here
                        const model = gltf.scene;
                        // Add the model to your scene
                        resolve(model)
                        this.set_loading(false)
                    },
                    undefined,
                    (error) => {
                        // Handle loading errors here
                        console.error('Error loading GLTF file:', error);
                        reject(error)
                        this.set_loading(false)
                    }
                );
            })
        },
        clear_scene() {
            this.dispose_model(this.model)
            this.model = null
            this.$refs.three_renderer.scene.environment = null;
            this.$refs.three_renderer.scene.background = null;
        },
        reset_camera() {
            this.$refs.three_renderer.set_camera_position(new THREE.Vector3(this.default_camera_distance, this.default_camera_distance / 2, this.default_camera_distance));
            this.$refs.three_renderer.set_camera_target(new THREE.Vector3(0, 0, 0));
        },
        handle_keydown(event) {
            /** reset camera on space keydown */
            if (this.reset_camera_on_space && event.keyCode === 32) {
                this.reset_camera()
            }
        },
        toggle_rendering_mode() {
            let modes_count = Object.keys(EThreeSceneRenderinMode).length / 2;
            this.rendering_mode = (this.rendering_mode + 1) % modes_count

        }
    }
});
</script>
<style lang="less">
@import url('@/assets/index.less');

.model-viewer-3d {
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
        pointer-events: none;

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
            border: 2px dotted @color-text;
        }

        &.dragging {
            &:after {
                opacity: 0.4;
                transition: all 0.2s ease-in-out;
            }
        }

        p {
            font-size:  @font-size-l;
            color: white;
            z-index: 1;
        }
    }

    .loader-container {
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        background-color: @color-background;
    }

    .renderer_container {
        width: 100%;
        height: 100%;

        .controls {
            .separator {
                height: 16px;
                border-bottom: 4px solid @color-text;
            }

            .button {
                box-sizing: border-box;

                &.open-file {
                    font-size:  @font-size-l;
                }

                &.toggle-grid,
                &.toggle-tiling {
                    &.active {
                        color: @color-accent;
                    }
                }

                &.mode {
                    color: #555;

                    &.active {
                        color: @color-text;
                    }
                }

                &.active {
                    color: @color-accent;
                }

                &.disabled {
                    color: #818181;
                    pointer-events: none;
                }

                &[data-rendering-mode="default"] {
                    color: @color-text;
                }

                &[data-rendering-mode="normal"],
                &[data-rendering-mode="normal2"] {
                    color: magenta;
                }

                &[data-rendering-mode="wireframe"] {
                    color: cyan;
                }

                &[data-rendering-mode="basic"],
                &[data-rendering-mode="lambert"] {
                    color: yellow;
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
            font-size:  @font-size-s;

            width: auto;
            display: table;
            background-color: #00000040;

            &.instructions {
                display: inline;
                color: #d7d7d7;
                opacity: 0;

                span {
                    color: @color-text;
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

    .model-info {
        position: absolute;
        bottom: 16px;
        right: 16px;
        text-align: right;
        background: transparent;
        padding: 0;
        opacity: 0.25;
        pointer-events: all;
        z-index: 1;
        line-height: @line-height-default;
        font-size:  @font-size-s;

        p,
        h1,
        h2,
        h3 {
            margin: 0em;
        }

        &:hover {
            opacity: 1;
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

@media screen and (max-width: 600px) {
    .model-viewer-3d .model-info {
        bottom: auto;
        right: auto;
        top: 16px;
        left: 16px;
        text-align: left;
        opacity: 0.5;
    }
}
</style>