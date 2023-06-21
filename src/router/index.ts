import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'
import WebFrame from '../views/WebFrame.vue'

Vue.use(VueRouter)

export const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/web-frame',
    name: 'web-frame',
    component: WebFrame,
    props: true
  }
]

console.log(routes)

export const router = new VueRouter({
  routes
})

