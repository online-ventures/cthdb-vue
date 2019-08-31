export default {
  data () {
    return {
      apolloError: null
    }
  },

  methods: {
    handleApolloError (error, toast = '') {
      this.apolloError = error
      console.log(error)
      let message
      if (toast.length > 0) {
        message = toast
      } else {
        // TODO: Detect and display more useful toasts for common failure scenarios
        // eg. jwt expired, duplicate record insertion attempt, etc.
        message = 'There was an error saving this.  You may want to refresh the page'
      }
      this.$buefy.toast.open({
        message: message,
        type: 'is-danger'
      })
    }
  }
}
