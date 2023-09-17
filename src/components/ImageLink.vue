<template>
    <div class="image-link">
        <router-link :to="target">
            <img :alt="label" :src="image" />
        </router-link>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'ImageLink',
    props: {
        image: String,
        target: String,
        label: String
    },
});
</script>
<style lang="less">
@import url('@/assets/index.less');

.image-link {
    background: @color-accent;
}
</style>