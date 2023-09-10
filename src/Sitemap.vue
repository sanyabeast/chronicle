<template>
    <div id="sitemap">
        <div class="routes">
            <h2>Main</h2>
            <div><a href="/" title="home">Home</a></div>
            <div><a :href="sanyabeast_link" title="mailto">@sanyabeast</a></div>
            <div><a title="github" href="https://github.com/sanyabeast" target="_blank">github</a></div>
            <div>
                <a id="download" href="#" @click="download_as_html">download as html</a>
            </div>
            <h2>Places</h2>
            <div class="route" v-for="(item, index) in applets" :key="index">
                <a :href="get_route_url(item)" v-html="item.title || item.route.name"></a>
                <TextView v-if="item.summary" :src="item.summary" />
            </div>
        </div>
        <footer>
            <p>
                <a :href="sanyabeast_link" title="mailto">@sanyabeast</a> |
                <a href="/" title="home">home</a> |
                <i v-html="get_current_year()"></i> |
                <i id="version" v-html="app_version"></i>

            </p>
        </footer>
    </div>
</template>
  
<script lang="ts">

import ImageLink from './components/ImageLink.vue'
import Cookies from './components/Cookies.vue';
import mixins from 'vue-typed-mixins';
import BaseComponent from './components/BaseComponent.vue';
import TextView from './components/TextView.vue';
import { applets } from './router';
import { download_text_as_file, get_body_html, get_current_year } from './tools';

export default mixins(BaseComponent).extend({
    name: 'Sitemap',
    data() {
        return {
            href: location.host,
            sanyabeast_link: 'mailto:a.gvrnsk@gmail.com?subject=chronicle'
        }
    },
    components: { ImageLink, Cookies, TextView },
    watch: {},
    computed: {
        applets() {
            return applets
        },
        app_version() {
            return `v${this.$store.state.package_data.version}`
        }
    },
    mounted() {
        (window as any).vue_app = this;
    },
    methods: {
        get_current_year: get_current_year,
        download_as_html() {
            let html = get_body_html(["script"])
            download_text_as_file("sitemap_generated.html", html)
        },
        get_route_url(item: IAppletMetadata) {
            let route_path = this.$router.resolve({
                name: item.route.name,
                params: item.props
            }).route.path
            return `/#${route_path}`
        }
    }
});

</script>
  
<style lang="less">
html {
    #sitemap {
        a#download {
            display: flex;
            color: #fff;
            background-color: blue;
        }
    }
}
</style>
  