import Vue from 'vue'
import Vuex from 'vuex'
import { router } from '@/router'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    search_query: ""
  },
  getters: {
  },
  mutations: {
    search_query(state, new_value) {
      state.search_query = new_value
    },
    route_push(store, params) {
      console.log(`routing to "${params.name}, props: ${JSON.stringify(params.props, null, '\t')}`)
      if (router.currentRoute.name == params.name){
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
      if (router.currentRoute.name == params.name){
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
