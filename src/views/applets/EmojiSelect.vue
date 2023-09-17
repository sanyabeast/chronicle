<template>
    <div class="emoji-select">
        <div class="emoji-list">
            <i v-if="category == undefined || category.length == 0 || category == item.category"
                v-for="(item, index) in emoji_data" :key="index" v-html="item.emoji"></i>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import emoji_data from '@/assets/emoji.json'


export default Vue.extend({
    name: "EmojiSelect",
    mounted() {

    },
    beforeMount() {

    },
    methods: {},
    computed: {},
    props: {
        category: String
    },
    components: {},
    data() {
        return {
            emoji_data: emoji_data
        }
    }
})
</script>
<style lang="less">
@import url('@/assets/index.less');

.emoji-select {
    color: @color-accent;
}
</style>