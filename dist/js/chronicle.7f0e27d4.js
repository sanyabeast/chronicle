(function(){"use strict";var e={1664:function(e,t,r){var s=r(6369),a=function(){var e=this,t=e._self._c;e._self._setupProxy;return t("div",{class:{home:"home"===e.$route.name},attrs:{id:"vue_app"},on:{keydown:e.handle_keydown}},[t("header",[t("router-link",{attrs:{id:"homepage",to:"/",title:"homepage"}},[t("h1",[e._v("home")])]),t("div",{staticClass:"menu"},[t("router-link",{attrs:{id:"search",to:"/search-result",title:"menu"}},[t("h1",{domProps:{innerHTML:e._s(e.search_link_label)}})]),"search-result"===e.$route.name?t("input",{ref:"search_input",attrs:{type:"search",id:"search-input",autocomplete:"off",spellcheck:"false"},domProps:{value:e.$store.state.search_query},on:{focus:e.handle_searchbox_focus,input:e.handle_searchbox_input,blur:e.handle_searchbox_blur}}):e._e(),e.show_clear_search?t("a",{staticClass:"clear_search",attrs:{href:"#",title:"clear search"},on:{click:e.clear_search}}):e._e()],1),e._m(0)],1),t("div",{staticClass:"header-imposter"}),t("main",[t("router-view",{staticClass:"view"}),e.$store.state.show_cookie?t("Cookies"):e._e()],1),t("footer",[t("p",[t("span",{domProps:{innerHTML:e._s(e.getCurrentYear())}}),e._v(" | "),t("b",[e._v("Ukraine")]),e._v(" | prototyped & implemented by "),t("a",{attrs:{href:e.sanyabeast_link,id:"mail",title:"mailto"}},[e._v("@sanyabeast")]),e._v(" | "),t("a",{staticClass:"github",attrs:{title:"github",href:"https://github.com/sanyabeast",target:"_blank"}},[e._v("github")]),e._v(" | "),t("router-link",{attrs:{to:"/",title:"home"},domProps:{innerHTML:e._s(e.href)}}),e._v(" | "),t("a",{attrs:{href:"/sitemap.html",id:"sitemap",title:"sitemap"}},[e._v("sitemap")])],1),t("i",{attrs:{id:"version"},domProps:{innerHTML:e._s(e.app_version)}})]),t("footer",{staticClass:"mobile"},[t("p",[t("span",{domProps:{innerHTML:e._s(e.getCurrentYear())}}),e._v(" | "),t("b",[e._v("Ukraine")]),e._v(" | "),t("a",{attrs:{href:e.sanyabeast_link,title:"github"}},[e._v("@sanyabeast")]),e._v(" | "),t("router-link",{attrs:{to:"/",title:"home"},domProps:{innerHTML:e._s(e.href)}})],1)])])},n=[function(){var e=this,t=e._self._c;e._self._setupProxy;return t("a",{attrs:{id:"quit-link",href:"https://google.com",title:"quit"}},[t("h1",[e._v("quit")])])}],o=r(8540),i=r(3762),u=r(7581),c=r(4026),h=(0,u.Z)(c.Z).extend({name:"App",data(){return{href:location.host,sanyabeast_link:"mailto:a.gvrnsk@gmail.com?subject=chronicle"}},components:{ImageLink:o.Z,Cookies:i.Z},watch:{$route(e,t){if("search-result"===e.name){let e=2e3,t=Date.now(),r=setInterval((()=>{if(this.$refs.search_input){clearInterval(r);let e=this.$refs.search_input;e.focus()}Date.now()-t>e&&clearInterval(r)}),100)}}},computed:{search_link_label(){return"search-result"!==this.$route.name?"menu":this.$store.state.search_query.length>0?"":"menu"},show_search_link(){return"search-result"!==this.$route.name},show_clear_search(){return"search-result"===this.$route.name&&this.$store.state.search_query.length>0},search_query(){return this.$store.state.search_query},app_version(){return`v${this.$store.state.package_data.version}`}},mounted(){window.vue_app=this},methods:{getCurrentYear(){var e=new Date,t=e.getFullYear();return t},handle_searchbox_focus(e){},handle_searchbox_blur(e){},handle_searchbox_input(e){let t=this.$refs.search_input;this.$store.commit("search_query",t.value),this.$router.replace({name:"search-result",query:{query:this.search_query}})},clear_search(){this.$store.commit("search_query",""),this.$router.replace({name:"search-result",query:{query:this.search_query}})},goto_home(){this.$store.state.search_query=""},handle_keydown(){this.$store.state.focus_search_on_keydown&&this.$refs.search_input&&this.$refs.search_input.focus()},exit_app(){window.open("https://google.com","_self")}}}),l=h,_=r(1001),p=(0,_.Z)(l,a,n,!1,null,null,null),f=p.exports,d=r(7735),m=r(3819);s.ZP.config.productionTip=!1,new s.ZP({router:d.N,store:m.Z,render:e=>e(f)}).$mount("#app")}},t={};function r(s){var a=t[s];if(void 0!==a)return a.exports;var n=t[s]={id:s,loaded:!1,exports:{}};return e[s].call(n.exports,n,n.exports,r),n.loaded=!0,n.exports}r.m=e,function(){var e=[];r.O=function(t,s,a,n){if(!s){var o=1/0;for(h=0;h<e.length;h++){s=e[h][0],a=e[h][1],n=e[h][2];for(var i=!0,u=0;u<s.length;u++)(!1&n||o>=n)&&Object.keys(r.O).every((function(e){return r.O[e](s[u])}))?s.splice(u--,1):(i=!1,n<o&&(o=n));if(i){e.splice(h--,1);var c=a();void 0!==c&&(t=c)}}return t}n=n||0;for(var h=e.length;h>0&&e[h-1][2]>n;h--)e[h]=e[h-1];e[h]=[s,a,n]}}(),function(){r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,{a:t}),t}}(),function(){r.d=function(e,t){for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})}}(),function(){r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){r.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){var e={495:0};r.O.j=function(t){return 0===e[t]};var t=function(t,s){var a,n,o=s[0],i=s[1],u=s[2],c=0;if(o.some((function(t){return 0!==e[t]}))){for(a in i)r.o(i,a)&&(r.m[a]=i[a]);if(u)var h=u(r)}for(t&&t(s);c<o.length;c++)n=o[c],r.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return r.O(h)},s=self["webpackChunkchronicle"]=self["webpackChunkchronicle"]||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))}();var s=r.O(void 0,[998,64],(function(){return r(1664)}));s=r.O(s)})();
//# sourceMappingURL=chronicle.7f0e27d4.js.map