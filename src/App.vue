<template lang="pug">
  v-app
    v-toolbar(app)
      v-toolbar-title(class="headline text-uppercase")
        span CTH
        span(class="font-weight-light")  Stars
      v-spacer
      v-toolbar-items
        v-btn(:to="{ path: '/' }" flat) Home
        v-btn(:to="{ name: 'show-list' }" flat) Shows
        v-btn(:to="{ name: 'job-list' }" flat) Jobs
    v-content
      v-container(align-center)
        transition(:name="viewTransition" mode="out-in")
          router-view
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      viewTransition: ''
    }
  },
  watch: {
    '$route' (to, from) {
      const paths = ['/', '/shows', '/jobs']
      const fromIndex = paths.findIndex(path => path === from.path)
      const toIndex = paths.findIndex(path => path === to.path)
      const direction = fromIndex < toIndex ? 'right' : 'left'
      this.viewTransition = 'slide-' + direction
    }
  }
}
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all .3s ease;
}
.slide-left-enter, .slide-left-leave-to, .slide-right-enter, .slide-right-leave-to {
  opacity: 0;
}
.slide-right-enter, .slide-left-leave-to {
  transform: translateX(60px);
}
.slide-left-enter, .slide-right-leave-to {
  transform: translateX(-60px);
}
</style>
