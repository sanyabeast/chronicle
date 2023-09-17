<template>
    <div :class="{ mobile: is_mobile }" class="shader-view" @mousemove="handle_mousemove">
        <ThreeRenderer ref="three_renderer" :download_image_name="download_image_name">
        </ThreeRenderer>
    </div>
    <!-- Other components and UI elements -->
</div></template>
  
<script >

import * as THREE from 'three';
import mixins from 'vue-typed-mixins'
import ThreeRenderer from '../../components/ThreeRenderer.vue';
import BaseComponent from '@/components/BaseComponent.vue';
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
    computed: {},
    props: {
        shader_id: {
            type: String,
            default: 'sample'
        },
    },
    mounted() {
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
            let plane_geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            let plane_material = await create_shader_material(shaders[this.shader_id]);

            let plane = this.plane = new THREE.Mesh(plane_geometry, plane_material);
            this.$refs.three_renderer.scene.add(plane);
            this.$refs.three_renderer.on_render = this.on_render
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
                border-bottom: 1px solid @color-text;
            }

            .button {
                box-sizing: border-box;

                &.open-file {
                    font-size: 24px;
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