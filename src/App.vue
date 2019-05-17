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
    v-content
      v-container(align-center)
        router-view
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
    }
  }
}
</script>
