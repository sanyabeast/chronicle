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
</style>
  