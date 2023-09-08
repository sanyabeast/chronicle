import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { map, uniqBy } from "lodash"

// applets
import EmojiSelect from '../views/applets/EmojiSelect.vue'
import { applets } from './applets'

Vue.use(VueRouter)

applets.forEach((d, i) => {
  d.index = i
})

function get_routes_config(): Array<RouteConfig> {
  return map(uniqBy(applets, it => it.route.name), (d) => d.route)
}

const router = new VueRouter({
  routes: get_routes_config()
})

export {
  applets,
  router
}