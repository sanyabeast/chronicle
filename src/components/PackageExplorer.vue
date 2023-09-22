<template>
    <div class="package-explorer" ref="root">
        <div class="files" v-if="package_data">
            <a class="file" v-for="(item, index) in package_data" :key="`file_${index}`" :title="item[1]" target="_blank"
                :data-file-type="detect_file_type(item[1])" :href="item[1]">
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
    Mail = 'mail',
    GoogleLink = 'google-link',
    Markdown = 'markdown',
    GithubRepo = 'github-repo',
    WikipediaArticle = 'wikipedia-article',
    SketchfabModel = 'sketchfab-model',
    AndroidApk = 'android-apk',
    WindowsExe = 'windows-exe',
    MacosDMG = 'macos-dmg',
    LocalFile = 'local-file',
    PythonScript = 'python-script',
}

export default mixins(BaseComponent).extend({
    name: "PackageExplorer",
    components: { Showdown, ImageView },
    data() {
        return {};
    },
    mounted() {

    },
    watch: {
        package() {

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

            if (url.startsWith('mailto:')) {
                return EFileType.Mail;
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

            if (url.includes('google.com')) {
                return EFileType.GoogleLink;
            }

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

            if (url.endsWith('.dmg')) {
                return EFileType.MacosDMG;
            }

            if (url.endsWith('.py')) {
                return EFileType.PythonScript;
            }

            if (url.startsWith('assets/')) {
                return EFileType.LocalFile;
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
                case EFileType.Mail: {
                    return 'assets/icons/file_mailto_01.png'
                }
                case EFileType.PythonScript: {
                    return 'assets/icons/file_python_01.png'
                }
                case EFileType.GoogleLink: {
                    return 'assets/icons/file_google_01.png'
                }
                case EFileType.GithubRepo: {
                    return 'assets/icons/file_github_01.png'
                }
                case EFileType.WindowsExe:
                case EFileType.AndroidApk:
                case EFileType.MacosDMG: {
                    return 'assets/icons/file_windows_app_01.png'
                }
                case EFileType.LocalFile: {
                    return 'assets/icons/file_local_01.png'
                }
                // case EFileType.GithubRepo: {
                //     return 'assets/icons/file_github_01.png'
                // }
                default: {
                    return 'assets/icons/file_unknown_03.png'
                }
            }
        },
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
        display: grid;
        grid-column-gap: 8px;
        grid-row-gap: 8px;
        grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));

        .file {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            height: 56px;
            color: #fff;
            padding: 0 16px;
            background: rgb(13, 13, 13);
            border: 1px solid #262626;
            overflow: hidden;
            position: relative;
            text-decoration: none;

            .image-view {
                width: 32px;
                height: 32px;
                margin-right: 16px;
                background-color: #000;
            }

            .data {
                flex-shrink: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                height: 100%;
                overflow: hidden;

                .title {
                    font-weight: bold;
                    margin: 0;
                    overflow: hidden;
                    max-width: 80%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    flex-shrink: 1;
                    text-decoration: none;
                }

                .path {
                    margin: 0;
                    margin-top: -8px;
                    color: #aaa;
                    overflow: hidden;
                    max-width: 80%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: @font-size-xs;
                    flex-shrink: 1;
                    text-decoration: none;
                }
            }

            &:after {
                content: "";
                background-color: rgb(255, 255, 255);
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

            &[data-file-type="github-repo"] {
                border-color: #683493;
            }
        }
    }

}

@media screen and (max-width: 1400px) {}

@media screen and (max-width: 600px) {}
</style>