<template lang="pug">
.field
  w-label(v-if="label" :title="label" :help="help")
  .control(:class="controlClass")
    span.icon(v-if="icon")
      font-awesome-icon(:icon="icon")
    slot
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: false
    },
    help: {
      type: String,
      required: false
    },
    icon: {
      type: String,
      required: false
    }
  },

  computed: {
    controlClass () {
      return this.icon ? 'has-icons-left' : ''
    }
  }
}
</script>

<style scoped lang="scss">
</style>
