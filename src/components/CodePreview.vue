<template>
    <div class="code-preview" :class="{ popup: popup, closing: closing }" @click.self="$emit('close')" :title="language"
        @mouseover.self="closing = true" @mouseout.self="closing = false">
        <!-- If your source-code lives in a variable called 'sourcecode' -->
        <div class="content">
            <div class="popup-controls" v-if="popup">
                <button class="download" @click="download_as_file(file_name, text_content)">download</button>
                <button class="copy" @click="copy_to_clipboard(text_content); show_copied_tooltip()"
                    :class="{ copied_tooltip: copied_tooltip }">copy</button>
                <button class="close" :class="{ closing: closing }" @click="$emit('close')" @mouseover.self="closing = true"
                    @mouseout.self="closing = false">close</button>
            </div>
            <pre v-highlightjs="text_content"><code :class="language"></code></pre>
        </div>
    </div>
</template>
  
<script lang="ts">

import mixins from 'vue-typed-mixins';
import BaseComponent from './BaseComponent.vue';
import { isString } from 'lodash';
import { read_text_file } from '@/tools';


export default mixins(BaseComponent).extend({
    name: 'CodePreview',
    data() {
        return {
            copied_tooltip: false,
            closing: false,
            text_content: "",
            file_name: "unknown",
            language: "json"
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
        file: {
            type: String,
            default: null
        },
        popup: {
            type: Boolean,
            default: false
        },
        download_name: {
            type: String,
            default: ""
        }
    },
    mounted() {
        this.update()
    },
    watch: {
        code() {
            this.update()
        },
        file() {
            this.update()
        }
    },
    methods: {
        async update() {
            if (this.file) {
                this.text_content = await read_text_file(this.file);
                this.file_name = this.download_name.length ? this.download_name : this.file.split("/").pop();
                this.language = this.detect_laguage(this.file);
                console.log("update", this.file, this.text_content)
            } else {
                if (isString(this.code)) {
                    this.text_content = this.code;
                    this.language = "text"
                } else {
                    this.text_content = JSON.stringify(this.code, null, 4);
                    this.language = "json"
                }

                this.file_name = this.download_name;
            }
        },
        show_copied_tooltip() {
            this.copied_tooltip = true;
            setTimeout(() => {
                this.copied_tooltip = false;
            }, 1000);
        },
        download_as_file(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        },
        detect_laguage(filename: String): String {
            if (filename.endsWith(".js")) {
                return "javascript"
            }

            if (filename.endsWith(".py")) {
                return "python"
            }

            if (filename.endsWith(".ts")) {
                return "typescript"
            }

            if (filename.endsWith(".json")) {
                return "json"
            }

            if (filename.endsWith(".html")) {
                return "html"
            }

            if (filename.endsWith(".css")) {
                return "css"
            }

            if (filename.endsWith(".md")) {
                return "markdown"
            }

            if (filename.endsWith(".gd")) {
                return "gdscript"
            }

            return "json"
        },
    }
});
</script>
<style lang="less">
@import url('@/assets/index.less');
@import url('@/assets/base16-macintosh.css');

.code-preview {
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
        z-index: 999;
        padding: 8px 0;
        backdrop-filter: contrast(0.5) brightness(0.5) saturate(0);

        .content {
            width: 100%;
            max-width: 1024px;
            height: 100%;
            position: relative;
            border: 2px solid #454544;
            user-select: text;
            overflow: hidden;

            pre {
                margin: 0;
                height: 100%;
                overflow: auto;
                padding: 1rem;
                font-size:  @font-size-s;
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
                    font-size:  @font-size-m;
                    padding: 0 8px 4px;
                    cursor: pointer;
                    border: 2px solid #8f8f8f;
                    margin-left: 8px;
                    font-family: 'bescii', sans-serif;

                    &:hover {
                        color: @color-accent;
                        border-color: @color-accent;
                    }

                    &.close {
                        border-right: none;
                        border-top: none;

                        &.closing {
                            color: @color-accent;
                            border-color: @color-accent;
                        }
                    }

                    &.copy {
                        @button-color: rgb(0, 174, 255);

                        border-top: none;
                        position: relative;

                        &:hover {
                            color: @button-color;
                            border-color: @button-color;
                        }

                        &.copied_tooltip {

                            border-color: @button-color;
                            color: @button-color;

                            &:before {
                                content: "copied";
                                position: absolute;
                                text-align: center;
                                bottom: -24px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: #000000;
                                color: @button-color;
                                padding: 4px;
                                font-size:  @font-size-s;
                                font-family: @font-family-monospace;
                                z-index: 1;
                            }
                        }
                    }

                    &.download {
                        @button-color: rgb(255, 123, 0);

                        border-top: none;
                        position: relative;

                        &:hover {
                            color: @button-color;
                            border-color: @button-color;
                        }
                    }
                }
            }
        }

        &.closing {
            .content {}
        }
    }
}

@media screen and (max-width: 600px) {

    .maze-generator {
        .code-preview {

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
  