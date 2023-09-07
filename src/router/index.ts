import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'
import WebFrame from '../views/WebFrame.vue'
import AppletLauncher from '../views/AppletLauncher.vue'
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

let applet_launcher_route = {
  path: '/applet/applet-launcher/:applet',
  name: 'applet/applet-launcher',
  component: AppletLauncher,
  props: true
}

export const applets: IAppletMetadata[] = [
  {
    route: {
      path: '/',
      name: 'home',
      component: Home
    },
    // document: 'assets/md/showdown.md',
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
    // document: 'assets/md/showdown.md',
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
    // document: 'assets/md/showdown.md',
    tags: ['extras', 'experiment', 'voxels', 'procedural', 'three'],
    title: 'Brickscape [Demo]',
    preview: 'assets/preview/hexworld_a1.png',
    summary: `
    The "Minecraft Clone" project, developed with TypeScript and Three.js, is a technical endeavor. It employs instanced mesh rendering and shader code injection to handle a large variety of textured blocks efficiently. The project also features a basic day-night cycle and offers two exploration modes: bird-flight view and first-person view, providing an engaging experience for users interested in 3D graphics and game development.
    `,
    props: {
      url: 'https://sanyabeast.github.io/brickscape/dist/index.html'
    }
  },
  {
    route: webframe_route,
    // document: 'assets/md/showdown.md',
    tags: ['game', 'old'],
    title: 'Match3',
    preview: 'assets/preview/match3_a1.png',
    summary: `
    Around a decade ago, I embarked on a JavaScript experiment - the "Match-3 Game" project. This early project, though admittedly with messy code, holds immense value in my journey. It was my first step into the world of game development, faithfully recreating the classic match-3 puzzle genre. It symbolizes my initial skills and passion, laying the foundation for my future projects and growth.
    `,
    props: {
      url: 'https://sanyabeast.github.io/match3/'
    }
  },
  {
    route: webframe_route,
    // document: 'assets/md/showdown.md',
    tags: ['game', 'old'],
    title: 'Forest Lads [Demo]',
    preview: 'assets/preview/forestlads_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/forestlads/dist/index.html'
    }
  },
  {
    route: webframe_route,
    // document: 'assets/md/showdown.md',
    tags: ['game', 'old'],
    title: 'Telechart',
    summary: `
    The project developed for the "Telegram Charts JavaScript Contest" is a noteworthy technical effort. It introduces a custom rendering engine with abstractions similar to Three.js, including Node, Mesh, Geometry, and Material (ShaderMaterial). The project also integrates rendering loops and the manipulation of DOM objects. Additionally, it includes a developer launcher for creating multiple charts, each with predefined datasets. This project demonstrates advanced technical capabilities in the field of web-based charting and visualization.
    `,
    preview: 'assets/preview/telechart_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/telechart/'
    }
  },
  {
    route: webframe_route,
    // document: 'assets/md/showdown.md',
    tags: ['game', 'old'],
    title: 'Hill Rider [Demo]',
    summary: `
    This project seamlessly combines Three.js for rendering and Matter.js for 2D physics to create a side-view driving experience. It features an infinite, procedurally generated road and allows users to navigate a basic vehicle along this path. This technical achievement showcases the integration of graphics and physics for an engaging, interactive, and dynamic experience.
    `,
    preview: 'assets/preview/coderider_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/coderider/dist/index.html'
    }
  },
  {
    route: webframe_route,
    // document: 'assets/md/showdown.md',
    tags: ['extras', 'game', 'engine'],
    title: 'Retro Engine [Demo]',
    preview: 'assets/preview/retro_engine_a1.png',
    props: {
      url: 'https://sanyabeast.github.io/retro/dist/demo_alt/'
    }
  },
  {
    route: webframe_route,
    // document: 'assets/md/showdown.md',
    tags: ['extras', 'experiment'],
    title: 'Euphoria [Demo]',
    preview: 'assets/preview/euphoria_da1.png',
    props: {
      url: 'https://sanyabeast.github.io/euphoria/dist/index.html'
    }
  },
  {
    route: webframe_route,
    // document: 'assets/md/showdown.md',
    tags: ['extras', 'commercial', 'chart', 'plot', 'three', 'gl'],
    title: 'Plot3 [Demo]',
    preview: 'assets/preview/plot_a1.png',
    props: {
      url: 'projects/plot/index.html'
    }
  },
  {
    route: webframe_route,
    // document: 'assets/md/showdown.md',
    tags: ['extras', 'retro', 'unity', 'game'],
    title: 'Middlenight [Demo]',
    summary: `
    The Unity project is a retro-style top-down game that combines classic gameplay elements with modern features. Players can move, shoot, and collect perks and loot in an immersive environment. The game employs enemy AI with visibility checks and pathfinding using the A-star algorithm, adding depth to the gameplay. The project also showcases advanced GUI development with complex nested mechanisms for an engaging and user-friendly experience.
    `,
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
    document: 'assets/md/showdown.md',
    summary: `
    This applet enables users to apply polar-to-cartesian coordinate transformations to images and vice-versa, with options for downloading the results. 
    `,
    tags: ['experiment', 'tool', 'image', 'polar', 'math', 'three', 'gl'],
    title: 'Polar Picture Tool',
    preview: 'assets/preview/polar_image_a1.png',
    props: {
      image: 'random'
    }
  },
  // {
  //   route: {
  //     path: '/applet/sololearn-conways-game-of-life/',
  //     name: 'applet/sololearn-conways-game-of-life',
  //     component: SoloCGOL,
  //     props: true
  //   },
  //   tags: ['experiment'],
  //   title: 'Conways Game of Life [SoloLearn]',
  //   preview: 'assets/preview/polar_image_a1.png',
  //   props: {
  //   }
  // }
  {
    route: applet_launcher_route,

    tags: ['service'],
    title: 'Applet Launcher',
    preview: 'assets/preview/applet_launcher_a1.png',

    props: {

    },
    noindex: true
  }
]

applets.forEach((d, i) => {
  d.index = i
})

function get_routes_config(): Array<RouteConfig> {
  return map(uniqBy(applets, it => it.route.name), (d) => d.route)
}

export const router = new VueRouter({
  routes: get_routes_config()
})