<template>
    <div class="applet-launcher" ref="root" @scroll="handle_scroll">
        <div class="launcher" v-if="applet_data !== undefined">
            <div class="brief" :class="{ no_preview: !applet_data.preview }">
                <h1 v-html="applet_data.title.toUpperCase()"></h1>
                <div class="brief-info">
                    <TextView v-if="applet_data.summary" :src="applet_data.summary" />
                    <PackageExplorer :package="applet_data.package" v-if="applet_data.package" />
                </div>
                <div class="avatar">
                    <ImageSlidesView v-if="need_show_preview()" 
                        :srcs="get_preview_images()" :src="applet_data.preview" />
                    <router-link v-if="applet_data.route.name !== 'about'" class="button launch" :to="applet_route_link">
                        <p>Launch</p>
                    </router-link>
                </div>
            </div>
            <div class="tags">
                <div class="tag-thumb" v-for="(item, index) in applet_data.tags" :key="index">
                    <p v-html="`${item}`" :style="{ color: `${get_bright_web_color(item)}` }"></p>
                </div>
            </div>
            <Showdown v-if="applet_data.document" :src="applet_data.document" />
            <div v-if="false" class="document-placeholder">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import Vue from 'vue';
import mixins from 'vue-typed-mixins'
import { applets } from '../router/index'
import Showdown from '@/components/Showdown.vue';
import BaseComponent from '@/components/BaseComponent.vue';
import { get_random_web_color, get_bright_web_color, to_snake_case, read_text_file } from '@/tools';
import ImageSlidesView from '@/components/ImageSlidesView.vue';
import { find } from 'lodash';

interface IAppletLauncherData {
    applet_data?: IAppletData,
    scroll_height: 0,
    scroll_top: 0,
    summary: string
}

export default mixins(BaseComponent).extend({
    name: "AppletLauncher",
    components: { Showdown, ImageSlidesView },
    mixins: [BaseComponent],
    data(): IAppletLauncherData {
        return {
            applet_data: undefined,
            scroll_height: 0,
            scroll_top: 0,
            summary: ''
        };
    },
    mounted() {
        this.applet_data = find(applets, (item) => to_snake_case(item.title) === this.applet);

        if (this.applet_data && this.applet_data.summary) {
            this.update_summary()
        }
    },
    beforeMount() {
    },
    methods: {
        get_random_web_color: get_random_web_color,
        get_bright_web_color: get_bright_web_color,
        get_preview_images(): string[] {
            // If preview_images exists and has items, return it
            if (this.applet_data && this.applet_data.preview_images && this.applet_data.preview_images.length > 0) {
                return this.applet_data.preview_images;
            }
            // Otherwise, if there's a single preview, return it as an array
            else if (this.applet_data && this.applet_data.preview) {
                return [this.applet_data.preview];
            }
            // Fallback to empty array
            return [];
        },
        need_show_preview(): boolean {
            let result = this.get_preview_images().length > 0;
            console.log(result);
            return result;
        },
        async update_summary() {
            this.summary = await read_text_file(this.applet_data!.summary!)
        },
        handle_scroll(event) {
            this.scroll_height = (this.$refs.root as any)!.scrollHeight;
            this.scroll_top = (this.$refs.root as any)!.scrollTop;
        },
        launch() {
            this.route_replace(this.applet_data!.route.name, this.applet_data!.props)
        },
    },
    computed: {
        applet_route_link() {
            return this.$router.resolve({
                name: this.applet_data!.route.name,
                params: this.applet_data!.props
            }).route.path
        }
    },
    props: {
        applet: {
            type: String,
            default() {
                return (-1).toString();
            },
            required: true
        }
    },
})
</script>
<style lang="less">
@import url('@/assets/index.less');

.applet-launcher {
    overflow: hidden;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;

    .button {
        cursor: cell;

        p {
            margin: 0;
        }
    }


    .launcher {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;


        .brief {
            display: grid;
            grid-template-columns: 256px 1fr;
            grid-template-rows: 96px minmax(272px, 1fr);
            width: 100%;
            flex-shrink: 0;

            &.no_preview {
                display: flex;
                flex-direction: column;

                .brief-info {
                    margin-left: 0;
                    padding: 16px 0;
                }
            }

            >h1 {
                grid-row: 1;
                grid-column: 2;
                grid-column-end: 2;
                font-size: @font-size-l;
                color: @color-text;
                font-weight: 800;
                margin: 0;
                margin-left: 32px;
                align-self: center;
                padding-right: 32px;
            }

            .placeholder {
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                margin-top: 32px;
                padding-right: 32px;

                i {
                    background-color: #ffffff06;
                    transition: background-color 1s ease-in-out;
                    display: flex;
                    height: 16px;
                    width: 100%;
                    margin: 4px 0;

                    &:hover {
                        background-color: #ffffff09;
                    }

                    &+i {
                        width: 78%;

                        &+i {
                            width: 66%;

                            &+i {
                                width: 88%;
                            }
                        }
                    }
                }
            }

            .brief-info {
                grid-row: 2;
                grid-column: 2;
                // width: 100
                height: 100%;
                flex-grow: 1;
                background-color: @color-background;
                color: @color-text;
                margin-left: 32px;
                display: flex;
                text-align: left;
                flex-direction: column;
                line-height: 1.5em;
            }

            .avatar {
                grid-row-start: 1;
                grid-row-end: 2;
                grid-column: 1;
                width: 100%;
                height: 100%;
                flex-grow: 1;
                background-color: @color-background;
                color: @color-text;
                display: flex;
                padding: 16px 0 0 0;
                flex-direction: column;

                .button {
                    flex-shrink: 0;
                    text-align: center;
                    height: 48px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &.launch {
                        background-color: @color-accent;
                        color: @color-background;
                        font-size: @font-size-l;
                        font-weight: 800;
                        border: 4px solid @color-text;

                        p {
                            background-color: @color-background;
                            font-size: @font-size-l;
                            color: @color-text;
                        }

                        &:hover {
                            background-color: @color-background !important;
                        }
                    }

                }

                .image-view {
                    flex-shrink: 1;
                    min-height: 200px;
                    width: auto;
                    margin-bottom: 16px;
                    border: 4px dotted @color-text;
                }
            }
        }

        .tags {
            flex-shrink: 0;
            margin-top: 16px;
            margin-bottom: 16px;
            padding: 0px;
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-end;
            align-items: center;

            .tag-thumb {
                // border: 4px solid @color-text;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-left: 8px;
                background-color: #2d2d2d;

                &:hover {
                    background-color: @color-text;

                    p {
                        color: @color-background !important;
                    }
                }

                p {
                    color: #ddd;
                    font-weight: 800;
                    margin: 0;
                }
            }
        }

        .showdown-viewer,
        .document-placeholder {
            flex-shrink: 0;
            margin-top: 16px;
            padding: 32px;
            padding-bottom: 64px;
        }

        .document-placeholder {
            height: 256px;
            background-color: #ffffff05;

            i {
                background-color: #ffffff03;
                display: flex;
                height: 16px;
                width: 66%;
                margin: 8px 0;

                &+i {
                    width: 78%;

                    &+i {
                        width: 84%;

                        &+i {
                            width: 44%;
                        }
                    }
                }
            }
        }

    }

    .text-view {
        padding-bottom: 16px;
        border-bottom: 4px dotted #373737;
    }

    .package-explorer {
        margin-top: 16px;
    }
}

@media screen and (max-width: 1400px) {

    .applet-launcher .launcher .brief {
        grid-template-columns: 288px 1fr;
    }

    .applet-launcher .launcher .brief>h1 {
        padding: 0 16px;
        margin-top: 0;
        margin-left: 0;
        font-size: @font-size-l;
    }

    .applet-launcher .launcher .brief .placeholder {
        margin-top: 0;
    }

    .applet-launcher .launcher .brief .avatar {
        padding: 16px;
    }

    .applet-launcher .launcher .brief .brief-info {
        padding: 16px;
        margin-left: 0;

        &.no_preview {
            padding: 16px;
        }
    }

    .applet-launcher .launcher .tags {
        padding: 0 16px;
    }

    .applet-launcher .launcher .showdown-viewer {
        padding: 16px;
    }

}

@media screen and (max-width: 1024px) {
    .applet-launcher .launcher .brief>h1 {
        font-size: @font-size-l;
    }

}

@media screen and (max-width: 800px) {
    .applet-launcher .launcher .brief>h1 {
        font-size: @font-size-l;
    }

}

@media screen and (max-width: 600px) {
    .applet-launcher {
        padding: 0;
    }

    .applet-launcher .launcher .brief {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }

    .applet-launcher .launcher .brief>h1 {
        margin-top: 16px;
        grid-row: 1;
        grid-column: 1;
        font-size: @font-size-l;
        // font-family: @font-family-sans;
    }

    .applet-launcher .launcher .brief .placeholder {
        display: none;
    }

    .applet-launcher .launcher .brief .brief-info {
        padding: 16px;
        padding-top: 0;
        grid-row: 3;
        grid-column: 1;
        text-align: justify;
    }

    .applet-launcher .launcher .brief .avatar {
        grid-row-start: 2;
        grid-row-end: 2;
        grid-column: 1;
        padding-bottom: 0;

        .button.launch {
            margin-top: 8px;
        }
    }

    .applet-launcher .launcher .document-placeholder {
        display: none;
    }

}
</style>