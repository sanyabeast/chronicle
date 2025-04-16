<template>
    <div :class="{ mobile: is_mobile }" class="shader-view" @mousemove="handle_mousemove">
        <ThreeRenderer :force_width="force_width" :force_height="force_height" ref="three_renderer"
            :download_image_name="download_image_name" :show_controls="show_controls">
        </ThreeRenderer>
    </div>
    <!-- Other components and UI elements -->
</div></template>
  
<script >

import * as THREE from 'three';
import mixins from 'vue-typed-mixins'
import BaseComponent from '@/components/BaseComponent.vue';
import ThreeRenderer from '../../components/ThreeRenderer.vue';

import read_text_file from '@/tools';
import load_texture from '@/tools';
import { create_shader_material } from '@/tools';
import { shaders } from '@/router/index'

export default mixins(BaseComponent).extend({
    name: 'ShaderView',
    components: {
        ThreeRenderer,
    },
    data() {
        return {
            download_image_name: 'rende@color-accent_frame',
            mouse_pos: {
                x: 0,
                y: 0
            },
        };
    },
    computed: {
        renderer(){
            return this.$refs.three_renderer
        }
    },
    props: {
        shader_id: {
            type: String,
            default: 'sample'
        },
        force_width: {
            type: Number,
            default: 0,
        },
        force_height: {
            type: Number,
            default: 0,
        },
        show_controls: {
            type: Boolean,
            default: true,
        },
    },
    mounted() {
        console.log("ShaderView inited, using shader", this.shader_id);
        this.init()

    },
    methods: {
        on_render(delta) {
            this.plane.material.uniforms.u_time.value += 1.0 * delta;
            this.plane.material.uniforms.u_resolution.value.x = this.$refs.three_renderer.width;
            this.plane.material.uniforms.u_resolution.value.y = this.$refs.three_renderer.height;
            this.plane.material.uniforms.u_mouse.value.x = this.mouse_pos.x;
            this.plane.material.uniforms.u_mouse.value.y = this.mouse_pos.y;
        },
        async init() {
            if (!shaders[this.shader_id]) {
                throw new Error(`Shader ${this.shader_id} not found`)
            }

            let geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            let material = this.material = await create_shader_material(shaders[this.shader_id], {
                u_time: 0,
                u_resolution: [0, 0],
                u_mouse: [0, 0],
            });

            let plane = this.plane = new THREE.Mesh(geometry, material);
            this.$refs.three_renderer.scene.add(plane);
            this.$refs.three_renderer.on_render = this.on_render

            this.$emit('ready', this)
        },
        handle_mousemove(event) {
            this.mouse_pos.x = event.clientX / this.$refs.three_renderer.width;
            this.mouse_pos.y = event.clientY / this.$refs.three_renderer.height;
        }
    },
});
</script>
<style lang="less">
@import url('@/assets/index.less');

.shader-view {
    padding: 0;

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
            }
        }
    }
}
</style>