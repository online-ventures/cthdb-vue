<template lang="pug">
div
</template>

<script>
import { mapState } from 'vuex'

export default {
  created () {
    this.$store.dispatch('handleAuthentication')
  },
  computed: {
    ...mapState({
      authStatus: state => state.auth.status
    })
  },
  watch: {
    authStatus (newStatus, oldStatus) {
      if (newStatus === 'authenticated') {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style scoped>
</style>
