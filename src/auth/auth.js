import Vue from 'vue'
import router from '@/router'
import createAuth0Client from '@auth0/auth0-spa-js'
import jwtDecode from 'jwt-decode'
import CURRENT_USER from '@/graphql/users/current.gql'
import UPSERT_USER from '@/graphql/users/upsert.gql'
import SET_TENANT from '@/graphql/users/updateTenant.gql'

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
        tokenPayload: null,
        userId: null,
        user: null,
        tenant: null,
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
      },
      tenantId () {
        return this.tenant && this.tenant.id
      }
    },

    apollo: {
      user: {
        query: CURRENT_USER,
        skip () {
          return this.userId === null
        },
        variables () {
          return { id: this.userId }
        },
        update (data) {
          const user = data.users_by_pk
          if (user) {
            if (user.tenant) {
              this.setTenant({
                id: user.tenant.id,
                short_name: user.tenant.short_name,
                name: user.tenant.name,
                max_points_per_show: user.tenant.max_points_per_show
              })
            }
            if (this.$sentry) {
              this.$sentry.setUser({
                id: user.id,
                username: user.name,
                email: user.email
              })
            }
          }
          return user
        },
        error (error) {
          if (error.message.match('JWTIssuedAtFuture')) {
            console.log('The JWT is issued at future again.')
            console.log(this.accessToken)
            console.log('Current time: ' + Date.now())
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
          picture: auth0User.picture
        }
      },
      async decodeJwt () {
        const decoded = await jwtDecode(this.accessToken)
        const claimsKey = 'https://hasura.io/jwt/claims'
        if (!decoded || !decoded[claimsKey]) return []
        this.tokenPayload = decoded[claimsKey]
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
          mutation: UPSERT_USER,
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
          if (this.debug) console.log(this.accessToken)

          if (this.debug) console.log('decode jwt')
          await this.decodeJwt()
          if (this.debug) console.log(this.tokenPayload)

          if (this.debug) console.log('loading roles')
          this.roles = this.tokenPayload['x-hasura-allowed-roles']
          if (this.debug) console.log('Roles: ', this.roles)

          // Query fetch policy is role-based
          if (this.has('staff')) {
            if (this.debug) console.log('Disabling cache')
            this.$apollo.query.fetchPolicy = 'no-cache'
          } else {
            if (this.debug) console.log('Enabling cache')
            this.$apollo.query.fetchPolicy = 'cache-and-network'
          }

          if (this.debug) console.log('getting auth0 user')
          this.auth0User = await this.auth0Client.getUser()

          this.emailVerified = this.auth0User.email_verified
          if (this.debug) console.log(this.auth0User)
        }
      },
      async reAuthenticate () {
        if (this.debug) console.log('Reauthenticating')
        this.loading = true
        this.accessToken = null
        this.auth0User = null
        this.error = null
        this.roles = []
        this.auth0Client = await this.createClient()
        await this.authenticate()
        this.loading = false
        return this.accessToken
      },
      setTenant (tenant) {
        this.$cookies.set('tenant', tenant)
        if (this.debug) console.log('Cookie saved for tenant', tenant)
        this.tenant = tenant
      },
      async saveTenant (tenant) {
        this.setTenant(tenant)
        // Safeguard loading check since this takes several seconds
        if (this.loading || !this.user) return
        await this.$apollo.mutate({
          mutation: SET_TENANT,
          variables: {
            id: this.user.id,
            tenant_id: tenant.id
          }
        })
        if (this.debug) console.log('Tenant saved for user', tenant)
        await this.reAuthenticate()
      },
      createClient () {
        return createAuth0Client({
          domain: process.env.VUE_APP_AUTH0_DOMAIN,
          redirect_uri: `${window.location.origin}/callback`,
          client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
          audience: process.env.VUE_APP_AUTH0_AUDIENCE
        })
      }
    },

    /** Use this lifecycle method to instantiate the SDK client */
    async created () {
      if (this.debug) console.log('auth starting')

      // Load the tenant from the cookie
      this.tenant = this.$cookies.get('tenant')
      if (this.debug) console.log('Tenant: ', this.tenant)

      // Create a new instance of the SDK client using members of the given options object
      this.auth0Client = await this.createClient()
      if (this.debug) console.log('created client')

      if (window.location.pathname === '/login') {
        // Login url support
        this.login()
      } else if (window.location.pathname === '/logout') {
        // Logout url support
        this.logout()
      } else {
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

        this.loading = false
        if (this.debug) console.log('auth complete')

        // If we successfully logged in do some database operations
        if (this.auth0User) {
          // Update the user record
          if (loginRedirect) await this.updateDb()

          // Load the user record
          this.userId = this.tokenPayload['x-hasura-user-id']
        }

        // If there is no tenant set we redirect to tenant selection
        if (!this.tenant && router.currentRoute.name !== 'theatres') {
          router.push({ name: 'theatres' })
        }
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
