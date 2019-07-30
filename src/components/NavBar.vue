<template lang="pug">
nav(class="navbar" role="navigation" aria-label="main navigation")
  div(class="navbar-brand")
    router-link(class="navbar-item" :to="{ path: '/' }")
      img(src="/images/icons/icon-144x144.png")
    router-link(class="navbar-item" :to="{ path: '/' }")
      b CTH
      span Stars
    a(role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="topNavBar")
      span(aria-hidden="true")
      span(aria-hidden="true")
      span(aria-hidden="true")
  div(id="topNavBar" class="navbar-menu")
    div(class="navbar-start")
      router-link(class="navbar-item" v-for="link in links" :to="{ path: link.path }" :key="link.text")
        | {{ link.text }}
    div(class="navbar-end")
      div(class="navbar-item")
        div(class="buttons")
          a(class="button is-primary" v-if="!isAuthenticated" @click="login") Login
          a(class="button" v-if="isAuthenticated" @click="logout") Logout
</template>

<script>
import authMixin from '@/mixins/authMixin'

export default {
  name: 'nav-bar',
  mixins: [authMixin],
  props: {
    links: Array
  }
}
</script>

<style scoped>
</style>
