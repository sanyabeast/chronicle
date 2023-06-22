import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'
import WebFrame from '../views/WebFrame.vue'
import SearchResult from '../views/SearchResult.vue'
import { map, uniqBy } from "lodash"

// applets
import EmojiSelect from '../views/applets/EmojiSelect.vue'

Vue.use(VueRouter)

export const applets: IAppletMetadata[] = [
  {
    route: {
      path: '/',
      name: 'home',
      component: Home
    },
    name: 'home',
    tags: [],
    noindex: true
  },
  {
    route: {
      path: '/web-frame',
      name: 'web-frame',
      component: WebFrame,
      props: true
    },
    name: 'web-frame',
    tags: [],
    noindex: true
  },
  {
    route: {
      path: '/search-result/:query',
      name: 'search-result',
      component: SearchResult,
      props: true
    },
    name: 'search-result',
    tags: [],
    noindex: true
  },
  {
    route: {
      path: '/applet/emoji-select',
      name: 'applet/emoji-select',
      component: EmojiSelect,
      props: true
    },
    name: 'emoji-select',
    tags: ['emoji']
  },
  {
    route: {
      path: '/applet/emoji-select',
      name: 'applet/emoji-select',
      component: EmojiSelect,
      props: true
    },
    name: 'emoji-select2',
    tags: ['emoji'],
    props: {
      category: "Smileys & Emotion"
    }
  }
]

function get_routes_config(): Array<RouteConfig> {
  return map(uniqBy(applets, it => it.route.name), (d) => d.route)
}

export const router = new VueRouter({
  routes: get_routes_config()
})

