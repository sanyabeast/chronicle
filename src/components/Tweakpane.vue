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
        font-family: @font-family-condensed !important;
        font-size: 10px;
    }
}

:root {
    --tp-base-background-color: hsla(0, 0%, 10%, 0.8);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(0, 0%, 80%, 1);
    --tp-button-background-color-active: hsla(0, 0%, 100%, 1);
    --tp-button-background-color-focus: hsla(0, 0%, 95%, 1);
    --tp-button-background-color-hover: hsla(0, 0%, 85%, 1);
    --tp-button-foreground-color: hsla(0, 0%, 0%, 0.8);
    --tp-container-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-container-background-color-active: hsla(0, 0%, 0%, 0.6);
    --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.5);
    --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.4);
    --tp-container-foreground-color: hsla(0, 0%, 100%, 0.5);
    --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.2);
    --tp-input-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-input-background-color-active: hsla(0, 0%, 0%, 0.6);
    --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.5);
    --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.4);
    --tp-input-foreground-color: hsla(0, 0%, 100%, 0.5);
    --tp-label-foreground-color: hsla(0, 0%, 100%, 0.5);
    --tp-monitor-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.3);
}
</style>
  