
import { package_data } from '@/extra/package_data'

import Vue from 'vue'
import Vuex from 'vuex'
import { router } from '@/router'

Vue.use(Vuex)

function is_mobile_device() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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
    show_cookie: need_show_cookie(),
    is_mobile_device: is_mobile_device()
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
  },
  modules: {
  }
})
