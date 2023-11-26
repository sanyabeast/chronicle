<template>
    <div class="a-star-pathfinder">
        <Canvas2D ref="canvas" @update="render" :show_debug="!is_mobile" :allow_user_scale="true"
            :allow_user_translate="true" :allow_context_menu="true">
            <viewport width="10" height="10">
                <rect x="1" y="1" width="2" height="2"></rect>
            </viewport>
        </Canvas2D>
    </div>
</template>
<script lang="ts">

import Vue from 'vue';
import Canvas2D from '@/components/Canvas2D.vue';
import mixins from 'vue-typed-mixins'
import BaseComponent from '@/components/BaseComponent.vue';
import { map, throttle } from 'lodash';
import Syntax from '@/components/Syntax.vue';
import { AStarPathfinder } from './AStar/AStar';


export default mixins(BaseComponent).extend({
    name: "AStarDemo",
    components: { Canvas2D },
    mounted() { },
    beforeMount() { },
    methods: {
        render() {

        }
    },
    computed: {},
    props: {
        category: String
    },

    data() {
        return {

        }
    }
})
</script>
<style lang="less">
@import url('@/assets/index.less');

.a-star-pathfinder {
    color: @color-accent;
}
</style>