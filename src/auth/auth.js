import Vue from 'vue'
import router from '@/router'
import createAuth0Client from '@auth0/auth0-spa-js'
import jwtDecode from 'jwt-decode'
import CURRENT_USER from '@/graphql/users/current.gql'
import INSERT_USER from '@/graphql/users/insert.gql'

let instance

/** Returns the current instance of the SDK */
export const getInstance = () => instance

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = options => {
  if (instance) return instance

  // The 'instance' is simply a Vue object
  instance = new Vue({
    apolloProvider: options.apollo,

    data () {
      return {
        loading: true,
        accessToken: null,
        authId: null,
        user: null,
        roles: [],
        emailVerified: false,
        auth0Client: null,
        auth0User: null,
        error: null,
        debug: false
      }
    },

    computed: {
      completed () {
        return !this.loading && (!this.accessToken || this.user)
      }
    },

    apollo: {
      user: {
        query: CURRENT_USER,
        skip () {
          return this.authId === null
        },
        variables () {
          return { authId: this.authId }
        },
        update ({ users }) {
          if (users) {
            const user = users[0]
            if (this.$sentry && user) {
              this.$sentry.setUser({
                id: user.id,
                username: user.name,
                email: user.email
              })
            }
            return user
          }
        },
        error (error) {
          if (error.message.match('JWTIssuedAtFuture')) {
            console.log('The JWT is issued at future again.')
          }
        }
      }
    },

    methods: {
      getUser () {
        return this.auth0Client.getUser()
      },
      // Authenticates the user using the redirect method
      // Passes returnTo url to auth0 app state
      login (path = null) {
        const returnTo = path || router.currentRoute.path
        const options = { appState: { returnTo } }
        return this.auth0Client.loginWithRedirect(options)
      },
      // Get access token; if invalid or missing, a new one is retrieved
      getTokenSilently (o) {
        return this.auth0Client.getTokenSilently(o)
      },
      // Logs user out and removes their session on the authorization server
      logout (o) {
        if (this.$sentry) this.$sentry.setUser(null)
        return this.auth0Client.logout(o)
      },
      has (role) {
        return this.roles.includes(role) || this.roles.includes('admin')
      },
      userData (auth0User) {
        return {
          auth_id: auth0User.sub,
          nickname: auth0User.nickname,
          name: auth0User.name,
          email: auth0User.email,
          picture: auth0User.picture,
          last_login: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }
      },
      async loadRoles () {
        const decoded = await jwtDecode(this.accessToken)
        const claimsKey = 'https://hasura.io/jwt/claims'
        if (!decoded || !decoded[claimsKey]) return []
        return decoded[claimsKey]['x-hasura-allowed-roles']
      },
      updateDb () {
        if (this.debug) console.log('updating db')
        return this.$apollo.mutate({
          mutation: INSERT_USER,
          variables: this.userData(this.auth0User)
        })
      },
      onRedirectCallback (appState = {}) {
        const path = appState.returnTo || '/'
        router.push({ path: path })
      },
      async authenticate (options = {}) {
        if (this.debug) console.log('authenticating')
        this.accessToken = await this.getTokenSilently()
        if (this.accessToken) {
          if (this.debug) console.log('Retreived access token')

          if (this.debug) console.log('loading roles')
          this.roles = await this.loadRoles()
          if (this.has('staff')) {
            // We disable the cache if they can make changes.
            this.$apollo.query.fetchPolicy = 'no-cache'
          }

          if (this.debug) console.log('getting auth0 user')
          this.auth0User = await this.auth0Client.getUser()

          this.emailVerified = this.auth0User.email_verified
          if (this.debug) console.log(this.auth0User)
        }
      },
      async reAuthenticate () {
        this.loading = true
        this.accessToken = null
        this.auth0User = null
        this.roles = []
        this.emailVerified = false
        await this.authenticate()
        this.loading = false
        return this.accessToken
      }
    },

    /** Use this lifecycle method to instantiate the SDK client */
    async created () {
      if (this.debug) console.log('auth starting')
      // Create a new instance of the SDK client using members of the given options object
      this.auth0Client = await createAuth0Client({
        domain: process.env.VUE_APP_AUTH0_DOMAIN,
        redirect_uri: `${window.location.origin}/callback`,
        client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
        audience: process.env.VUE_APP_AUTH0_AUDIENCE
      })
      if (this.debug) console.log('created client')

      let loginRedirect = false
      try {
        // If the user is returning to the app after authentication
        if (
          window.location.search.includes('code=') &&
          window.location.search.includes('state=')
        ) {
          loginRedirect = true
          // handle the redirect and retrieve tokens
          if (this.debug) console.log('handling redirect')
          const { appState } = await this.auth0Client.handleRedirectCallback()
          await this.authenticate()
          this.onRedirectCallback(appState)
        } else {
          await this.authenticate()
        }
      } catch (e) {
        console.log(e)
        this.error = e
        if (e.message === 'Invalid state') this.onRedirectCallback()
      }
      if (this.debug) console.log('auth complete')
      this.loading = false

      // If we successfully logged in do some database operations
      if (this.auth0User) {
        // Update the user record
        if (loginRedirect) await this.updateDb()

        // Load the user record
        this.authId = this.auth0User.sub
      }
    }
  })

  return instance
}

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
  install (Vue, options) {
    Vue.prototype.$auth = useAuth0(options)
  }
}
