<template>
    <div class="view web-frame">
        <div v-if="!iframe_loaded" class="loader">
            <p>
                <span v-for="item, index in loading_word_chars" :key="index" :style="{ animationDuration: `${index % 4}s` }"
                    v-html="item"></span>
            </p>
        </div>
        <iframe v-if="url != undefined" :src="url" @load="handle_iframe_loaded" />
    </div>
</template>
  
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: "WebFrame",
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
    computed: {},
    props: {
        url: String
    },
    components: {},
    data() {
        return {
            iframe_loaded: false,
            loading_word_chars: "loading...".split("")
        }
    }
})
</script>
<style lang="less">
.view.web-frame {
    padding: 0;
    overflow: hidden;
    position: relative;

    @keyframes letter-animation {
        25% {
            color: #ff0;
        }

        50% {
            color: #0ff;
        }

        75% {
            color: #f0f;
        }

        0%,
        100% {
            color: #fff;
        }
    }

    .loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: black;
        display: flex;
        align-items: center;
        justify-content: center;

        p {
            font-size: 18px;

            span {
                display: inline-block;
                animation: letter-animation 1s steps(5) infinite;
            }
        }
    }

    iframe {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
    }
}
</style>