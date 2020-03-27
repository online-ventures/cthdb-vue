<template lang="pug">
div
  b-loading(:active="displayLoader")
  nav-bar(:links='topNavLinks')
  div(class="view-container")
    transition(:name='viewTransition')
      router-view(:class="{ 'is-invisible': displayLoader }")
</template>

<script>
import NavBar from './components/NavBar'

export default {
  name: 'App',
  components: {
    NavBar
  },
  created () {
  },
  data () {
    return {
      viewTransition: '',
      topNavLinks: [
        { text: 'Shows', path: '/shows' },
        { text: 'Jobs', path: '/jobs' },
        { text: 'Volunteers', path: '/volunteers' }
      ]
    }
  },
  computed: {
    displayLoader () {
      const auth = this.$store.state.auth
      return auth && auth.status !== 'authenticated'
    }
  },
  methods: {
  },
  watch: {
    '$route' (to, from) {
      const fromIndex = this.topNavLinks.findIndex(link => link.path === from.path)
      const toIndex = this.topNavLinks.findIndex(link => link.path === to.path)
      if (fromIndex === -1 || toIndex === -1) {
        const direction = to.path.length > from.path.length ? 'right' : 'left'
        this.viewTransition = 'slide-' + direction
      } else {
        const direction = fromIndex < toIndex ? 'right' : 'left'
        this.viewTransition = 'slide-' + direction
      }
    }
  }
}
</script>

<style lang="scss">
@import "src/scss/_variables";
@import "src/scss/layout";
@import "~bulma";
@import "~buefy/src/scss/buefy";

.view-container {
  position: relative;
}
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all .3s ease;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.slide-left-enter, .slide-left-leave-to, .slide-right-enter, .slide-right-leave-to {
  opacity: 0;
}
.slide-right-enter, .slide-left-leave-to {
  transform: translateX(100%);
}
.slide-left-enter, .slide-right-leave-to {
  transform: translateX(-100%);
}
</style>
