
import { package_data } from '@/extra/package_data'

import Vue from 'vue'
import Vuex from 'vuex'
import { router } from '@/router'

Vue.use(Vuex)

function need_show_cookie() {
  if (!window.localStorage) {
    return false;
  } else {
    let result = localStorage.getItem('cookie')
    if (result !== null) {
      return false;
    } else {
      return true;
    }
  }
}

export default new Vuex.Store({
  state: {
    search_query: "",
    package_data: package_data,
    focus_search_on_keydown: true,
    show_cookie: need_show_cookie()
  },
  getters: {
  },
  mutations: {
    no_cookie(state) {
      state.show_cookie = false
      if (window.localStorage) {
        window.localStorage.setItem('cookie', "false");
      }
    },
    search_query(state, new_value) {
      state.search_query = new_value
    },
    route_push(store, params) {
      console.log(`routing to "${params.name}, props: ${JSON.stringify(params.props, null, '\t')}`)
      if (router.currentRoute.name == params.name) {
        console.log(`skipping redundant ndavigation to "${params.name}"`)
        return
      }

      console.log(`routing (push) to "${params.name}, props: ${JSON.stringify(params.props, null, '\t')}`)
      router.push({
        name: params.name,
        params: params.props
      })
    },
    route_replace(store, params) {
      console.log(`routing (replace) to "${params.name}, props: ${JSON.stringify(params.props, null, '\t')}`)
      if (router.currentRoute.name == params.name) {
        console.log(`skipping redundant ndavigation to "${params.name}"`)
        return
      }

      console.log(`routing to "${params.name}, props: ${JSON.stringify(params.props, null, '\t')}`)
      router.replace({
        name: params.name,
        params: params.props
      })
    },
    route_back(store) {
      console.log(`routing back`)
      router.back()
    }
  },
  modules: {
  }
})
