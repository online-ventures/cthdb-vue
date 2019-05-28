export default {
  created () {
    if (Object.keys(this.shows).length === 0) {
      this.$store.dispatch('jv/get', 'shows')
    }
    if (Object.keys(this.jobs).length === 0) {
      this.$store.dispatch('jv/get', 'jobs')
    }
  },
  computed: {
    shows () {
      return this.$store.getters['jv/get']('shows')
    },
    jobs () {
      return this.$store.getters['jv/get']('jobs')
    }
  }
}
