import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { isArray, isObject, isString, map, uniqBy } from "lodash"
import config from '@/router/config.yaml'
import { to_snake_case } from '@/tools'

export enum EAppletCategory {
  Project = 'project',
  Demo = 'demo',
  Lab = 'lab',
  Service = 'service',
  Package = 'package',
  Article = 'article'
}

const components = {
  AppletLauncher: () => import('../views/AppletLauncher.vue'),
  AboutPage: () => import('../views/AboutPage.vue'),
  WebFrame: () => import('../views/WebFrame.vue'),
  ModelViewer3D: () => import('../views/ModelViewer3D.vue'),
  AppletsCatalog: () => import('../views/AppletsCatalog.vue'),
  PolarPictureTool: () => import('../views/applets/PolarPictureTool.vue'),
  ShaderView: () => import('../views/applets/ShaderView.vue')
}

Vue.use(VueRouter)

let applets = config.applets as IAppletData[]

applets.forEach((d, i) => {
  d.index = to_snake_case(d.title);
  if (isString(d.route.component)) {
    d.route.component = components[d.route.component]
    if (d.props) {
      for (let key in d.props) {
        if (isObject(d.props[key])) {
          d.props[key] = JSON.stringify(d.props[key])
        }
      }
    }
  }

  if (isArray(d.package)) {
    config.packages[d.index] = d.package
    d.package = d.index
  }
})

function get_routes_config(): Array<RouteConfig> {
  return map(uniqBy(applets, it => it.route.name), (d) => d.route)
}

const router = new VueRouter({
  routes: get_routes_config()
})

export const urls = config.urls
export const packages = config.packages
export const shaders = config.shaders

export {
  applets,
  router
}