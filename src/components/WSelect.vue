<template lang="pug">
.buttons.has-addons
  button.button(
    v-for="option in options"
    :class="buttonClasses(option)"
    :disabled="disabled"
    @click.prevent="selectOption(option)")
    span.icon.is-small(v-if="displaySelectedIcon(option)")
      font-awesome-icon(:icon="selectedIcon")
    span {{ option.text }}
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedClass: {
      type: String,
      required: false,
      default: 'is-primary'
    },
    selectedIcon: {
      type: String,
      required: false
    },
    buttonClass: {
      type: String,
      required: false,
      default: ''
    }
  },

  methods: {
    selectOption (option) {
      this.$emit('input', option.value)
      this.$nextTick(() => this.$emit('changed', option.value))
    },
    buttonClasses (option) {
      const classes = [this.buttonClass]
      if (option.value === this.value) {
        classes.push(this.selectedClass)
      }
      return classes
    },
    displaySelectedIcon (option) {
      return option.value === this.value && this.selectedIcon
    }
  }
}
</script>

<style scoped lang="scss">
</style>
