<template>
    <div class="renderer_container" ref="renderer_container">
        <div class="controls" v-if="show_controls">
            <p class="button" @click="save_as_image">download as image</p>
            <slot></slot>
        </div>
    </div>
</template>
  
<script lang="ts">

import * as THREE from 'three';
import mixins from 'vue-typed-mixins';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import BaseComponent from './BaseComponent.vue';
import { Component } from 'vue';


export interface IThreeRendererProps {
    show_helpers?: boolean;
    orbit_controls?: boolean;
    map_controls?: boolean;
    show_controls?: boolean;
    download_image_name?: string;
}

export interface IThreeRendererData {
    width?: number;
    height?: number;
    raf_id?: number | null;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    controls?: OrbitControls | MapControls | null;
}

export interface IThreeRendererMethods {
    init_three(): void;
    animate(): void;
    save_as_image(): void;
}

export enum EThreeSceneRenderinMode {
    Default,
    Wireframe,
    Normal
}

const scene_rendering_mode_materials = {
    [EThreeSceneRenderinMode.Default]: null,
    [EThreeSceneRenderinMode.Normal]: new THREE.MeshNormalMaterial({ wireframe: false }),
    [EThreeSceneRenderinMode.Wireframe]: new THREE.MeshNormalMaterial({ color: 0xffffff, wireframe: true }),
}

export default mixins(BaseComponent).extend({
    name: 'ThreeRenderer',
    mixins: [BaseComponent],
    data(): IThreeRendererData {
        return {
            width: 100,
            height: 100,
            raf_id: null
        };
    },
    props: {
        camera_fov: {
            type: Number,
            default: 45,
        },
        show_helpers: {
            type: Boolean,
            default: false,
        },
        orbit_controls: {
            type: Boolean,
            default: false,
        },
        map_controls: {
            type: Boolean,
            default: false,
        },
        show_controls: {
            type: Boolean,
            default: true,
        },
        download_image_name: {
            type: String,
            default: 'rendered_frame',
        },
        rendering_mode: {
            type: Number,
            default: EThreeSceneRenderinMode.Default,
        },
        preserve_drawing_buffer: {
            type: Boolean,
            default: true,
        },
        logarithmic_depth_buffer: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        (window as any).t = this;
        this.init_three();
        // Append the Three.js renderer to the container
        this.$refs.renderer_container!.appendChild(this.renderer.domElement);
        this.animate();

    },
    watch: {
        rendering_mode: {
            handler: function (val: EThreeSceneRenderinMode) {
                console.log(val)
                this.set_rendering_mode(val)
            },
            immediate: true
        }
    },
    beforeDestroy() {
        this.renderer.dispose();
        cancelAnimationFrame(this.raf_id);
        // Unmount the renderer when the component is destroyed
        if (this.controls) {
            this.controls.dispose()
        }
        this.$refs.renderer_container!.removeChild(this.renderer.domElement);
    },
    methods: {
        on_render() {
            // override this
        },
        set_camera_position(position: THREE.Vector3) {
            this.camera.position.set(position.x, position.y, position.z)
        },
        set_camera_target(position: THREE.Vector3) {
            if (this.orbit_controls) {
                this.controls.target.set(position.x, position.y, position.z)
            } else {
                this.camera.lookAt(position)
            }
        },
        set_rendering_mode(mode: EThreeSceneRenderinMode) {
            this.set_scene_material_override(scene_rendering_mode_materials[mode])
        },
        set_scene_material_override(material: THREE.Material) {
            console.log(material)
            if (this.scene) {
                this.scene.overrideMaterial = material;
            }
        },
        init_three() {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(this.camera_fov, window.innerWidth / window.innerHeight, 0.01, 10000);
            this.renderer = new THREE.WebGLRenderer({
                antialias: !this.is_mobile,
                preserveDrawingBuffer: this.preserve_drawing_buffer,
                logarithmicDepthBuffer: this.logarithmic_depth_buffer,
            });
            // Set up the camera position
            this.camera.position.set(10, 10, 10)
            this.camera.lookAt(0, 0, 0)
            this.scene.add(this.camera)

            // Append the Three.js renderer to the container
            this.renderer.setSize(this.width, this.height);


            if (this.show_helpers) {
                // Add a grid to the scene
                const grid_helper = new THREE.GridHelper(10, 10);
                this.scene.add(grid_helper);

                const axis_helper = new THREE.AxesHelper(5);
                this.scene.add(axis_helper)
            }

            if (this.orbit_controls) {
                // Add orbit controls;
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.controls.update();
            }


            if (this.map_controls) {
                // Add orbit controls;
                this.controls = new MapControls(this.camera, this.renderer.domElement);
                this.controls.update();
            }

            this.set_scene_material_override(scene_rendering_mode_materials[this.rendering_mode])
        },
        animate() {
            // Animation loop
            const animate = () => {
                this.raf_id = requestAnimationFrame(animate);

                let bounds = this.$refs.renderer_container.getBoundingClientRect();
                let size_changed = false

                if (bounds.width > 0 && bounds.height > 0) {
                    size_changed = bounds.width !== this.width || bounds.height !== this.height
                    this.width = bounds.width;
                    this.height = bounds.height;
                }

                if (size_changed) {
                    this.renderer.setSize(this.width, this.height);
                    this.camera.aspect = this.width / this.height;
                    this.camera.updateProjectionMatrix();
                }

                if (this.controls && this.controls.update) {
                    this.controls.update();
                }

                this.on_render()
                this.renderer.render(this.scene, this.camera);
            };

            animate();
        },
        save_as_image() {
            // Create a data URL representing the rendered frame
            const dataURL = this.renderer.domElement.toDataURL('image/png');

            // Create an anchor element to trigger the download
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = `${this.download_image_name}.png`;

            // Programmatically trigger a click event on the anchor element
            const event = new MouseEvent('click');
            a.dispatchEvent(event);
        },
    },
});
</script>
  
<style scoped>
/* Add any custom styles for your renderer container if needed */
.renderer_container {
    /* Example styles */
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .controls {
        position: absolute;
        bottom: 16px;
        left: 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        pointer-events: all;

        .button {
            cursor: cell;
            z-index: 100;
            display: flex;
            background-color: #000;
            margin: 1px 0;

            &:hover {
                color: #ff0000;
            }
        }
    }
}
</style>