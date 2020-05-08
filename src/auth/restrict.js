import { getInstance } from './auth'

const debug = false
export default (to, from, next) => {
  if (debug) console.log('loading view', to)
  if (to.meta.role) {
    const auth = getInstance()

    // Create an auth check function in case
    // we need to wait for auth to finish loading
    const authCheck = () => {
      const role = to.meta.role
      if (debug) console.log('Role required:', role)
      // If not logged in, redirect to login
      if (!auth.accessToken) {
        auth.login(to.fullPath)
        next(false)
      } else if (auth.has(role)) {
        if (debug) console.log('Logged in user has required role')
        // If the user is authorized, proceed
        next()
      } else {
        if (debug) console.log('Logged in user is unauthorized')
        // If they are not authorized, redirect to unauthorized page
        next({ name: 'unauthorized' })
      }
    }

    // If loading has already finished, perform the check immediately
    if (!auth.loading) {
      return authCheck()
    }

    // Watch for the loading property to change before we check accessToken
    auth.$watch('loading', loading => {
      if (loading === false) {
        return authCheck()
      }
    })
  } else {
    next()
  }
}
