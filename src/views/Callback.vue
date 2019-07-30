<template lang="pug">
  b-loading(:active="true")
</template>

<script>
import authMixin from '../mixins/authMixin'

export default {
  mixins: [authMixin],
  created () {
    this.$store.dispatch('handleAuthentication')
  },
  watch: {
    authStatus (newStatus, oldStatus) {
      if (newStatus === 'authenticated') {
        this.$router.push({ name: 'profile' })
      }
    }
  }
}
</script>

<style scoped>
</style>
