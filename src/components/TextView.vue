<template>
    <div class="text-view">
        <p v-html="text_content"></p>
        <Preloader v-if="is_loading" full fill :loader_type="loader_type" />
    </div>
</template>
  
<script lang="ts">

import Vue from 'vue';
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
            text_content: ""
        }
    },
    props: {
        src: {
            type: String
        },
        text: {
            type: String
        },
        loader_type: {
            type: String,
            default: ELoaderType.DefaultInner
        }
    },
    mounted() {
        debounce(this.set_loading, 1000)
        this.init()
    },
    methods: {
        async init() {
            if (this.src) {
                this.set_loading(true)
                this.text_content = await this.load_text(this.src)
                console.log(this.text_content   )
                this.set_loading(false)
            } else if (this.text) {
                this.text_content = this.text
            }
        },
        set_loading(enabled: boolean) {
            this.is_loading = enabled
        }
    }
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.text-view {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    position: relative;

}
</style>
  