<template lang="pug">
div
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
        b-dropdown(v-if="isAuthenticated" position="is-bottom-left")
          button(class="button" type="" slot="trigger")
            figure(class="image is-24x24")
              img(class="is-rounded" :src="user.picture")
            b-icon(icon="caret-down" size="is-small")
          b-dropdown-item(custom) {{ user.name }}
          b-dropdown-item(v-if="isAuthenticated" @click="logout") Logout
  div(class="mobile-navbar is-hidden-desktop")
    div(class="columns is-mobile is-gapless")
      div(class="column")
        router-link(class="mobile-router-link has-text-white has-text-centered" :to="{name: 'show-list'}")
          p(class="mobile-router-icon")
            font-awesome-icon(icon="ticket-alt" size="1x" class="has-text-centered")
          p(class="nav-title is-size-6") Shows
      div(class="column")
        router-link(class="mobile-router-link has-text-white has-text-centered" :to="{name: 'job-list'}")
          p(class="mobile-router-icon")
            font-awesome-icon(icon="hammer" size="1x" class="has-text-centered")
          p(class="nav-title is-size-6") Jobs
      div(class="column")
        router-link(class="mobile-router-link has-text-white has-text-centered" :to="{name: 'volunteers'}")
          p(class="mobile-router-icon")
            font-awesome-icon(icon="users" size="1x" class="has-text-centered")
          p(class="nav-title is-size-6") Volunteers
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
.mobile-navbar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: $primary;
}
.mobile-router-link {
  width: 100%;
}
.mobile-router-icon {
  margin-top: 0.5rem;
}
.nav-title {
  margin-top: -0.3rem;
  margin-bottom: 0.5rem;
}
.router-link-active p {
  color: $yellow;
}
</style>
