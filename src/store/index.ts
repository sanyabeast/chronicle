import Vue from 'vue'
import Vuex from 'vuex'

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
    }
  },
  actions: {
  },
  modules: {
  }
})
