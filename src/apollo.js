import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_URL
})

const authHeader = (auth, queryName) => {
  if (auth.accessToken) {
    const headers = { headers: { authorization: `Bearer ${auth.accessToken}` } }
    // TODO: apply different x-hasura-role for specific operations
    // console.log(queryName)
    return headers
  }
  return { headers: {} }
}

const getAccessToken = request => {
  const auth = Vue.prototype.$auth
  return new Promise((resolve, reject) => {
    if (!auth.loading) {
      resolve(authHeader(auth, request.operationName))
    }

    // Watch for the loading property to change before we check accessToken
    auth.$watch('loading', loading => {
      if (loading === false) {
        resolve(authHeader(auth, request.operationName))
      }
    })
  })
}

const middlewareLink = setContext(async request => {
  const token = await getAccessToken(request)
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
      fetchPolicy: 'cache-first'
    }
  },
  errorHandler (error) {
    console.log(error)
  }
})

Vue.use(VueApollo)

export default provider
