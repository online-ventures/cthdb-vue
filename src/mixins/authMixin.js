import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState({
      authStatus: state => state.auth.status,
      profile: state => state.auth.profile
    }),
    ...mapGetters(['isAuthenticated', 'isIdTokenValid'])
  },
  methods: {
    login () {
      this.$store.dispatch('login')
    },
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
