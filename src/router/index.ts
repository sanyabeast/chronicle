import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'
import WebFrame from '../views/WebFrame.vue'
import SearchResult from '../views/SearchResult.vue'
import { map, uniqBy } from "lodash"

// applets
import EmojiSelect from '../views/applets/EmojiSelect.vue'

Vue.use(VueRouter)

let webframe_route = {
  path: '/web-frame/:url',
  name: 'web-frame',
  component: WebFrame,
  props: true
};

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
    route: webframe_route,
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
  },
  // oldies
  {
    route: webframe_route,
    name: 'applet/oldies/match3',
    tags: ['game', 'old'],
    title: 'Match3',
    props: {
      url: 'https://sanyabeast.github.io/match3/'
    }
  },
  {
    route: webframe_route,
    name: 'applet/oldies/match3',
    tags: ['game', 'old'],
    title: 'Hill Rider',
    props: {
      url: 'https://sanyabeast.github.io/coderider/dist/index.html'
    }
  },
  {
    route: webframe_route,
    name: 'applet/oldies/match3',
    tags: ['game', 'old'],
    title: 'Telechart',
    props: {
      url: 'https://sanyabeast.github.io/telechart/'
    }
  },
  {
    route: webframe_route,
    name: 'applet/oldies/match3',
    tags: ['game', 'old'],
    title: 'Forest Lads',
    props: {
      url: 'https://sanyabeast.github.io/forestlads/dist/index.html'
    }
  }
]

function get_routes_config(): Array<RouteConfig> {
  return map(uniqBy(applets, it => it.route.name), (d) => d.route)
}

export const router = new VueRouter({
  routes: get_routes_config()
})

