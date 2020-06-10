import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueHead from 'vue-head'
import { Auth0Plugin } from '@/auth/auth'
import apolloProvider from '@/apollo'
import FontAwesomeIcon from '@/icons'
import './registerServiceWorker'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import VueCookies from 'vue-cookies'

// Head
Vue.use(VueHead)

// Sentry
const sentryIntegration = new Integrations.Vue({
  Vue,
  attachProps: true,
  logErrors: process.env.NODE_ENV === 'development'
})
Sentry.init({
  dsn: 'https://7e2a0dd135014308a98f7ac5e6686b09@o71452.ingest.sentry.io/5219602',
  integrations: [sentryIntegration],
  environment: process.env.NODE_ENV
})
Vue.prototype.$sentry = Sentry

// Cookies
Vue.use(VueCookies)
Vue.$cookies.config('120d')

// Auth0
Vue.use(Auth0Plugin, {
  apollo: apolloProvider,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
})

// Font awesome icons
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

// Base components
// Calling these W components, for WOV
const requireComponent = require.context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /W[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})

new Vue({
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
