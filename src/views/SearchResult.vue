<template>
    <div class="view search-result">
        <h2 v-if="!($store.state.search_query.length > 0 && items_found > 0)" v-html="search_results_message"></h2>
        <div class="results-list">
            <div v-if="!item.noindex" class="result-preview" v-for="(item, index) in filtered_routes" :key="index" :style="{
                backgroundColor: get_random_web_color(item.name)
            }" @click="handle_result_item_click(item)">
                <h3 v-html="get_item_title(item)"></h3>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { applets } from '@/router';
import FuzzySearch from 'fuzzy-search';
import { get_random_web_color } from "@/tools"
import { isString } from "lodash"

let searcher: FuzzySearch<IAppletMetadata>;

export default Vue.extend({
    name: "SearchResults",
    data() {
        return {
            items_found: 0
        }
    },
    beforeMount() {
        console.log(applets)
        searcher = searcher == null ? new FuzzySearch(applets, ['name', 'tags'], {
            caseSensitive: false,
        }) : searcher;
    },
    computed: {
        search_query() {
            return this.$store.state.search_query
        },
        filtered_routes() {
            if (this.$store.state.search_query.length > 0) {
                const result = searcher.search(this.$store.state.search_query);
                this.items_found = result.length
                return result;
            } else {
                this.items_found = applets.length
                return applets
            }

        },
        search_results_message() {
            if (this.$store.state.search_query.length == 0) {
                return "C'mon, type something and let's find what you're looking for!"
            } else {
                return "Aw, no matches found :( But hey, don't give up!"
            }
        }
    },
    methods: {
        get_random_web_color: get_random_web_color,
        get_item_title(item: IAppletMetadata) {
            if (isString(item.title)) {
                return item.title;
            } else {
                return item.name;
            }
        },
        handle_result_item_click(item: IAppletMetadata) {
            this.$store.commit('route_replace', {
                name: item.route.name,
                props: item.props
            })
        }
    }
})
</script>
<style lang="less">
.view.search-result {
    width: 100%;

    .results-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .result-preview {
            user-select: none;
            width: 160px;
            height: 90px;
            overflow: hidden;
            background-color: rgb(128, 0, 128);
            border: 1px solid #fff;
            margin: 8px;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
    }
}
</style>