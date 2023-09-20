<template>
    <div class="text-view">
        <slot></slot>
        <p v-for="(item, index) in paragraphs" :key="index" v-html="item"></p>
        <Preloader v-if="is_loading" full fill :loader_type="loader_type" />
    </div>
</template>
  
<script lang="ts">

import Vue from 'vue';
import mixins from 'vue-typed-mixins';
import Preloader, { ELoaderType } from './Preloader.vue';
import BaseComponent from './BaseComponent.vue';
import { debounce } from 'lodash';
import { read_text_file } from '@/tools';

export default mixins(BaseComponent).extend({
    name: 'ImageView',
    components: { Preloader },
    data() {
        return {
            is_loading: false,
            text_content: "",
            paragraphs: []
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
            default: ELoaderType.Coffee
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
                this.text_content = await read_text_file(this.src)
                this.set_loading(false)
            } else if (this.text) {
                this.text_content = this.text
            }

            this.update_paragraphs()
        },
        update_paragraphs() {
            this.paragraphs = this.text_content.split("\n").filter((item) => item.trim().length > 0)

        },
        filter_non_empty_paragraphs() {
            this.paragraphs = this.paragraphs.filter((item) => item.length > 0)
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
    overflow: hidden;
    position: relative;
    line-height: 2em;

    p {
        margin: 0;
    }
}
</style>
  