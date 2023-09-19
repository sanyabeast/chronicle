<template>
    <div class="package-explorer" ref="root">
        <div class="files" v-if="package_data">
            <a class="file" v-for="(item, index) in package_data.files" :key="`file_${index}`" :title="item[1]"
                target="_blank" :data-file-type="detect_file_type(item[1])" :href="item[1]">
                <ImageView :src="get_file_type_icon(detect_file_type(item[1]))" />
                <div class="data">
                    <p class="title" v-html="item[0]"></p>
                    <p class="path" v-html="item[1]"></p>
                </div>
            </a>
        </div>
    </div>
</template>
  
<script lang="ts">

import mixins from 'vue-typed-mixins'
import Showdown from '@/components/Showdown.vue';
import BaseComponent from '@/components/BaseComponent.vue';
import ImageView from '@/components/ImageView.vue';
import { packages } from '@/router';
import { get, isString } from 'lodash';

export enum EPackageExplorerMode {
    Default,
    Lite
}

export enum EFileType {
    Link = 'link',
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    Text = 'text',
    Markdown = 'markdown',
    GithubRepo = 'github-repo',
    WikipediaArticle = 'wikipedia-article',
    SketchfabModel = 'sketchfab-model',
    AndroidApk = 'android-apk',
    WindowsExe = 'windows-exe',
}

export default mixins(BaseComponent).extend({
    name: "PackageExplorer",
    components: { Showdown, ImageView },
    data() {
        return {};
    },
    mounted() {
        this.update_data()
    },
    watch: {
        package() {
            this.update_data()
        }
    },
    computed: {
        package_data() {
            return get(packages, this.package, null)
        }
    },
    props: {
        package: null,
        mode: {
            type: Number,
            default: EPackageExplorerMode.Default
        }
    },
    methods: {
        detect_file_type(url: string): EFileType {
            if (!isString(url)) {
                throw new Error('url is not a string')
            }

            console.dir(url)
            let result = EFileType.Link

            if (url.endsWith('.md')) {
                return EFileType.Markdown;
            }

            if (url.endsWith('.txt')) {
                return EFileType.Text;
            }

            if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif')) {
                return EFileType.Image;
            }

            if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')) {
                return EFileType.Video;
            }

            if (url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.ogg')) {
                return EFileType.Audio;
            }

            if (url.endsWith('.apk')) {
                return EFileType.AndroidApk;
            }

            if (url.endsWith('.exe')) {
                return EFileType.WindowsExe;
            }

            if (url.includes('github.com')) {
                return EFileType.GithubRepo;
            }

            if (url.includes('wikipedia.org')) {
                return EFileType.WikipediaArticle;
            }

            if (url.includes('sketchfab.com')) {
                return EFileType.SketchfabModel;
            }

            return result
        },
        get_file_type_icon(type: EFileType): string {
            switch (type) {
                case EFileType.Text: {
                    return 'assets/icons/file_txt_01.png'
                }
                case EFileType.Markdown: {
                    return 'assets/icons/file_markdown_01.png'
                }
                case EFileType.Image: {
                    return 'assets/icons/file_image_01.png'
                }
                case EFileType.Video: {
                    return 'assets/icons/file_video_01.png'
                }
                case EFileType.Audio: {
                    return 'assets/icons/file_audio_01.png'
                }
                // case EFileType.GithubRepo: {
                //     return 'assets/icons/file_github_01.png'
                // }
                default: {
                    return 'assets/icons/file_unknown_03.png'
                }
            }
        },
        update_data() {
            if (this.package) {
                this.package_data = packages[this.package]
            }

        }
    }
})


</script>
<style lang="less">
@import url('@/assets/index.less');

.package-explorer {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    h1 {
        font-size: @font-size-l;
    }

    .files {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        .file {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            justify-content: flex-start;
            min-height: 48px;
            color: #fff;
            margin-bottom: 8px;
            padding: 0 8px;
            background: rgb(0, 0, 0);
            background: linear-gradient(100deg, rgba(0, 0, 0, 1) 0%, rgba(46, 46, 46, 1) 100%);
            border: 1px solid #262626;
            overflow: hidden;
            position: relative;

            &:after {
                content: "";
                background-color: rgb(255, 0, 0);
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
            }

            &:hover {
                &:after {
                    opacity: 0.1;
                }
            }

            &[data-file-type="text"] {
                // background-color: #242020;
            }

            &[data-file-type="markdown"] {
                // background-color: #282525;
            }


            &[data-file-type="image"],
            &[data-file-type="video"],
            &[data-file-type="audio"] {
                background: rgb(0, 0, 0);
                background: linear-gradient(100deg, rgba(0, 0, 0, 1) 0%, rgba(52, 42, 55, 1) 100%);
            }

            &[data-file-type="link"] {
                // background-color: #242328;
            }

            .image-view {
                width: 32px;
                height: 32px;
                margin-right: 16px;
                background-color: #000;
            }

            .data {
                flex-grow: 1;
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                height: 100%;

                .title {
                    font-weight: bold;
                    margin: 0;
                    overflow: hidden;
                    max-width: 33%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .path {
                    color: #aaa;
                    margin: 0;
                    overflow: hidden;
                    max-width: 33%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

}

@media screen and (max-width: 1400px) {}

@media screen and (max-width: 600px) {

    .package-explorer .files .file {
        padding: 8px 16px;
        flex-wrap: nowrap;

        .data {
            flex-wrap: nowrap;
            flex-direction: column;
            align-items: flex-start;
            height: 100%;
        }
    }
}
</style>