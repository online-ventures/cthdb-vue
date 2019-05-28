export default {
  created () {
    if (Object.keys(this.shows).length === 0) {
      this.$store.dispatch('jv/get', 'shows')
    }
  },
  computed: {
    shows () {
      return this.$store.getters['jv/get']('shows')
    }
  }
}
