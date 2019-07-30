import authService from '../services/authService'

export default {
  install (Vue) {
    Vue.prototype.$auth = authService
  }
}
