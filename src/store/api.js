import JsonApi from 'devour-client'

const url = 'http://localhost:3021'
const api = new JsonApi({ apiUrl: url })

// Shows
api.define('show', {
  name: null,
  'occurredAt': null
})

const state = {
  shows: []
}

const mutations = {
  SET_SHOWS (state, payload) {
    state.shows = payload
  },
  ADD_SHOW (state, show) {
    state.shows.push(show)
  },
  SET_SHOW (state, id, show) {
    const idx = state.shows.findIndex((s) => s.id === id)
    state.shows[idx] = show
  }
}

const actions = {
  fetchShows ({ commit }) {
    api.findAll('show').then((payload) => {
      commit('SET_SHOWS', payload.data)
    }).catch((payload) => {
    })
  },
  addShow ({ commit }, data) {
    commit('ADD_SHOW', data)
  },
  saveShow ({ commit }, id, data) {
    commit('SET_SHOW', id, data)
  }
}

export {
  api,
  state,
  mutations,
  actions
}
