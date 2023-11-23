<template>
    <div class="tweakpane">
        <div ref="container" class="container"></div>
    </div>
</template>
  
<script lang="ts">
import Vue from 'vue';
import { Pane } from 'tweakpane';
import { isArray, isObject } from 'lodash';

export interface TweakpaneData {

}

export default Vue.extend({
    name: 'Tweakpane',
    data(): TweakpaneData {
        return {
        }
    },
    props: {
        title: {
            type: String,
            default: 'Parameters'
        }
    },
    mounted() {
        this.pane = new Pane({
            title: this.title,
            container: this.$refs.container as HTMLElement,
        });
    },
    methods: {

    }
});
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less">
@import url('@/assets/index.less');

.tweakpane {

    .tp-lblv_l,
    .tp-rotv_c,
    .tp-fldv_c,
    .tp-rotv {
        font-family: @font-family-monospace !important;
        font-size: 10px;
        border-radius: 0;
    }

    .tp-sldv_k::after {
        border-radius: 50%;
    }

    .tp-lblv_v {
        width: 96px;
    }

    .tp-btnv_t {
        color: #ffffff;
    }

    .tp-p2dv_b,
    .tp-btnv_b,
    .tp-lstv_s {
        background-color: transparent;
        border-radius: 0;
        border: 1px solid #ffffff;

    }

    .tp-lstv_s {
        color: var(--tp-button-background-color);
    }

    .tp-p2dv_b:hover,
    .tp-btnv_b:hover,
    .tp-lstv_s:hover {
        border: 1px solid #ff0000;
    }

    .tp-p2dv_b:active,
    .tp-btnv_b:active,
    .tp-lstv_s:active {
        border: 1px solid #ff0000;
        background-color: transparent !important;
    }

    .tp-p2dv_b:focus,
    .tp-btnv_b:focus,
    .tp-lstv_s:focus {
        border: 1px solid #ff0000;
        background-color: transparent !important;
    }

    .tp-btnv_b {
        height: 32px;
    }

    option {
        color: #000000;
    }
}

:root {
    --tp-base-background-color: hsla(0, 0%, 11%, 0.3);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(0, 0%, 80%, 1);
    --tp-button-background-color-active: rgb(255, 255, 255);
    --tp-button-background-color-focus: rgb(255, 255, 255);
    --tp-button-background-color-hover: rgb(255, 0, 0);
    --tp-button-foreground-color: hsla(0, 0%, 0%, 0.8);
    --tp-container-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-container-background-color-active: hsla(0, 0%, 0%, 0.6);
    --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.5);
    --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.4);
    --tp-container-foreground-color: rgb(150, 150, 150);
    --tp-groove-foreground-color: rgb(117, 117, 117);
    --tp-input-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-input-background-color-active: hsla(0, 0%, 0%, 0.6);
    --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.5);
    --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.4);
    --tp-input-foreground-color: hsla(0, 100%, 50%, 1);
    --tp-label-foreground-color: hsla(0, 25%, 98%, 0.75);
    --tp-monitor-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.3);

}</style>
  