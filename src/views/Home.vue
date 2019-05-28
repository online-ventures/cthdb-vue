<template lang="pug">
  v-layout
    v-flex(xs12 sm6 offset-sm3)
      v-container(fluid)
        v-layout(row wrap)
          v-flex(xs12 md6 xl4 v-for="stat in stats" :key="stat.name")
            v-card(tile)
              v-card-text(class="text-xs-center")
                h2(class="display-3") {{ stat.value }}
                p(class="subheading") {{ stat.subtitle }}
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    if (Object.keys(this.shows).length === 0) {
      this.$store.dispatch('jv/get', 'shows')
    }
  },
  computed: {
    shows () {
      return this.$store.getters['jv/get']('shows')
    },
    stats () {
      return [
        {
          id: 'show-count',
          subtitle: 'Total shows',
          value: Object.keys(this.shows).length
        }
      ]
    }
  }
}
</script>
