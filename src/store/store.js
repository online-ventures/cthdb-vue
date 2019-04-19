import Vue from 'vue'
import Vuex from 'vuex'
import ShowService from '@/services/ShowService.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shows: []
  },
  mutations: {
    SET_SHOWS (state, shows) {
      state.shows = shows
    }
  },
  actions: {
    fetchShows ({ commit }) {
      ShowService.getShows()
        .then(response => {
          commit('SET_SHOWS', response.data)
        })
        .catch(error => {
          console.log('There was an error: error.response')
        })
    }
  }
})
