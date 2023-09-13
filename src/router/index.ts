import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { isObject, isString, map, uniqBy } from "lodash"
import config from './config.yaml'
console.log(config)

export enum EAppletCategory {
  Default = 'default',
  Service = 'service',
  Experimental = 'experimental',
  Package = 'package',
}

const components = {
  AppletLauncher: () => import('../views/AppletLauncher.vue'),
  Home: () => import('../views/Home.vue'),
  WebFrame: () => import('../views/WebFrame.vue'),
  ModelViewer3D: () => import('../views/ModelViewer3D.vue'),
  SearchResult: () => import('../views/SearchResult.vue'),
  PolarPictureTool: () => import('../views/applets/PolarPictureTool.vue'),
  DirectoryExplorer: () => import('../views/DirectoryExplorer.vue'),
}

Vue.use(VueRouter)

let applets = config.applets as IAppletMetadata[]

applets.forEach((d, i) => {
  d.index = i
  if (isString(d.route.component)) {
    console.log(d.route.component)
    d.route.component = components[d.route.component]
    if (d.props) {
      for (let key in d.props) {
        if (isObject(d.props[key])) {
          d.props[key] = JSON.stringify(d.props[key])
        }
      }
    }
  }
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