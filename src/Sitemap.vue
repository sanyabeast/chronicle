<template>
    <div id="sitemap">
        <div class="routes">
            <h2>Main</h2>
            <div><a href="/" title="home">Home</a></div>
            <div><a :href="sanyabeast_link" title="mailto">@sanyabeast</a></div>
            <div><a title="github" href="https://github.com/sanyabeast" target="_blank">github</a></div>
            <h2>Places</h2>
            <div class="route" v-for="(item, index) in applets" :key="index">
                <a :href="get_route_url(item)" v-html="item.title || item.route.name"></a>
                <TextView v-if="item.summary" :src="item.summary" />
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">

import ImageLink from './components/ImageLink.vue'
import Cookies from './components/Cookies.vue';
import mixins from 'vue-typed-mixins';
import BaseComponent from './components/BaseComponent.vue';
import TextView from './components/TextView.vue';
import { applets } from './router';

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

    },
    mounted() {
        (window as any).vue_app = this;
    },
    methods: {
        get_route_url(item: IAppletMetadata) {
            return this.$router.resolve({
                name: item.route.name,
                params: item.props
            }).route.path
        }
    }
});

</script>
  
<style lang="less">
html {
    background-color: black;
    color: #fff;
    font-family: monospace;
    line-height: 2em;

    a {
        display: inline-block;
        color: red;
        font-weight: bold;
        text-transform: capitalize;

        &:hover {
            background-color: #fff;
            color: #000;
        }
    }

}
</style>
  