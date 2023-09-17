<template>
    <div class="applets-catalog" :class="{ search_not_empty: search_not_empty }">
        <h2 v-html="search_results_message"></h2>
        <div class="applets-catalog-content">
            <div class="applets-category-view" v-if="need_category_show(category_item)"
                v-for="(category_item, category_index) in category_view.categories" :key="`cat_block_${category_index}`">
                <div @click="category_item.fold = !category_item.fold" class="applet-category-title"
                    :class="{ folded: category_item.fold }" v-if="category_item.title">
                    <div class="fold-control"></div>
                    <h2 v-html="category_item.title"></h2>
                </div>
                <router-link v-if="!category_item.title || !category_item.fold" class="applet-thumb"
                    :class="{ no_preview: !applet_item.preview }"
                    v-for="(applet_item, index) in get_category_applets(category_item)" :key="`cat_${index}`"
                    :to="get_route_link(applet_item)">
                    <ImageView v-if="applet_item.preview != undefined" :src="applet_item.preview" />
                    <div class="fader"></div>
                    <h3 v-html="get_item_title(applet_item)"></h3>
                </router-link>
                <div v-if="!category_item.fold" class="grid-dummy" v-for="index in grid_dummies_count"
                    :key="`dummy_${index}`"></div>
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
import { filter, orderBy } from 'lodash';

let searcher: FuzzySearch<IAppletData>;

interface IAppletCategoryData {
    include: EAppletCategory[];
    title: string | null;
    fold: boolean;
    filter: boolean;
    if_search: boolean;
    if_no_search: boolean;
    order: boolean
}

interface IAppletsCatalogData {
    items_found: number;
    category_fold_map: any[];
    category_view: {
        categories: IAppletCategoryData[]
    };
    grid_dummies_count: number;
}

export default mixins(BaseComponent).extend({
    name: "AppletsCatalog",
    data(): IAppletsCatalogData {
        return {
            items_found: 0,
            category_fold_map: [],
            category_view: {
                categories: [
                    {
                        include: [],
                        title: null,
                        fold: false,
                        filter: true,
                        if_search: true,
                        if_no_search: false,
                        order: false
                    },
                    {
                        include: [EAppletCategory.Project, EAppletCategory.Demo],
                        title: null,
                        fold: false,
                        filter: false,
                        if_search: false,
                        if_no_search: true,
                        order: true
                    },
                    {
                        include: [EAppletCategory.Project, EAppletCategory.Demo],
                        title: "everything",
                        fold: false,
                        filter: false,
                        if_search: true,
                        if_no_search: false,
                        order: true
                    },
                    {
                        include: [EAppletCategory.Lab],
                        title: "experiments",
                        fold: true,
                        filter: false,
                        if_search: true,
                        if_no_search: false,
                        order: true
                    },
                    {
                        include: [EAppletCategory.Package],
                        title: "packages",
                        fold: false,
                        filter: false,
                        if_search: true,
                        if_no_search: true,
                        order: true
                    },
                    {
                        include: [EAppletCategory.Service],
                        title: "service",
                        fold: true,
                        filter: false,
                        if_search: true,
                        if_no_search: false,
                        order: true
                    },
                    {
                        include: [EAppletCategory.Project, EAppletCategory.Demo, EAppletCategory.Package, EAppletCategory.Lab, EAppletCategory.Service],
                        title: "everything",
                        fold: true,
                        filter: false,
                        if_search: false,
                        if_no_search: true,
                        order: true
                    }
                ]
            },
            grid_dummies_count: 10
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
    props: {},
    computed: {
        applets() {
            return applets;
        },
        search_query() {
            return this.$store.state.search_query;
        },
        search_results_message() {
            if (this.search_not_empty == 0) {
                return "c'mon, type something and let's find what you're looking for!";
            } else {
                if (this.search_not_empty > 0 && this.items_found > 0) {
                    return `found ${this.items_found} ${this.items_found > 1 ? 'matches' : 'match'} for "${this.$store.state.search_query}"`;
                } else {
                    return "aw, no matches found :( But hey, don't give up!";
                }

            }
        },
        search_not_empty() {
            return this.search_query.length > 0;
        },

    },
    watch: {
        search_query(new_val: string) {
            if (new_val.length > 0) {
                this.unfold_all();
            } else {
                this.fold_all()
            }
        }
    },
    methods: {
        get_random_web_color: get_random_web_color,
        get_thumb_bg_color(item: IAppletData) {
            if (!this.is_mobile) {
                return '#000';
            } else {
                return get_dark_web_color(item.title)
            }
        },
        get_route_link(item: IAppletData): string {
            let result = "";
            if (item.launcher !== true && (item.summary || item.document)) {
                result = `/applet/${item.index}`;
            }
            else {
                console.log(`get_route_link: ${item.route.name}`, item.props)
                result = this.$router.resolve({
                    name: item.route.name,
                    params: item.props
                }).route.path;
            }

            console.log(`get_route_link: ${result}`)
            return result;
        },
        get_item_title(item: IAppletData) {
            if (item.title.length > 0) {
                return item.title;
            }
            else {
                return item.route.name;
            }
        },
        get_preview(uri: string) {
            return require(uri);
        },
        filter_applets_with_category(applets: IAppletData[], category: EAppletCategory[]): IAppletData[] {
            if (category.length == 0) {
                return applets;
            }
            return filter(applets, (item: IAppletData) => {
                return filter(item.category, (cat: EAppletCategory) => {
                    return category.indexOf(cat) > -1;
                }).length > 0;
            });
        },
        filter_applets_with_search_query(): IAppletData[] {
            if (this.search_not_empty > 0) {
                const result = searcher.search(this.$store.state.search_query);
                this.items_found = result.length;
                return result;
            } else {
                this.items_found = applets.length;
                return applets;
            }
        },
        get_category_applets(category_item: IAppletCategoryData) {
            let result = this.filter_applets_with_category(category_item.filter ? this.filter_applets_with_search_query() : applets, category_item.include)

            if (category_item.order) {
                return this.order_applets(result, category_item);
            }

            return result;
        },
        order_applets(applets: IAppletData[], category_item: IAppletCategoryData): IAppletData[] {
            return orderBy(applets, (item: IAppletData) => {
                let category_index = -1;
                for (let i = 0; i < category_item.include.length; i++) {
                    if (item.category.indexOf(category_item.include[i]) > -1) {
                        category_index = i;
                        break;
                    }
                }
                return category_index;
            }, 'asc');
        },
        need_category_show(category_item: IAppletCategoryData) {
            let result = false;
            if (this.get_category_applets(category_item, false).length === 0) {
                result = false;
            } else {
                if (this.search_not_empty > 0) {
                    result = category_item.if_search
                } else {
                    result = category_item.if_no_search
                }
            }

            return result;
        },
        unfold_all() {
            this.category_view.categories.forEach((item) => {
                item.fold = false;
            });
        },
        fold_all() {
            this.category_view.categories.forEach((item) => {
                item.fold = true;
            });
        }
    },
    components: { ImageView }
})
</script>
<style lang="less">
@import url('@/assets/index.less');

.view.applets-catalog {
    width: 100%;

    .applets-catalog-content {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        .applets-category-view {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            column-gap: 24px;
            row-gap: 24px;
            padding: 0;
            margin-bottom: 32px;
        }

        .applet-thumb {
            user-select: none;
            width: 100%;
            height: 120px;
            overflow: hidden;
            background-color: @color-background;
            border: 1px solid @color-text;
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
                background-color: @color-accent;
            }

            h3 {
                font-size: 20px;
                z-index: 2;
                background: @color-background;
                text-transform: capitalize;
                font-family: @font-family-secondary;
            }
        }

        .applet-thumb:nth-child(2n) {
            .image-view {
                transform: translate(-50%, -50%) scale(1.5);
            }
        }

        .applet-thumb:hover {
            .fader {
                opacity: 0.5;
            }
        }
    }


    .applet-category-title {
        grid-column: 1 / -1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: cell;
        display: grid;
        grid-template-columns: 24px auto 1fr;
        grid-gap: 8px;


        .fold-control {
            width: 100%;
            height: 100%;
            position: relative;
            widows: 24px;
            height: 24px;

            &:before,
            &:after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                width: 80%;
                height: 4px;
                background-color: @color-text;
                transform: translate(-50%, -50%);
            }

            &:after {
                height: 80%;
                width: 4px;
                transform: translate(-50%, -50%) scaleY(0);
            }
        }

        h2 {
            margin: 0;
            text-align: left;
            background-color: @color-text;
            color: @color-background;
            display: grid;
        }

        &.folded {
            .fold-control {
                &:after {
                    transform: translate(-50%, -50%) scaleY(1);
                }
            }
        }


        &:hover {
            .fold-control {

                &:after,
                &:before {
                    background-color: @color-accent;
                }
            }

            h2 {
                background-color: @color-accent;
            }
        }

    }


    h2 {
        text-align: center;
        margin-bottom: 32px;
    }
}

@media screen and (max-width: 1400px) {
    .view.applets-catalog {
        .applets-catalog-content {
            padding: 0 16px;
        }
    }
}

@media screen and (max-width: 600px) {
    .view.applets-catalog {
        .applets-catalog-content {
            display: flex;
            flex-direction: column;
            padding: 0 0;

            .applets-category-view {
                display: flex;
                flex-direction: column;
            }

            .grid-dummy {
                display: none;
            }

            .applet-thumb {
                display: grid;
                grid-template-columns: 32px 1fr;
                grid-template-rows: 1fr;
                width: 100%;
                height: 32px;
                align-items: center;
                padding: 0;
                border: none;

                .image-view {
                    position: relative;
                    grid-column: 1;
                }

                h3 {
                    grid-column: 2;
                    margin: 0;
                    padding: 0 16px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    height: 100%;
                    font-size: 20px;
                    font-weight: 400;
                    font-family: @font-family-primary;

                }

                &.no_preview {
                    &:before {
                        content: "";
                        width: 32px;
                        height: 32px;
                        background-color: #4b4b4b;
                    }
                }

                .applet-thumb:hover {
                    .fader {
                        opacity: 0.5;
                    }
                }
            }

            .applet-category-title {
                h2 {
                    margin: 0;
                    font-size: 20px;
                    text-align: left;
                }

                .fold-control {

                    &:after,
                    &:before {
                        background-color: @color-accent;
                    }
                }

                h2 {
                    background-color: @color-accent;
                }
            }
        }
    }
}
</style>