<template lang="pug">
div(class="columns is-6")
  div(class="column" class="row" @click="action")
    p(class="title is-4") {{ title }}
    div(class="subtitle is-6 level is-mobile")
      div(class="level-left")
        div(class="level-item" v-if="icon")
          b-icon(:icon="icon" size="is-small" :type="iconTypeOrDefault")
        div(class="level-item")
          span {{ subtitle }}
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    title: String,
    subtitle: String,
    icon: String,
    iconType: String,
    item: Object,
    onClick: Function
  },
  computed: {
    iconTypeOrDefault () {
      return this.iconType || 'is-grey-lighter'
    }
  },
  methods: {
    action () {
      this.onClick(this.item)
    }
  }
}
</script>

<style scoped>
.row:hover {
  background: hsl(0, 0%, 96%);
  cursor: pointer;
}
</style>
