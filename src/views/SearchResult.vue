<template>
    <div class="search-result">
        <h2 v-html="search_results_message"></h2>
        <div class="results-list">
            <router-link v-if="(!item.service && !item.is_extra) || $store.state.search_query.length > 0"
                class="result-preview" v-for="(item, index) in filtered_routes" :key="index" :to="get_route_link(item)">
                <!-- <img v-if="item.preview != undefined" :src="item.preview" /> -->
                <ImageView v-if="item.preview != undefined" :src="item.preview" />
                <div class="fader"></div>
                <h3 v-html="get_item_title(item)"></h3>
            </router-link>
            <h2 v-if="show_all_applets">all applets</h2>
            <router-link v-if="show_all_applets" class="result-preview" v-for="(item, index) in all_applets"
                :key="`all_${index}`" :to="get_route_link(item)">
                <!-- <img v-if=" item.preview !=undefined" :src="item.preview" /> -->
                <ImageView v-if="item.preview != undefined" :src="item.preview" />
                <div class="fader"></div>
                <h3 v-html="get_item_title(item)"></h3>
            </router-link>
            <h2 v-if="show_all_applets">extra applets</h2>
            <router-link v-if="show_all_applets" class="result-preview" v-for="(item, index) in extra_applets"
                :key="`extra_${index}`" :to="get_route_link(item)">
                <!-- <img v-if=" item.preview !=undefined" :src="item.preview" /> -->
                <ImageView v-if="item.preview != undefined" :src="item.preview" />
                <div class="fader"></div>
                <h3 v-html="get_item_title(item)"></h3>
            </router-link>
            <h2 v-if="show_all_applets">service applets</h2>
            <router-link v-if="show_all_applets" class="result-preview" v-for="(item, index) in service_applets"
                :key="`service_${index}`" :to="get_route_link(item)">
                <!-- <img v-if=" item.preview !=undefined" :src="item.preview" /> -->
                <ImageView v-if="item.preview != undefined" :src="item.preview" />
                <div class="fader"></div>
                <h3 v-html="get_item_title(item)"></h3>
            </router-link>
        </div>
    </div>
</template>
<script lang="ts">

import { applets } from '@/router';
import FuzzySearch from 'fuzzy-search';
import { get_random_web_color } from "@/tools"
import ImageView from '@/components/ImageView.vue';
import BaseComponent from '@/components/BaseComponent.vue';
import mixins from 'vue-typed-mixins';
import { filter } from 'lodash';

let searcher: FuzzySearch<IAppletMetadata>;

export default mixins(BaseComponent).extend({
    name: "SearchResults",
    data() {
        return {
            items_found: 0
        };
    },
    beforeMount() {
        searcher = searcher == null ? new FuzzySearch(applets, ['router.name', 'title', 'tags'], {
            caseSensitive: false,
        }) : searcher;
    },
    beforeDestroy() {
        // this.$store.state.search_query = "";
    },
    mounted() {
        if (this.$refs.search_input) {
            (this.$refs.search_input as HTMLInputElement).value = "";
        }
    },
    props: {
        skip_launcher: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        applets() {
            return applets;
        },
        search_query() {
            return this.$store.state.search_query;
        },
        filtered_routes() {
            if (this.$store.state.search_query.length > 0) {
                const result = searcher.search(this.$store.state.search_query);
                this.items_found = result.length;
                return result;
            }
            else {
                this.items_found = applets.length;
                return applets;
            }
        },
        all_applets() {
            return filter(applets, (item: IAppletMetadata) => {
                return !item.service && !item.is_extra;
            });
        },
        service_applets() {
            return filter(applets, (item: IAppletMetadata) => {
                return item.service;
            });
        },
        extra_applets() {
            return filter(applets, (item: IAppletMetadata) => {
                return item.is_extra;
            });
        },
        show_all_applets() {
            return this.$store.state.search_query.length > 0;
        },
        search_results_message() {
            if (this.$store.state.search_query.length == 0) {
                return "c'mon, type something and let's find what you're looking for!";
            } else {
                if (this.$store.state.search_query.length > 0 && this.items_found > 0) {
                    return `found ${this.items_found} ${this.items_found > 1 ? 'matches' : 'match'} for "${this.$store.state.search_query}"`;
                } else {
                    return "aw, no matches found :( But hey, don't give up!";
                }

            }
        }
    },
    methods: {
        get_random_web_color: get_random_web_color,
        get_route_link(item: IAppletMetadata): string {
            let result = "";
            if (this.skip_launcher === false || item.summary || item.document) {
                result = `/applet-launcher/${item.index}`;
            }
            else {
                result = this.$router.resolve({
                    name: item.route.name,
                    props: item.props
                }).route.path;
            }
            return result;
        },
        get_item_title(item: IAppletMetadata) {
            if (item.title.length > 0) {
                return item.title;
            }
            else {
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
                });
            }
            else {
                this.$store.commit('route_replace', {
                    name: item.route.name,
                    props: item.props
                });
            }
        },
        get_preview(uri: string) {
            return require(uri);
        },
    },
    components: { ImageView }
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
            cursor: cell;
            position: relative;
            justify-self: center;
            align-self: center;
            text-decoration: none;

            .image-view {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
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
                background-color: red;
            }

            h3 {
                z-index: 2;
                background: #000;
                text-transform: capitalize;
                font-family: 'Ubuntu Condensed', sans-serif;
            }
        }

        >h2 {
            grid-column: 1 / -1;
            text-align: center;
            margin-bottom: 32px;
            text-align: left;
        }

        .result-preview:nth-child(2n) {
            .image-view {
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
                display: flex;
                width: 100%;
                height: 32px;
                justify-content: flex-start;

                h3 {
                    font-family: 'Ubuntu', sans-serif;
                    font-size: 18px;
                }
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