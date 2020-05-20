<template lang="pug">
div
  nav.navbar
    .navbar-brand
      router-link.navbar-item(:to="{ path: '/' }")
        img(src="/images/icons/icon-144x144.png")
      router-link.navbar-item(:to="{ path: '/' }")
        span.is-uppercase.has-text-weight-bold {{ brandTitle }}
      a.navbar-burger.burger(ref="burger" @click="toggleLinks" :class="{ 'is-active': showLinks }")
        span
        span
        span
    .navbar-menu(:class="{ 'is-active': showLinks }")
      router-link.navbar-item(v-if="displayTheatreLink" :to="{ name: 'theatres' }") Theatres
      .navbar-start(v-if="displayTenantLinks")
        router-link.navbar-item(:to="{ name: 'shows' }") Shows
        router-link.navbar-item(:to="{ name: 'jobs' }") Jobs
        router-link.navbar-item(:to="{ name: 'volunteers' }") Volunteers
      .navbar-end
        .navbar-item.has-dropdown.is-hoverable(v-if="user")
          a.navbar-link Account
          .navbar-dropdown.is-right
            .navbar-item {{ user.name }}
            a.navbar-item(@click="routeByName('account')") My profile
            a.navbar-item(v-if="hasTheatre" @click="editMyTheatre") My Theatre
            a.navbar-item(@click="routeByName('theatres')") Switch Theatre
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
    displayTheatreLink () {
      if (this.authLoading) return false
      return !this.$auth.userId
    },
    displayTenantLinks () {
      if (this.authLoading) return false
      return this.$auth.tenantId
    },
    brandTitle () {
      if (this.$auth.tenant) {
        return this.$auth.tenant.short_name
      }
      return 'AllStar'
    },
    hasTheatre () {
      return this.$auth.user.tenants[0]
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
    },
    editMyTheatre () {
      this.$router.push({
        name: 'edit-theatre',
        params: { id: this.$auth.user.tenants[0].id }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
