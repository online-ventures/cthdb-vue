<template lang="pug">
.field-wrapper
  input.input(
    ref="input"
    v-bind="$attrs"
    v-model="text"
    :class="classes"
    @change="runValidations"
    @invalid="onInvalid"
    @keydown.enter.prevent
    @input="inputChanged"
    @blur="onBlur")
  w-notification(
    full
    extraClasses="is-small"
    :message="error"
    type="danger"
    @closed="error = null")
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    value: [Object, Number, String],
    default: null
  },

  mounted () {
    if (this.value) {
      this.text = this.value
    }
  },

  data () {
    return {
      text: '',
      isValid: true,
      error: null
    }
  },

  computed: {
    classes () {
      if (this.isValid) return ''
      return 'is-danger'
    }
  },

  watch: {
    value (value) {
      this.text = value
    }
  },

  methods: {
    runValidations () {
      this.isValid = this.$refs.input.checkValidity()
      if (this.isValid) this.error = null
      this.$emit('change', this.text)
    },
    inputChanged () {
      this.runValidations()
      this.$emit('input', this.text)
    },
    onInvalid (event) {
      const validity = this.$refs.input.validity
      if (validity.valueMissing) {
        this.error = 'This field is required'
      } else if (validity.patternMismatch) {
        this.error = 'Please provide this in the correct format'
      } else if (validity.typeMismatch) {
        this.error = 'This value is not the correct type'
      } else if (validity.tooShort) {
        this.error = 'This value is too small'
      } else if (validity.tooLong) {
        this.error = 'This value is too large'
      } else if (validity.rangeUnderflow) {
        this.error = 'This value is under the range required'
      } else if (validity.rangeOverflow) {
        this.error = 'This value is over the range required'
      } else if (validity.badInput) {
        this.error = 'This value is too large'
      } else {
        this.error = 'This field has errors'
      }
    },
    onBlur (event) {
      this.$emit('blur')
    }
  }
}
</script>

<style scoped lang="scss">
.field-wrapper {
  position: relative;
}
</style>
