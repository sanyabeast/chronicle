<template>
    <div class="search-result">
        <h2 v-html="search_results_message"></h2>
        <div class="results-list">
            <div class="applet-category-view" v-if="need_category_show(category_item)"
                v-for="(category_item, index) in category_view.order" :key="`cat_block_${index}`">
                <div class="search-section" v-if="category_item.title">
                    <h2 v-html="category_item.title"></h2>
                </div>
                <router-link class="result-preview"
                    v-for="(applet_item, index) in filter_applets_with_category(category_item.filter ? filter_applets_with_search_query() : all_applets, category_item.include)"
                    :key="`cat_${index}`" :to="get_route_link(applet_item)">
                    <ImageView v-if="!is_mobile && applet_item.preview != undefined" :src="applet_item.preview" />
                    <div class="fader"></div>
                    <h3 v-html="get_item_title(applet_item)"></h3>
                </router-link>
            </div>

        </div>
    </div>
</template>
<script lang="ts">

import { EAppletCategory, applets } from '@/router';
import FuzzySearch from 'fuzzy-search';
import { get_dark_web_color, get_random_web_color } from "@/tools"
import ImageView from '@/components/ImageView.vue';
import BaseComponent from '@/components/BaseComponent.vue';
import mixins from 'vue-typed-mixins';
import { filter } from 'lodash';

let searcher: FuzzySearch<IAppletMetadata>;

export default mixins(BaseComponent).extend({
    name: "SearchResults",
    data() {
        return {
            items_found: 0,
            category_view: {
                order: [
                    {
                        include: [EAppletCategory.Default],
                        title: null,
                        fold: false,
                        filter: true,
                        if_search: true,
                        if_no_search: false

                    },
                    {
                        include: [EAppletCategory.Default],
                        title: null,
                        fold: false,
                        filter: true,
                        if_search: true,
                        if_no_search: true
                    },
                    {
                        include: [EAppletCategory.Experimental],
                        title: "experimental",
                        fold: false,
                        filter: true,
                        if_search: true,
                        if_no_search: true
                    },
                    {
                        include: [EAppletCategory.Package],
                        title: "packages",
                        fold: false,
                        filter: false,
                        if_search: true,
                        if_no_search: true
                    },
                    {
                        include: [EAppletCategory.Service],
                        title: "services",
                        fold: true,
                        filter: false,
                        if_search: true,
                        if_no_search: false
                    }
                ]
            }
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
        // filtered_routes() {
        //     if (this.$store.state.search_query.length > 0) {
        //         const result = searcher.search(this.$store.state.search_query);
        //         this.items_found = result.length;
        //         return result;
        //     }
        //     else {
        //         this.items_found = applets.length;
        //         return applets;
        //     }
        // },
        all_applets() {
            return applets
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
        },
        need_category_show() {
            return (category_item: any) => {
                if (this.$store.state.search_query.length > 0) {
                    if (category_item.if_search) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (category_item.if_no_search) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    },
    methods: {
        get_random_web_color: get_random_web_color,
        get_thumb_bg_color(item: IAppletMetadata) {
            if (!this.is_mobile) {
                return '#000';
            } else {
                return get_dark_web_color(item.title)
            }
        },
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
        filter_applets_with_category(applets: IAppletMetadata[], category: EAppletCategory[]): IAppletMetadata[] {
            return filter(applets, (item: IAppletMetadata) => {
                return filter(item.category, (cat: EAppletCategory) => {
                    return category.indexOf(cat) > -1;
                }).length > 0;
            });
        },
        filter_applets_with_search_query(): IAppletMetadata[] {
            if (this.$store.state.search_query.length > 0) {
                const result = searcher.search(this.$store.state.search_query);
                this.items_found = result.length;
                return result;
            } else {
                this.items_found = applets.length;
                return applets;
            }
        },
    },
    components: { ImageView }
})
</script>
<style lang="less">
.view.search-result {
    width: 100%;

    .results-list {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        .applet-category-view {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            column-gap: 24px;
            row-gap: 24px;
            padding: 32px 0;
        }

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
                font-size: 18px;
                z-index: 2;
                background: #000;
                text-transform: capitalize;
                font-family: 'Ubuntu Condensed', sans-serif;
            }
        }

        .search-section {
            grid-column: 1 / -1;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            h2 {
                margin: 0;
                text-align: left;
                background-color: #ff0000;
                color: #000;
            }
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

@media screen and (max-width: 1400px) {
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

        .search-section {
            h2 {
                margin: 0;
                font-size: 18px;
                text-align: left;
            }
        }
    }
}
</style>