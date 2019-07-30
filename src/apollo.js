import Vue from 'vue'
import VueApollo from 'vue-apollo'
import store from '@/store/store'
import { setContext } from 'apollo-link-context'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_URL
})

// Convert this to an async/await function
// that uses store.watch instead of renewTokens
const middlewareLink = setContext(request =>
  new Promise((resolve, reject) => {
    store.dispatch('renewTokens').then((token) => {
      resolve({
        headers: {
          authorization: `Bearer ${token}`
        }
      })
    }, (error) => {
      reject(error)
      console.log(error)
    })
  }))

const link = middlewareLink.concat(httpLink)

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
