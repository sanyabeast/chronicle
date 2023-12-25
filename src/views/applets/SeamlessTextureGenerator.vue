<template>
    <div :class="{ mobile: is_mobile }" class="seamless-texture-generator">
        <div class="control-panel">
            <Tweakpane ref="tweakpane"></Tweakpane>
        </div>
        <div class="rendering-area">
            <ShaderView :force_width="renderer_width" :force_height="renderer_height" ref="shader_view"
                shader_id="seamless_texture_gen" :show_controls="false" @ready="update" />
            <DragAndDropManager :mime="EMimeTypes.Image" :on_file="_handle_file_upload" />
            <input type="file" accept="image/*" @change="handle_open_file" style="display: none" ref="fileInput" />
        </div>
    </div>
    <!-- Other components and UI elements -->
</div></template>
  
<script>

import * as THREE from 'three';
import mixins from 'vue-typed-mixins'
import ThreeRenderer from '../../components/ThreeRenderer.vue';
import Tweakpane from '@/components/Tweakpane.vue';
import DragAndDropManager, { EMimeTypes } from '@/components/DragAndDropManager.vue';
import BaseComponent from '@/components/BaseComponent.vue';
import { load_texture, read_text_file, create_shader_material } from '@/tools';
import { shaders } from '@/router/index'

const samples = [
    'assets/image/planet.png',
    'assets/image/moon.png',
    'assets/image/clock.png',
    'assets/image/pattern.png',
]

export default mixins(BaseComponent).extend({
    name: 'NormMapa',
    components: {
        ThreeRenderer,
        Tweakpane,
        DragAndDropManager
    },
    data() {
        return {
            EMimeTypes,
            dragging: false,
            offset: new THREE.Vector2(0, 0),
            contrast: new THREE.Vector2(3, 3),
            rotation: 0,
            crop: 0.8,
            download_image_name: 'rendered_frame',
            prev_pointer_position: { x: 0, y: 0 },
            grid: true,
            texture_offset: new THREE.Vector2(0, 0),
            texture_scale: new THREE.Vector2(1, 1),
            tiling: 1,
            renderer_width: 100,
            renderer_height: 100,
            preview_mode: false
        };
    },
    computed: {
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
        },
        image_size_formatted() {
            return `${this.renderer_width}x${this.renderer_height}`
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
        this.setup_tweakpane()
    },
    beforeDestroy() {

    },
    methods: {
        async init() {
            var image = this.image

            if (image === 'sample') {
                await this.load_texture("assets/image/moon_heightmap.png")
            } else {
                await this.load_texture(image)
            }

        },
        set_texture(texture) {
            this.texture = texture;
            // tiling
            this.texture.wrapS = THREE.RepeatWrapping;
            this.texture.wrapT = THREE.RepeatWrapping;


            this.renderer_width = texture.image.width;
            this.renderer_height = texture.image.height;
            this.update_route({
                image: texture.image.src
            })
            this.update()
        },
        update() {
            if (this.$refs.shader_view && this.$refs.shader_view.material) {
                if (this.texture) {
                    this.$refs.shader_view.material.uniforms.u_map.value = this.texture;
                    this.$refs.shader_view.material.uniforms.u_map.needsUpdate = true;
                }

                this.$refs.shader_view.material.uniforms.u_contrast.value = this.contrast
                this.$refs.shader_view.material.uniforms.u_contrast.needsUpdate = true;

                this.$refs.shader_view.material.uniforms.u_viewscale.value = this.preview_mode ? 3 : 1
                this.$refs.shader_view.material.uniforms.u_rotation.value = this.rotation
                this.$refs.shader_view.material.uniforms.u_crop.value = this.crop
            }
        },
        async load_texture(src) {
            return new Promise((resolve, reject) => {
                this.download_image_name = this.get_file_name(src)
                let loader = new THREE.TextureLoader();
                loader.load(src, (texture) => {
                    console.log("Loaded texture", texture);
                    this.set_texture(texture)
                    resolve(texture);
                });
            })
        },
        open_file() {
            this.$refs.fileInput.click();
        },
        async _handle_file_upload(file) {
            this.download_image_name = this.get_file_name(file.name)
            let url = URL.createObjectURL(file);
            let texture = await load_texture(url);

            this.set_texture(texture)
        },
        async handle_open_file(event) {
            const file = event.target.files[0];
            this._handle_file_upload(file);
        },
        remove_extension(filename) {
            return filename.replace(/\.[^/.]+$/, "");
        },
        get_file_name(path) {
            return this.remove_extension(path.split('\\').pop().split('/').pop());
        },
        setup_tweakpane() {
            let pane = this.$refs.tweakpane.pane;

            pane.addButton({
                title: 'Preview',
            }).on('click', () => {
                this.preview_mode = !this.preview_mode
                this.update()
            });

            pane.addBlade({
                view: 'separator',
            });

            pane.addBinding(this.contrast, 'x', {
                label: 'Contrast X',
                min: 0.05,
                max: 32,
                step: 0.05,
            }).on('change', () => {
                this.update()
            })

            pane.addBinding(this.contrast, 'y', {
                label: 'Contrast Y',
                min: 0.05,
                max: 32,
                step: 0.05,
            }).on('change', () => {
                this.update()
            })

            // pane.addBinding(this, 'crop', {
            //     label: 'Crop',
            //     min: 0.01,
            //     max: 1,
            //     step: 0.01,
            // }).on('change', () => {
            //     this.update()
            // })

            pane.addBlade({
                view: 'separator',
            });


            pane.addButton({
                title: 'Open File',
            }).on('click', () => {
                this.open_file()
            });

            pane.addBlade({
                view: 'separator',
            });

            pane.addButton({
                title: 'Download as Image',
            }).on('click', () => {
                this.$refs.shader_view.renderer.save_as_image(this.download_image_name)
            });

            pane.addBinding(this, 'download_image_name', {
                label: '',
                readonly: true,
            });

            pane.addBlade({
                view: 'separator',
            });

            pane.addBinding(this, 'image_size_formatted', {
                label: 'Image Size',
                readonly: true,
            });

        },
    },
});
</script>
<style lang="less">
@import url('@/assets/index.less');

.seamless-texture-generator {
    padding: 0;
    display: grid;
    grid-template-columns: 240px 1fr;
    grid-template-rows: 1fr;
    overflow: hidden;

    .control-panel {
        padding: 8px;
    }

    .rendering-area {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 8px;

        .shader-view {
            width: 100%;
            height: 100%;
        }
    }

    &.mobile {}
}

@media screen and (max-width: 600px) {
    .seamless-texture-generator {
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr;
        height: 100%;

        .control-panel {
            grid-row: 2;
            overflow: auto;
        }
    }
}
</style>