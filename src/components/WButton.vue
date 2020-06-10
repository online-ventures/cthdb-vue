<template lang="pug">
button.button(v-bind="$attrs" @click="clicked")
  span.icon.is-small(v-if="icon")
    font-awesome-icon(:icon="icon")
  slot
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false
    }
  },
  methods: {
    clicked () {
      this.$emit('click')
    }
  }
}
</script>

<style scoped lang="scss">
</style>
