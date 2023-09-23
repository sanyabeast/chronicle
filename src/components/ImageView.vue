<template>
    <div class="image-view" @click="$emit('click', $event)">
        <img :class="{ loading: is_loading, fit_width: image_aspect_ratio < 1 }" :src="src" @load="handle_image_load" />
        <Preloader v-if="is_loading" full fill :loader_type="loader_type" />
    </div>
</template>
  
<script lang="ts">

import mixins from 'vue-typed-mixins';
import Preloader, { ELoaderType } from './Preloader.vue';
import BaseComponent from './BaseComponent.vue';
import { debounce } from 'lodash';

export default mixins(BaseComponent).extend({
    name: 'ImageView',
    components: { Preloader },
    data() {
        return {
            is_loading: true,
            image_width: 0,
            image_height: 0,
            image_aspect_ratio: 0
        }
    },
    props: {
        src: {
            type: String,
            required: true
        },
        loader_type: {
            type: String,
            default: ELoaderType.Alternate01
        }
    },
    mounted() {
        debounce(this.set_loading, 1000)
    },
    methods: {
        handle_image_load(event: Event) {
            this.set_loading(false)
            this.image_width = (event.target as HTMLImageElement).naturalWidth
            this.image_height = (event.target as HTMLImageElement).naturalHeight
            this.image_aspect_ratio = this.image_width / this.image_height
        },
        set_loading(enabled: boolean) {
            this.is_loading = enabled
        }
    }
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import url('@/assets/index.less');

.image-view {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;

    img {
        pointer-events: none;
        width: 100%;
        height: auto;

        &.loading {
            opacity: 0;
        }

        &.fit_width {
            height: 100%;
            width: auto;
        }
    }

    .loader-container {
        background-color: @color-background;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

}
</style>
  