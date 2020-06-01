<template lang="pug">
.buttons.has-addons
  button.button(
    v-for="option in options"
    :class="{ 'is-primary': option.value === value }"
    @click="selectOption(option)") {{ option.text }}
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },

  data () {
    return {}
  },

  computed: {
  },

  watch: {
    value (value) {
    }
  },

  methods: {
    selectOption (option) {
      this.$emit('input', option.value)
      this.$nextTick(() => this.$emit('change'))
    }
  }
}
</script>

<style scoped lang="scss">
</style>
