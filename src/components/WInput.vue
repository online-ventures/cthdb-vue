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
import debounce from 'lodash/debounce'

export default {
  inheritAttrs: false,

  props: {
    value: {
      type: [Object, Number, String],
      required: false,
      default: null
    },
    debounce: {
      type: Function,
      required: false,
      default: null
    },
    debounceItem: {
      type: Object,
      required: false,
      default: null
    }
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
      error: null,
      debounceTimeout: null
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
    inputChanged (event) {
      this.runValidations()
      this.$emit('input', this.text)
      if (this.debounce) {
        if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
        const that = this
        this.debounceTimeout = setTimeout(function () {
          that.debounce({
            value: that.text,
            valid: that.isValid,
            item: that.debounceItem
          })
        }, 1000)
      }
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
