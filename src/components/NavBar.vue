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
      b-dropdown(v-if="isAuthenticated" position="is-bottom-left" class="is-borderless")
        button(class="button" type="" slot="trigger" class="is-borderless")
          figure(class="image is-24x24")
            img(class="is-rounded" :src="user.picture")
          b-icon(icon="caret-down" size="is-small")
        b-dropdown-item(custom) {{ user.name }}
        b-dropdown-item(v-if="isAuthenticated" @click="logout") Logout
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
