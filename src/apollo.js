import Vue from 'vue'
import VueApollo from 'vue-apollo'
import store from '@/store/store'
import { split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_URL
})

const getAccessToken = () => {
  // console.log('getting the access token...')
  return new Promise((resolve, reject) => {
    if (store.state.auth.accessToken) {
      resolve(store.state.auth.accessToken)
    } else {
      const unwatch = store.watch(
        (state) => state.auth.accessToken,
        (newValue, oldValue) => {
          unwatch()
          resolve(newValue)
        }
      )
    }
  })
}

const middlewareLink = setContext(async request => {
  const token = await getAccessToken()
  // console.log('got the token')
  return { headers: { authorization: `Bearer ${token}` } }
})

const httpAuthLink = middlewareLink.concat(httpLink)

const wsLink = new WebSocketLink({
  uri: process.env.VUE_APP_WS_URL,
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: async () => {
      const token = await getAccessToken()
      return { headers: { authorization: `Bearer ${token}` } }
    }
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpAuthLink
)

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: true,
    freezeResults: true
  }),
  assumeImmutableResults: true,
  connectToDevTools: process.env.NODE_ENV === 'development'
})

const provider = new VueApollo({
  defaultClient: client
})

Vue.use(VueApollo)

export default provider
