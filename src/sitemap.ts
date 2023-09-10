import Vue from 'vue'
import Sitemap from './Sitemap.vue'
import { router } from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(Sitemap)
}).$mount('#app')
