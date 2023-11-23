<template>
    <div class="syntax" :class="{ popup: popup }" @click.self="$emit('close')">
        <!-- If your source-code lives in a variable called 'sourcecode' -->
        <div class="content">
            <div class="popup-controls" v-if="popup">
                <button class="copy" @click="copy_to_clipboard(sourcecode); show_copied_tooltip()"
                    :class="{ copied_tooltip: copied_tooltip }">copy</button>
                <button class="close" @click="$emit('close')">close</button>
            </div>
            <pre v-highlightjs="sourcecode"><code class="javascript"></code></pre>
        </div>
    </div>
</template>
  
<script lang="ts">

import mixins from 'vue-typed-mixins';
import BaseComponent from './BaseComponent.vue';
import { isString } from 'lodash';


export default mixins(BaseComponent).extend({
    name: 'AsciiGif',
    data() {
        return {
            copied_tooltip: false,
        }
    },
    computed: {
        sourcecode(): string {
            if (isString(this.code)) {
                return this.code;
            } else {
                return JSON.stringify(this.code, null, 4);
            }
        }
    },
    props: {
        code: {
            type: [String, Object],
            required: true,
            default() {
                return `const example = "Hello, PrismJS!";`
            }
        },
        popup: {
            type: Boolean,
            default: false
        }
    },
    mounted() { },
    methods: {
        show_copied_tooltip() {
            this.copied_tooltip = true;
            setTimeout(() => {
                this.copied_tooltip = false;
            }, 1000);
        }
    }
});
</script>
<style lang="less">
@import url('@/assets/index.less');
@import url('@/assets/base16-macintosh.css');

.syntax {
    font-family: @font-family-monospace;

    &.popup {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(131, 131, 131, 0.32);
        z-index: 999;
        padding: 8px 0;

        .content {
            width: 100%;
            max-width: 1024px;
            height: 100%;
            position: relative;
            border: 2px solid #454544;
            user-select: text;
            border-radius: 32px;
            overflow: hidden;

            pre {
                margin: 0;
                height: 100%;
                overflow: auto;
                padding: 1rem;
                font-size: 12px;
                line-height: 1.5em;
                font-family: @font-family-monospace;
                background: #000000;
                color: white;
                border: none;
                border-radius: 0;
                box-shadow: none;

                * {
                    user-select: text;
                }

            }



            .popup-controls {
                position: absolute;
                top: 0;
                right: 0;
                padding: 4px;

                button {
                    background: #090909;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    user-select: none;
                    color: #d6d6d6;
                    font-size: 1rem;
                    padding: 0 8px 4px;
                    cursor: pointer;
                    border: 2px solid #8f8f8f;
                    margin-left: 8px;
                    font-family: 'IBM Plex Mono', sans-serif;
                    border-radius: 8px;
                    font-weight: bold;

                    &:hover {
                        color: rgb(255, 0, 0);
                        border-color: red;
                    }

                    &.close {
                        border-right: none;
                        border-top: none;
                        border-top-right-radius: 0%;
                        border-top-left-radius: 0%;
                        border-bottom-right-radius: 0%;
                    }

                    &.copy {
                        border-top: none;
                        position: relative;
                        border-top-left-radius: 0%;
                        border-top-right-radius: 0%;

                        &.copied_tooltip {
                            border-color: red;
                            color: red;

                            &:before {
                                content: "copied";
                                position: absolute;
                                text-align: center;
                                bottom: -24px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: #000000;
                                color: #ff0000;
                                padding: 4px;
                                border-radius: 4px;
                                font-size: 10px;
                                font-family: @font-family-monospace;
                                z-index: 1;
                            }
                        }
                    }
                }
            }
        }
    }
}

@media screen and (max-width: 600px) {

    .maze-generator {
        .syntax {

            &.popup {
                background: rgb(45, 45, 45);
                padding: 0;
                .content {
                    width: 100%;
                    height: 100%;
                    border-radius: 0;
                    border: none;
                }
            }
        }

    }
}
</style>
  