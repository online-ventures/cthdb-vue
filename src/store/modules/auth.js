import auth0 from 'auth0-js'

const localStorage = window.localStorage

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
    user: {}
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
  },

  roles: state => {
    if (!state.user.roles_users) {
      return []
    }
    return state.user.roles_users.map((ru) => ru.role.name)
  },

  can: (state, getters) => permission => {
    if (getters.roles.includes('admin')) {
      return true
    } else if (permission === 'edit-shows') {
      return getters.roles.includes('staff')
    } else if (permission === 'edit-jobs') {
      return getters.roles.includes('staff')
    } else if (permission === 'edit-volunteers') {
      return getters.roles.includes('staff')
    }
    return false
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
  SET_USER (state, user) {
    state.user = user
  }
}

const actions = {
  login ({ state, commit }, customState) {
    if (state.status === 'authorizing') {
      return
    }
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
      returnTo: process.env.VUE_APP_BASE_URL + '/login'
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
    localStorage.setItem(localStorageKey, 'true')

    const auth = {
      idToken: authResult.idToken,
      accessToken: authResult.accessToken,
      expiry: new Date(authResult.idTokenPayload.exp * 1000),
      profile: authResult.idTokenPayload
    }

    commit('SET_AUTH', auth)
    commit('SET_AUTH_STATUS', 'authenticated')

    // console.log(auth)
    dispatch('scheduleRenewal')
  },

  cacheUser ({ commit }, user) {
    commit('SET_USER', user)
  },

  renewTokens ({ state, getters, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      // console.log('renewToken!')

      if (getters.isIdTokenValid) {
        resolve(state.accessToken)
      }

      if (localStorage.getItem(localStorageKey) !== 'true') {
        dispatch('login')
      }

      commit('SET_AUTH_STATUS', 'checking')
      webAuth.checkSession({}, (err, authResult) => {
        if (err) {
          console.log('need to login')
          dispatch('login')
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
