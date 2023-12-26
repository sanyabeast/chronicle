<template>
    <div :class="{ mobile: is_mobile }" class="norm-mapa">
        <div class="control-panel">
            <Tweakpane ref="tweakpane"></Tweakpane>
        </div>
        <div class="rendering-area">
            <ShaderView :force_width="renderer_width" :force_height="renderer_height" ref="shader_view"
                shader_id="norm_mapa" :show_controls="false" @ready="update" />
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
            step_scale: 1.5,
            iterations: 2,
            heightmap_contrast: 2,
            heightmap_brightness: 6,
            alpha_level: 0,
            use_radial_kernel: true,
            apply_transformations_to_alpha: false,
            dragging: false,
            invert_heightmap: false,
            invert_alpha: false,
            use_directx_format: false,
            download_image_name: 'rendered_frame',
            prev_pointer_position: { x: 0, y: 0 },
            grid: true,
            texture_offset: new THREE.Vector2(0, 0),
            texture_scale: new THREE.Vector2(1, 1),
            renderer_width: 100,
            renderer_height: 100,
            preview_mode: false,
        };
    },
    computed: {
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
            // tiling mirrored
            this.texture.wrapS = THREE.MirroredRepeatWrapping;
            this.texture.wrapT = THREE.MirroredRepeatWrapping;

            this.renderer_width = texture.image.width;
            this.renderer_height = texture.image.height;
            this.update_route({
                image: texture.image.src
            })

            this.preview_mode = false
            this.update()
        },
        update() {
            if (this.$refs.shader_view && this.$refs.shader_view.material) {
                if (this.texture) {
                    this.$refs.shader_view.material.uniforms.u_map.value = this.texture;
                    this.$refs.shader_view.material.uniforms.u_map.needsUpdate = true;
                }

                this.$refs.shader_view.material.uniforms.u_directx.value = this.use_directx_format ? 1 : 0
                this.$refs.shader_view.material.uniforms.u_scale.value = this.step_scale
                this.$refs.shader_view.material.uniforms.u_invert_height.value = this.invert_heightmap
                this.$refs.shader_view.material.uniforms.u_iterations.value = this.iterations
                this.$refs.shader_view.material.uniforms.u_contrast.value = this.heightmap_contrast
                this.$refs.shader_view.material.uniforms.u_brightness.value = this.heightmap_brightness
                this.$refs.shader_view.material.uniforms.u_preview.value = this.preview_mode ? 1 : 0
                this.$refs.shader_view.material.uniforms.u_alpha_level.value = this.alpha_level
                this.$refs.shader_view.material.uniforms.u_invert_alpha.value = this.invert_alpha
                this.$refs.shader_view.material.uniforms.u_alpha_apply.value = this.apply_transformations_to_alpha
                this.$refs.shader_view.material.uniforms.u_radial_kernel.value = this.use_radial_kernel ? 1 : 0
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
                title: 'Toggle View',
            }).on('click', () => {
                this.preview_mode = !this.preview_mode
                this.update()
            });


            pane.addBlade({
                view: 'separator',
            });

            pane.addBinding(this, 'step_scale', {
                label: 'Step Scale',
                min: 0.01,
                max: 10,
                step: 0.001,
            }).on('change', () => {
                this.update()
            })

            pane.addBinding(this, 'iterations', {
                label: 'Iterations',
                min: 1,
                max: 5,
                step: 1,
            }).on('change', () => {
                this.update()
            })

            pane.addBinding(this, 'use_radial_kernel', {
                label: 'Radial Kernel',
            }).on('change', () => {
                this.update()
            })

            pane.addBlade({
                view: 'separator',
            });

            pane.addBinding(this, 'heightmap_contrast', {
                label: 'Contrast',
                min: 0.01,
                max: 4,
                step: 0.1,
            }).on('change', () => {
                this.update()
            })

            pane.addBinding(this, 'heightmap_brightness', {
                label: 'Brightness',
                min: 0.1,
                max: 32,
                step: 0.1,
            }).on('change', () => {
                this.update()
            })

          
            pane.addBinding(this, 'invert_heightmap', {
                label: 'Invert Heightmap',
            }).on('change', () => {
                this.update()
            })

            let alpha_settings = pane.addFolder({
                title: 'Alpha Control',
                expanded: false,
            });

            alpha_settings.addBinding(this, 'alpha_level', {
                label: 'Alpha Level',
                min: 0,
                max: 1,
                step: 1,
            }).on('change', () => {
                this.update()
            })

            alpha_settings.addBinding(this, 'invert_alpha', {
                label: 'Invert Alpha',
            }).on('change', () => {
                this.update()
            })
            
            alpha_settings.addBinding(this, 'apply_transformations_to_alpha', {
                label: 'Apply Transformations to Alpha',
            }).on('change', () => {
                this.update()
            })



            pane.addBinding(this, 'use_directx_format', {
                label: 'DirectX Format',
            }).on('change', ({ value }) => {
                this.update()
            })

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
                this.preview_mode = false
                this.update()
                setTimeout(() => {
                    this.$refs.shader_view.renderer.save_as_image(this.download_image_name)
                }, 200);
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

.norm-mapa {
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
    .norm-mapa {
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