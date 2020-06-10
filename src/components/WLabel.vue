<template lang="pug">
label.label(:class="labelClass")
  | {{ title }}
  template(v-if="help")
    |
    a.icon.has-text-link(:title="help")
      font-awesome-icon(icon="question-circle")
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    help: {
      type: String,
      required: false
    }
  },

  computed: {
    labelClass () {
      return this.help ? 'has-help-icon' : ''
    }
  }
}
</script>

<style scoped lang="scss">
.has-help-icon {
  .icon {
    margin-left: 0.25em;
  }
}
</style>
