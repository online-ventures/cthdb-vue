/* eslint-disable no-console */

import { register } from 'register-service-worker'

const elem = document.getElementById('service-worker-data')

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      elem.setAttribute('data-registered', 'yes')
      console.log('Service worker has been registered.')
    },
    cached () {
      elem.setAttribute('data-cached', 'yes')
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      elem.setAttribute('data-downloading', 'yes')
      console.log('New content is downloading.')
    },
    updated () {
      elem.setAttribute('data-new-content', 'yes')
      console.log('New content is available; please refresh.')
    },
    offline () {
      elem.setAttribute('data-offline', 'yes')
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
