import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { jsonapiModule } from './jsonapi'

Vue.use(Vuex)

const api = axios.create({
  baseURL: 'https://cth-api.wov.io/',
  headers: {
    'Content-Type': 'application/vnd.api+json'
  }
})

export default () => new Vuex.Store({
  modules: {
    jv: jsonapiModule(api)
  }
})
