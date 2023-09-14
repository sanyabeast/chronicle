<template>
    <div class="web-frame">
        <iframe v-if="url != undefined" :src="web_url" @load="handle_iframe_loaded" />
        <Preloader v-if="!iframe_loaded" full fill :loader_type="loader_type" />
    </div>
</template>
  
<script lang="ts">

import Preloader, { ELoaderType } from '@/components/Preloader.vue';
import BaseComponent from '@/components/BaseComponent.vue';
import mixins from 'vue-typed-mixins';
import { urls } from '@/router';

export default mixins(BaseComponent).extend({
    name: "WebFrame",
    components: {
        Preloader
    },
    mounted() {

    },
    beforeMount() {

    },
    methods: {
        handle_iframe_loaded() {
            setTimeout(() => {
                this.iframe_loaded = true
            }, 250)
        }
    },
    computed: {
        web_url() {
            return urls[this.url]
        }
    },
    props: {
        url: String
    },
    data() {
        return {
            iframe_loaded: false,
            loading_word_chars: "loading...".split(""),
            loader_type: ELoaderType.Alternate01
        }
    }
})
</script>
<style lang="less">
.view.web-frame {
    padding: 0;
    overflow: hidden;
    position: relative;

    iframe {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
    }

    .loader-container {
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        background-color: #000;
    }

}
</style>