import Vue from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'

Vue.config.productionTip = false

Vue.component('TextView', () => import('./components/TextView.vue'))
Vue.component('ImageView', () => import('./components/ImageView.vue'))
Vue.component('Showdown', () => import('./components/Showdown.vue'))
Vue.component('ThreeRenderer', () => import('./components/ThreeRenderer.vue'))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
