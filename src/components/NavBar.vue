<template lang="pug">
div
  nav.navbar
    .navbar-brand
      router-link.navbar-item(:to="{ path: '/' }")
        img(src="/images/icons/icon-144x144.png")
      router-link.navbar-item(:to="{ path: '/' }")
        b CTH
        span Stars
      a.navbar-burger.burger(ref="burger" @click="toggleLinks" :class="{ 'is-active': showLinks }")
        span
        span
        span
    .navbar-menu(:class="{ 'is-active': showLinks }")
      .navbar-start(v-if="displayTenantLinks")
        router-link.navbar-item(:to="{ name: 'shows' }") Shows
        router-link.navbar-item(:to="{ name: 'jobs' }") Jobs
        router-link.navbar-item(:to="{ name: 'volunteers' }") Volunteers
      .navbar-end
        .navbar-item.has-dropdown.is-hoverable(v-if="user")
          a.navbar-link Account
          .navbar-dropdown.is-right
            .navbar-item {{ user.name }}
            a.navbar-item(@click="routeByName('theatres')") Theatres
            a.navbar-item(@click="logout") Logout
        .navbar-item(v-if="!user")
          a.button.is-small.is-secondary(:class="{'is-loading': authLoading}" @click="login")
            strong Login
</template>

<script>
export default {
  data () {
    return {
      showLinks: false
    }
  },
  computed: {
    authLoading () {
      return !this.$auth.completed
    },
    user () {
      return this.$auth.user
    },
    displayTenantLinks () {
      console.log('display tenant links', this.$auth.tenant)
      return this.$auth.tenantId
    }
  },
  methods: {
    login () {
      this.$auth.login()
    },
    logout () {
      this.$auth.logout()
    },
    routeByName (name) {
      this.$router.push({ name: name })
      this.showLinks = false
    },
    toggleLinks () {
      this.showLinks = !this.showLinks
    }
  }
}
</script>

<style scoped lang="scss">
</style>
