import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'
import WebFrame from '../views/WebFrame.vue'
import SearchResult from '../views/SearchResult.vue'
import AsciiGif from "../components/AsciiGif.vue"
import PolarPictureTool from "../views/applets/PolarPictureTool.vue"
import SoloCGOL from "../views/applets/SoloCGOL.vue"
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
    tags: [],
    title: "",
    noindex: true
  },
  {
    route: webframe_route,
    tags: [],
    title: "",
    noindex: true
  },
  {
    route: {
      path: '/search-result/:query',
      name: 'search-result',
      component: SearchResult,
      props: true
    },
    title: "",
    tags: [],
    noindex: true
  },
  // {
  //   route: {
  //     path: '/applet/emoji-select',
  //     name: 'applet/emoji-select',
  //     component: EmojiSelect,
  //     props: true
  //   },
  //   tags: ['emoji'],
  //   title: "",
  //   preview: 'assets/preview/emoji_selection_a1.png',
  // },
  // {
  //   route: {
  //     path: '/applet/emoji-select',
  //     name: 'applet/emoji-select',
  //     component: EmojiSelect,
  //     props: true
  //   },
  //   tags: ['emoji'],
  //   title: "",
  //   preview: 'assets/preview/emoji_selection_a1.png',
  //   props: {
  //     category: "Smileys & Emotion"
  //   },
  // },
  // oldies
  {
    route: webframe_route,
    tags: ['extras', 'experiment', 'voxels', 'procedural', 'three'],
    title: 'Brickscape [Demo]',
    preview: 'assets/preview/hexworld_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/brickscape/dist/index.html'
    }
  },
  {
    route: webframe_route,
    tags: ['game', 'old'],
    title: 'Match3',
    preview: 'assets/preview/match3_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/match3/'
    }
  },
  {
    route: webframe_route,
    tags: ['game', 'old'],
    title: 'Forest Lads [Demo]',
    preview: 'assets/preview/forestlads_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/forestlads/dist/index.html'
    }
  },
  {
    route: webframe_route,
    tags: ['game', 'old'],
    title: 'Telechart',
    preview: 'assets/preview/telechart_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/telechart/'
    }
  },
  {
    route: webframe_route,
    tags: ['game', 'old'],
    title: 'Hill Rider [Demo]',
    preview: 'assets/preview/coderider_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/coderider/dist/index.html'
    }
  },
  {
    route: webframe_route,
    tags: ['extras', 'game', 'engine'],
    title: 'Retro Engine [Demo]',
    preview: 'assets/preview/retro_engine_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/retro/dist/demo_alt/'
    }
  },
  {
    route: webframe_route,
    tags: ['extras', 'experiment'],
    title: 'Euphoria [Demo]',
    preview: 'assets/preview/euphoria_da1.png',
    props: {
      url: 'https://sanyabeast.github.io/euphoria/dist/index.html'
    }
  },
  {
    route: webframe_route,
    tags: ['extras', 'commercial', 'chart', 'plot', 'three', 'gl'],
    title: 'Plot3 [Demo]',
    preview: 'assets/preview/plot_a1.png',
    props: {
      url: 'projects/plot/index.html'
    }
  },
  {
    route: webframe_route,
    tags: ['extras', 'retro', 'unity', 'game'],
    title: 'Middlenight [Demo]',
    preview: 'assets/preview/middlenight_a1.png',
    props: {
      url: 'projects/middlenight/index.html'
    }
  },
  {
    route: {
      path: '/applet/polar-picture-tool/:image',
      name: 'applet/polar-picture-tool',
      component: PolarPictureTool,
      props: true
    },
    tags: ['experiment', 'tool', 'image', 'polar', 'math', 'three', 'gl'],
    title: 'Polar Picture Tool',
    preview: 'assets/preview/polar_image_a1.png',
    props: {
      image: 'random'
    }
  },
  {
    route: {
      path: '/applet/sololearn-conways-game-of-life/',
      name: 'applet/sololearn-conways-game-of-life',
      component: SoloCGOL,
      props: true
    },
    tags: ['experiment'],
    title: 'Conways Game of Life [SoloLearn]',
    preview: 'assets/preview/polar_image_a1.png',
    props: {
    }
  }
]

function get_routes_config(): Array<RouteConfig> {
  return map(uniqBy(applets, it => it.route.name), (d) => d.route)
}

export const router = new VueRouter({
  routes: get_routes_config()
})