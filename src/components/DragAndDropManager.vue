<template>
    <div class="drag-and-drop-manager" @dragenter.prevent="_handle_dragenter" @dragover.prevent="_handle_dragover"
        @drop.prevent="_handle_drop">
        <p class="drag-and-drop-tooltop" v-if="show_tooltip">{{ message }}</p>
        <div class="drop-target" v-if="!is_mobile" :class="{ dragging: dragging }">
            <p v-if="dragging">{{ message }}</p>
        </div>

        <!-- Add file input for drag and drop -->
        <input type="file" :accept="mime" @change="_handle_file_input_change" style="display: none" ref="fileInput" />
    </div>
</template>
  
<script lang="ts">

import mixins from 'vue-typed-mixins';
import BaseComponent from './BaseComponent.vue';

export enum EMimeTypes {
    Image = "image/*",
    Video = "video/*",
    Audio = "audio/*",
    Text = "text/*",
    Application = "application/*",
    GltfGlb = "model/gltf-binary",
    Any = "*/*",
}

export default mixins(BaseComponent).extend({
    name: 'DragAndDropManager',
    data() {
        return {
            dragging: false,
        }
    },
    props: {
        mime: {
            type: String,
            default: EMimeTypes.Any
        },
        message: {
            type: String,
            default: "Drag and drop an files here"
        },
        on_file: Function,
        on_files: Function,
        show_tooltip: {
            type: Boolean,
            default: true
        }

    },
    mounted() {
        this._handle_paste = this._handle_paste.bind(this);
        document.addEventListener('paste', this._handle_paste);
    },
    beforeDestroy() {
        document.removeEventListener('paste', this._handle_paste);
    },
    methods: {
        _handle_files(files: File[]) {
            if (files.length > 0) {
                if (this.on_file) {
                    this.on_file(files[0]);
                }
                if (this.on_files) {
                    this.on_files(files);
                }
            }
        },
        async _handle_file_input_change(event) {
            this._handle_files(event.target.files);

        },
        async _handle_drop(event) {
            event.preventDefault();
            this.dragging = false;
            this._handle_files(event.dataTransfer.files)
        },
        _handle_paste(event) {
            let items = (event.clipboardData).items;
            for (let index in items) {
                let item = items[index];
                
                if (item.kind === 'file') {
                    let blob = item.getAsFile();
                    this.on_file(blob)
                }
            }
        },
        // New method to handle dragenter event
        _handle_dragenter(event) {
            this.dragging = true;
            event.preventDefault();
        },

        // New method to handle dragover event
        _handle_dragover(event) {
            event.preventDefault();
        }

    }
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import url('@/assets/index.less');

.drag-and-drop-manager {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .drag-and-drop-tooltop {
        position: absolute;
        right: 16px;
        top: 16px;
        color: #ffffff38;
        font-weight: 100;
        font-size: @font-size-xs;
        z-index: 1;
    }

    .drop-target {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.2);
        width: 100%;
        height: 100%;
        position: absolute;
        box-sizing: border-box;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 1;

        transition: all 0.2s ease-in-out;

        &:after {
            content: "";
            position: absolute;
            opacity: 0;
            top: 32px;
            left: 32px;
            transition: all 0.2s ease-in-out;
            border-radius: 16px;
            width: calc(100% - 64px);
            height: calc(100% - 64px);
            background-color: black;
            border: 2px dotted @color-text;
        }

        &.dragging {
            pointer-events: all;

            &:after {
                opacity: 0.4;
                transition: all 0.2s ease-in-out;
            }
        }

        p {
            font-size: 20px;
            color: white;
            z-index: 1;
        }
    }
}
</style>
  