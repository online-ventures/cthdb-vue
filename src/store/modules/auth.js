import auth0 from 'auth0-js'

const webAuth = new auth0.WebAuth({
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  redirectUri: `${window.location.origin}/callback`,
  clientID: process.env.VUE_APP_AUTH0_CLIENT_ID,
  responseType: 'token id_token',
  scope: 'openid profile email',
  audience: 'https://cth-api.wov.io'
})

const localStorageKey = 'loggedIn'

const state = () => {
  return {
    idToken: null,
    expiry: null,
    profile: {},
    accessToken: null,
    status: '',
    renewing: false
  }
}

const getters = {
  isAuthenticated: state => {
    return (
      Date.now() < state.expiry &&
      localStorage.getItem(localStorageKey) === 'true'
    )
  },

  isIdTokenValid: state => {
    return state.idToken && state.expiry && Date.now() < state.expiry
  }
}

const mutations = {
  CLEAR_AUTH (state) {
    state.idToken = null
    state.expiry = null
    state.profile = {}
    state.accessToken = null
  },
  SET_AUTH (state, auth) {
    state.idToken = auth.idToken
    state.expiry = auth.expiry
    state.profile = auth.profile
    state.accessToken = auth.accessToken
  },
  SET_AUTH_STATUS (state, status) {
    state.status = status
    if (status !== 'error') {
      state.error = null
    }
  },
  SET_AUTH_ERROR (state, error) {
    state.error = error
    state.status = 'error'
  },
  SET_TOKEN_RENEWAL (state, renewal) {
    state.tokenRenewal = renewal
  },
  SET_RENEWING (state, renewing) {
    state.renewing = renewing
  },
  SET_USER (state, user) {
    state.user = user
  }
}

const actions = {
  login ({ commit }, customState) {
    commit('SET_AUTH_STATUS', 'authorizing')
    webAuth.authorize({
      appState: customState
    })
  },

  logout ({ commit }) {
    localStorage.removeItem(localStorageKey)
    commit('CLEAR_AUTH')
    commit('SET_AUTH_STATUS', 'logout')
    webAuth.logout({
      returnTo: `${window.location.origin}`
    })
  },

  handleAuthentication ({ commit, dispatch }) {
    webAuth.parseHash((err, authResult) => {
      if (err) {
        commit('SET_AUTH_ERROR', err)
      } else {
        dispatch('localLogin', authResult)
      }
    })
  },

  localLogin ({ commit, dispatch }, authResult) {
    const auth = {
      idToken: authResult.idToken,
      accessToken: authResult.accessToken,
      expiry: new Date(authResult.idTokenPayload.exp * 1000),
      profile: authResult.idTokenPayload
    }

    commit('SET_AUTH', auth)
    commit('SET_AUTH_STATUS', 'authenticated')

    localStorage.setItem(localStorageKey, 'true')

    console.log(auth)
    dispatch('scheduleRenewal')
  },

  cacheUser ({ commit }, user) {
    commit('SET_USER', user)
  },

  renewTokens ({ state, getters, commit, dispatch }, required = false) {
    return new Promise((resolve, reject) => {
      if (getters.isIdTokenValid) {
        resolve(state.accessToken)
        return
      }

      if (localStorage.getItem(localStorageKey) !== 'true') {
        commit('SET_AUTH_ERROR', 'Not logged in')
        reject(new Error('not logged in'))
        return
      }

      webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          commit('SET_AUTH_ERROR', err)
          if (required) {
            dispatch('login')
          }
          reject(err)
        } else {
          dispatch('localLogin', authResult)
          resolve(state.accessToken)
        }
      })
    })
  },

  scheduleRenewal ({ state, commit, dispatch }) {
    const delay = state.expiry - Date.now()
    if (delay > 0) {
      const renewal = setTimeout(() => { dispatch('renewTokens') }, delay)
      commit('SET_TOKEN_RENEWAL', renewal)
    }
  }
}

export default {
  // namespaced: true,
  state,
  getters,
  mutations,
  actions
}
