<template>
    <div class="view applet-launcher" ref="root" @scroll="handle_scroll">
        <div class="launcher" v-if="applet_data !== undefined">
            <div class="brief">
                <p v-html="applet_data.title"></p>
                <div class="brief-info">
                    <p v-if="applet_data.summary" v-html="applet_data.summary"></p>
                    <div class="placeholder" v-if="!applet_data.summary">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                    </div>
                </div>
                <div class="avatar">
                    <img :src="applet_data.preview" />
                    <div class="button launch" :class="{ sticky: scroll_top > 200 }" :style="{ top: `${scroll_top}px` }"
                        @click="launch">
                        <p>Launch</p>
                    </div>
                </div>
            </div>
            <div class="tags">
                <div class="tag-thumb" v-for="(item, index) in applet_data.tags" :key="index">
                    <p v-html="`/ ${item} /`"></p>
                </div>
            </div>

            <Showdown v-if="applet_data.document" :src="applet_data.document" />

            <div v-if="!applet_data.document" class="document-placeholder">
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
import { applets } from '../router/index'
import Showdown from '@/components/Showdown.vue';

interface IAppletLauncherData {
    applet_data?: IAppletMetadata,
    scroll_height: 0,
    scroll_top: 0
}

export default Vue.extend({
    name: "AppletLauncher",
    components: { Showdown },
    data(): IAppletLauncherData {
        return {
            applet_data: undefined,
            scroll_height: 0,
            scroll_top: 0
        };
    },
    mounted() {
        let index = parseInt(this.applet);
        this.applet_data = applets[index];
        console.log(index, this.applet_data);
    },
    beforeMount() {
    },
    methods: {
        handle_scroll(event) {
            this.scroll_height = (this.$refs.root as any)!.scrollHeight;
            this.scroll_top = (this.$refs.root as any)!.scrollTop;
        },
        launch() {
            this.$store.commit('route_replace', {
                name: this.applet_data!.route.name,
                props: this.applet_data!.props
            });
        }
    },
    computed: {},
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
.view.applet-launcher {
    padding: 0;
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
            grid-template-columns: 1fr 256px;
            grid-template-rows: 96px minmax(272px, 1fr);
            width: 100%;

            >p {
                grid-row: 1;
                grid-column: 1;
                grid-column-end: 2;
                font-size: 64px;
                color: #fff;
                font-weight: 800;
                margin: 0;
                margin-top: 32px;
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
                    background-color: #ffffff05;
                    border-radius: 8px;
                    display: flex;
                    height: 16px;
                    width: 100%;
                    margin: 4px 0;

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
                grid-column: 1;
                width: 100%;
                height: 100%;
                flex-grow: 1;
                background-color: #000;
                color: #fff;
                padding: 0 16px 0 0;
                display: flex;
                text-align: left;
                flex-direction: column;
                line-height: 1.5em;
            }

            .avatar {
                grid-row-start: 1;
                grid-row-end: 2;
                grid-column: 2;
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

                        &:hover {
                            background-color: #000;
                        }

                        &.sticky {
                            margin: 0;
                            position: absolute;
                            left: 0;
                            height: 32px;
                            width: 100%;
                            font-size: 16px;
                            z-index: 999;
                        }
                    }
                }

                img {
                    flex-shrink: 1;
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
                min-width: 64px;
                display: flex;
                height: 32px;
                flex-direction: column;
                align-items: center;
                // border-radius: 32px;
                justify-content: center;
                margin-left: 8px;

                p {
                    color: #ddd;
                    font-weight: 800;
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

@media screen and (max-width: 1360px) {

    .view.applet-launcher .launcher .brief {
        grid-template-columns: 1fr 288px;
    }

    .view.applet-launcher .launcher .brief>p {
        padding: 0 16px;
        margin-top: 0;
        font-size: 48px;
    }

    .view.applet-launcher .launcher .brief .placeholder {
        margin-top: 0;
    }

    .view.applet-launcher .launcher .brief .avatar {
        padding: 16px;
    }

    .view.applet-launcher .launcher .brief .brief-info {
        padding: 16px;
    }

    .view.applet-launcher .launcher .tags {
        padding: 0 16px;
    }

    .view.applet-launcher .launcher .showdown-viewer {
        padding: 16px;
    }

}

@media screen and (max-width: 600px) {
    .view.applet-launcher .launcher .brief {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }

    .view.applet-launcher .launcher .brief>p {
        margin-top: 16px;
        grid-row: 1;
        grid-column: 1;
        font-size: 32px;
    }

    .view.applet-launcher .launcher .brief .placeholder {
        display: none;
    }

    .view.applet-launcher .launcher .brief .brief-info {
        padding-top: 0;
        grid-row: 3;
        grid-column: 1;
        text-align: justify;
    }

    .view.applet-launcher .launcher .brief .avatar {
        grid-row-start: 2;
        grid-row-end: 2;
        grid-column: 1;
        padding-bottom: 0;

        .button.launch {
            margin-top: 8px;
        }
    }

    .view.applet-launcher .launcher .document-placeholder {
        display: none;
    }

}
</style>