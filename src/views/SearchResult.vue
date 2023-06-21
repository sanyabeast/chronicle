<template>
    <div>
        <p>Search results will appear here</p>
        <p v-html="search_query"></p>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    name: "SearchResults",
    computed: {
        search_query() {
            return this.$store.state.search_query
        }
    },
})
</script>