<template lang="pug">
textarea(
  ref="textarea"
  :class="classes"
  @change="runValidations"
  @keyup="runValidations"
  v-bind:value="value"
  v-on:input="$emit('input', $event.target.value)")
</template>

<script>
export default {
  props: ['value'],

  computed: {
    classes () {
      const list = ['textarea']
      if (!this.isValid) {
        list.push('is-danger')
      }
      return list.join(' ')
    }
  },

  data () {
    return {
      isValid: true
    }
  },
  methods: {
    runValidations () {
      this.isValid = this.$refs.textarea.checkValidity()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
