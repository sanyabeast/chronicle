<template>
    <div class="renderer_container" ref="renderer_container">
        <div class="controls" v-if="show_controls">
            <p class="button" @click="saveAsImage">download as image</p>
            <slot></slot>
        </div>
    </div>
</template>
  
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'

let renderer0 = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
});

let renderer1 = new THREE.WebGLRenderer({
    antialias: false,
    preserveDrawingBuffer: false,
});

export default {
    name: 'ThreeRenderer',
    data() {
        return {
            width: 100,
            height: 100,
            raf_id: null
            // scene: new THREE.Scene(),
            // camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
            // renderer: new THREE.WebGLRenderer(),
        };
    },
    props: {
        helpers: {
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
    },
    mounted() {
        this.init_three();
        this.animate();
    },
    beforeDestroy() {
        cancelAnimationFrame(this.raf_id);
        // Unmount the renderer when the component is destroyed
        if (this.controls) {
            this.controls.dispose()
        }
        this.$refs.renderer_container.removeChild(this.renderer.domElement);
    },
    methods: {
        init_three() {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
            this.renderer = renderer0;
            // Set up the camera position
            this.camera.position.set(10, 10, 10)
            this.camera.lookAt(0, 0, 0)

            // Append the Three.js renderer to the container
            this.renderer.setSize(this.width, this.height);
            this.$refs.renderer_container.appendChild(this.renderer.domElement);

            // Add some basic lighting
            const ambient_light = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(ambient_light);

            const directional_light = new THREE.DirectionalLight(0xffffff, 0.5);
            directional_light.position.set(0, 1, 0);
            this.scene.add(directional_light);

            if (this.helpers) {
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

                this.renderer.render(this.scene, this.camera);
            };

            animate();
        },
        saveAsImage() {
            // Create a data URL representing the rendered frame
            const dataURL = this.renderer.domElement.toDataURL('image/png');

            // Create an anchor element to trigger the download
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = 'rendered_image.png';

            // Programmatically trigger a click event on the anchor element
            const event = new MouseEvent('click');
            a.dispatchEvent(event);
        },
    },
};
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