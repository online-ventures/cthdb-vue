<template lang="pug">
b-navbar
  template(slot="brand")
    b-navbar-item(tag='router-link' :to="{ path: '/' }")
      img(src="/images/icons/icon-144x144.png")
    b-navbar-item(tag='router-link' :to="{ path: '/' }")
      b CTH
      span Stars
  template(slot="start")
    b-navbar-item(tag="router-link" v-for="link in links" :to="{ path: link.path }" :key="link.text" active-class="is-active")
      | {{ link.text }}
  template(slot="end")
    b-navbar-item(tag="div")
      div(class="buttons")
        a(class="button is-primary" v-if="!isAuthenticated" @click="login") Login
        a(class="button" v-if="isAuthenticated" @click="logout") Logout
</template>

<script>
import authMixin from '@/mixins/authMixin'

export default {
  mixins: [authMixin],
  props: {
    links: Array
  }
}
</script>

<style scoped lang="scss">
@import "src/scss/_variables";
.is-active {
  background-color: $white-ter !important;
}
</style>
