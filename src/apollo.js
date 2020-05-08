import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_URL
})

const authHeader = auth => {
  if (auth.accessToken) {
    return { headers: { authorization: `Bearer ${auth.accessToken}` } }
  }
  return { headers: {} }
}

const getAccessToken = () => {
  const auth = Vue.prototype.$auth
  return new Promise((resolve, reject) => {
    if (!auth.loading) {
      resolve(authHeader(auth))
    }

    // Watch for the loading property to change before we check accessToken
    auth.$watch('loading', loading => {
      if (loading === false) {
        resolve(authHeader(auth))
      }
    })
  })
}

const middlewareLink = setContext(async () => {
  const token = await getAccessToken()
  // console.log(token)
  return token
})

const httpAuthLink = middlewareLink.concat(httpLink)

const client = new ApolloClient({
  link: httpAuthLink,
  cache: new InMemoryCache({
    addTypename: true,
    freezeResults: true
  }),
  assumeImmutableResults: true,
  connectToDevTools: process.env.NODE_ENV === 'development'
})

const provider = new VueApollo({
  defaultClient: client,
  defaultOptions: {
    $query: {
      fetchPolicy: 'cache-and-network'
    }
  },
  errorHandler (error) {
    console.log(error)
  }
})

Vue.use(VueApollo)

export default provider
