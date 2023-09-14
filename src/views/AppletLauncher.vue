<template>
    <div class="applet-launcher" ref="root" @scroll="handle_scroll">
        <div class="launcher" v-if="applet_data !== undefined">
            <div class="brief">
                <p v-html="applet_data.title.toUpperCase()"></p>
                <div class="brief-info">
                    <TextView v-if="applet_data.summary" :src="applet_data.summary" />
                    <div class="placeholder" v-if="!applet_data.summary">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                    </div>
                </div>
                <div class="avatar">
                    <ImageView :src="applet_data.preview" />
                    <router-link class="button launch" :to="applet_route_link">
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
import ImageView from '@/components/ImageView.vue';
import { find } from 'lodash';


interface IAppletLauncherData {
    applet_data?: IAppletData,
    scroll_height: 0,
    scroll_top: 0,
    summary: string
}

export default mixins(BaseComponent).extend({
    name: "AppletLauncher",
    components: { Showdown, ImageView },
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

            >p {
                grid-row: 1;
                grid-column: 2;
                grid-column-end: 2;
                font-size: 64px;
                color: #fff;
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
                    border-radius: 8px;
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
                width: 100%;
                height: 100%;
                flex-grow: 1;
                background-color: #000;
                color: #fff;
                margin-left: 32px;
                padding-right: 64px;
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
                background-color: #000;
                color: #fff;
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
                        background-color: red;
                        color: #000;
                        font-size: 24px;
                        font-weight: 800;
                        border: 1px solid #fff;

                        p {
                            background-color: #000;
                            color: #fff;
                        }

                        &:hover {
                            background-color: #000 !important;
                        }
                    }

                }

                .image-view {
                    flex-shrink: 1;
                    min-height: 200px;
                    width: auto;
                    margin-bottom: 16px;
                    border: 1px dotted #fff;
                }
            }
        }

        .tags {
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
                // border: 1px solid #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-left: 8px;
                background-color: #2d2d2d;
                border-radius: 16px;

                &:hover {
                    background-color: #fff;

                    p {
                        color: #000 !important;
                    }
                }

                p {
                    color: #ddd;
                    font-weight: 800;
                    margin: 0;
                    font-family: 'Ubuntu Mono', monospace;
                }
            }
        }

        .showdown-viewer,
        .document-placeholder {
            margin-top: 16px;
            padding: 16px;
            width: 100%;
            padding-bottom: 64px;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
        }

        .document-placeholder {
            height: 256px;
            background-color: #ffffff05;
            border-radius: 16px;

            i {
                background-color: #ffffff03;
                border-radius: 8px;
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
}

@media screen and (max-width: 1400px) {

    .applet-launcher .launcher .brief {
        grid-template-columns: 288px 1fr;
    }

    .applet-launcher .launcher .brief>p {
        padding: 0 16px;
        margin-top: 0;
        margin-left: 0;
        font-size: 48px;
    }

    .applet-launcher .launcher .brief .placeholder {
        margin-top: 0;
    }

    .applet-launcher .launcher .brief .avatar {
        padding: 16px;
    }

    .applet-launcher .launcher .brief .brief-info {
        padding: 0 16px;
        padding-right: 48px;
        margin-left: 0;
    }

    .applet-launcher .launcher .tags {
        padding: 0 16px;
    }

    .applet-launcher .launcher .showdown-viewer {
        padding: 16px;
    }

}

@media screen and (max-width: 1024px) {
    .applet-launcher .launcher .brief>p {
        font-size: 32px;
    }

}

@media screen and (max-width: 800px) {
    .applet-launcher .launcher .brief>p {
        font-size: 32px;
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

    .applet-launcher .launcher .brief>p {
        margin-top: 16px;
        grid-row: 1;
        grid-column: 1;
        font-size: 32px;
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