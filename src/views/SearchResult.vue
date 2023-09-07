<template>
    <div class="view search-result">
        <h2 v-if="!($store.state.search_query.length > 0 && items_found > 0)" v-html="search_results_message"></h2>
        <div class="results-list">
            <div v-if="!item.noindex" class="result-preview" v-for="(item, index) in filtered_routes" :key="index" :style="{
                backgroundColor: get_random_web_color(item.title)
            }" @click="handle_result_item_click(item)">
                <img v-if="item.preview != undefined" :src="item.preview" />
                <div class="fader" :style="{
                    backgroundColor: get_random_web_color(item.title)
                }"></div>
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

let searcher: FuzzySearch<IAppletMetadata>;

export default Vue.extend({
    name: "SearchResults",
    data() {
        return {
            items_found: 0
        }
    },
    beforeMount() {
        searcher = searcher == null ? new FuzzySearch(applets, ['router.name', 'title', 'tags'], {
            caseSensitive: false,
        }) : searcher;
    },
    mounted() {
        if (this.$refs.search_input) {
            (this.$refs.search_input as HTMLInputElement).value = ""
        }

    },
    props: {
        skip_launcher: {
            type: Boolean,
            default: false
        }
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
            if (item.title.length > 0) {
                return item.title;
            } else {
                return item.route.name;
            }
        },
        handle_result_item_click(item: IAppletMetadata) {
            if (this.skip_launcher === false || item.summary || item.document) {
                this.$store.commit('route_replace', {
                    name: 'applet/applet-launcher',
                    props: {
                        applet: item.index!.toString()
                    }
                })
            } else {
                this.$store.commit('route_replace', {
                    name: item.route.name,
                    props: item.props
                });
            }


        },
        get_preview(uri: string) {
            return require(uri)
        },

    }
})
</script>
<style lang="less">
.view.search-result {
    width: 100%;

    .results-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        column-gap: 24px;
        row-gap: 24px;

        .result-preview {
            user-select: none;
            width: 100%;
            height: 120px;
            overflow: hidden;
            background-color: #000;
            border: 1px solid #fff;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            justify-self: center;
            align-self: center;

            img {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: auto;
                z-index: 0;
                transform-origin: center center;
                transform: translate(-50%, -50%) scale(1.5);
            }

            .fader {
                position: absolute;
                z-index: 1;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
            }

            h3 {
                z-index: 2;
                background: #000;
                text-transform: capitalize;
                font-family: 'Ubuntu Condensed', sans-serif;
            }
        }

        .result-preview:nth-child(2n) {
            img {
                transform: translate(-50%, -50%) scale(1.5);
            }
        }

        .result-preview:hover {
            .fader {
                opacity: 0.5;
            }
        }
    }

    h2 {
        text-align: center;
        margin-bottom: 32px;
    }
}

@media screen and (max-width: 1360px) {
    .view.search-result {
        .results-list {
            padding: 0 16px;
        }
    }
}

@media screen and (max-width: 600px) {
    .view.search-result {
        .results-list {
            display: flex;
            flex-direction: column;
            padding: 0 0;


            .result-preview {
                width: 100%;
                height: 32px;
            }

            .result-preview:hover {
                .fader {
                    opacity: 0.5;
                }
            }
        }

        h2 {
            font-size: 16px;
            text-align: left;
        }
    }
}
</style>