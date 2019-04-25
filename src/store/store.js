import Vue from 'vue'
import Vuex from 'vuex'
import vuexORM from './orm'

Vue.use(Vuex)

export default () => new Vuex.Store({
  namespaced: true,
  plugins: [vuexORM],
  state: {
  },
  mutations: {
  },
  actions: {
  }
})
