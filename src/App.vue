<template lang="pug">
div
  nav-bar(:links='topNavLinks')
  div(class="view-container")
    transition(:name='viewTransition')
      router-view
</template>

<script>
import NavBar from './components/NavBar'

export default {
  name: 'App',
  components: {
    NavBar
  },
  data () {
    return {
      viewTransition: '',
      topNavLinks: [
        { text: 'Home', path: '/' },
        { text: 'Shows', path: '/shows' },
        { text: 'Jobs', path: '/jobs' },
        { text: 'Volunteers', path: '/volunteers' },
        { text: 'Profile', path: '/profile' }
      ]
    }
  },
  methods: {
  },
  watch: {
    '$route' (to, from) {
      const fromIndex = this.topNavLinks.findIndex(link => link.path === from.path)
      const toIndex = this.topNavLinks.findIndex(link => link.path === to.path)
      const direction = fromIndex < toIndex ? 'right' : 'left'
      this.viewTransition = 'slide-' + direction
    }
  }
}
</script>

<style>
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
