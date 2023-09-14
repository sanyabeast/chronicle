<template>
    <div class="package-explorer" ref="root">
        <div class="content" v-if="package_data">
            <h1 v-if="package_data.title" v-html="`/ ${package_data.title} /`"></h1>
            <div class="summary">
                <ImageView v-if="package_data.avatar" :src="package_data.avatar" class="avatar" />
                <div class="main">
                    <TextView v-if="package_data.summary" :src="package_data.summary" />
                    <div class="files" v-if="package_data.files">
                        <div class="file" v-for="(item, index) in package_data.files" :key="`file_${index}`">
                            <a v-html="item[0]" :href="item[1]"></a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
  
<script lang="ts">

import mixins from 'vue-typed-mixins'
import Showdown from '@/components/Showdown.vue';
import BaseComponent from '@/components/BaseComponent.vue';
import ImageView from '@/components/ImageView.vue';
import { packages } from '@/router';


export default mixins(BaseComponent).extend({
    name: "PackageExplorer",
    components: { Showdown, ImageView },
    data(): IPackageData {
        return {
            package_data: null,
        };
    },
    mounted() {
        this.update_data()
    },
    watch: {
        package_id() {
            this.update_data()
        }
    },
    computed: {},
    props: {
        package_id: null
    },
    methods: {
        update_data() {
            if (this.package_id) {
                this.package_data = packages[this.package_id]
            }

        }
    }
})

</script>
<style lang="less">
.package-explorer {
    overflow: hidden;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;

    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr;
    grid-template-rows: 64px 200px 1fr;

    h1 {
        font-size: 32px;
    }

    .summary {
        display: grid;
        grid-gap: 24px;
        grid-template-columns: 200px 1fr;
        grid-template-rows: 1fr;
        padding-bottom: 32px;

        .image-view {
            align-self: flex-start;
            padding: 8px;
        }

        .text-view {
            line-height: 2em;
            padding-right: 64px;

            p {
                margin: 0;
            }
        }

        .files {
            padding-top: 32px;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-items: flex-start;

            .file {
                padding: 8px 32px;
                border: 1px solid #7f7f7f;
                margin: 8px 0;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                background-color: #0c0c0c;

                a {
                    color: #fff;
                    text-decoration: none;
                    font-size: 24px;
                    background-color: #000;
                }

                &:hover {
                    border-color: red;

                    a {
                        color: red;
                    }
                }
            }
        }
    }


}

@media screen and (max-width: 1400px) {
    .package-explorer {
        padding: 16px;

        .summary {
            .image-view {
                padding-left: 0;
                padding-right: 0;
                border: none;
            }
        }
    }



}

@media screen and (max-width: 600px) {
    .package-explorer .summary {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        grid-gap: 16px;

        .image-view {
            align-self: center;
        }

        .text-view {
            line-height: 2em;
            padding-right: 0;

            p {
                margin: 0;
            }
        }

        .files {
            padding: 0;
            margin-top: 32px;
            flex-direction: column;

            .file {
                margin: 8px 0;
            }
        }
    }
}
</style>