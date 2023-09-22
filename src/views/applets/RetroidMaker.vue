<template>
    <div class="retroid-maker">
        <ShaderView :force_width="renderer_width" :force_height="renderer_height" ref="shader_view"
            shader_id="retroid_maker" />
        <DragAndDropManager :mime="EMimeTypes.Image" :on_file="_handle_file_upload" />
    </div>
</template>
<script lang="ts">
import DragAndDropManager, { EMimeTypes } from '@/components/DragAndDropManager.vue';
import { load_texture } from '@/tools';
import Vue from 'vue';


export default Vue.extend({
    name: "RetroidMaker",
    components: { DragAndDropManager },
    computed: {},
    props: {},
    data() {
        return {
            EMimeTypes,
            renderer_width: 0,
            renderer_height: 0,
        }
    },
    mounted() { },
    beforeMount() { },
    methods: {
        async _handle_file_upload(file: File) {
            let url = URL.createObjectURL(file);
            let texture = await load_texture(url);

            this.$refs.shader_view.material.uniforms.u_map.value = texture;
            this.$refs.shader_view.material.uniforms.u_map.needsUpdate = true;

            this.renderer_width = texture.image.width;
            this.renderer_height = texture.image.height;

            console.log("material", this.$refs.shader_view.material);

            console.log("file", file, texture);
        }
    },



})
</script>
<style lang="less">
@import url('@/assets/index.less');

.retroid-maker {
    color: @color-accent;

    .shader-view {
        width: 100%;
        height: 100%;
    }
}
</style>