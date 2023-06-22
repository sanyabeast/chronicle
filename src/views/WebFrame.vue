<template>
    <div class="view web-frame">
        <iframe v-if="url != undefined" :src="url" />
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
    methods: {},
    computed: {},
    props: {
        url: String
    },
    components: {},
    data() {
        return {}
    }
})
</script>
<style lang="less">
.view.web-frame {
    
    iframe {
        width: 100%;
        height: 100%;
    }
}
</style>