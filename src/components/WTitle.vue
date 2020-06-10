<template lang="pug">
h2.title.is-4(:class="titleClass")
  | {{ title }}
  template(v-if="help")
    | &nbsp;
    a.icon.is-small.has-text-link.is-size-6(:title="help")
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
    titleClass () {
      return this.help ? 'has-help-icon' : ''
    }
  }
}
</script>

<style scoped lang="scss">
.title a {
  color: white;
  font-weight: normal;
}
.title a:hover {
  text-decoration: underline;
}
.has-help-icon {
  line-height: 1.2em;
  .icon {
    margin-left: 0.25em;
  }
}
</style>
