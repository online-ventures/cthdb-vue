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
    },
    valueMissing: {
      type: String,
      required: false,
      default: 'This field is required'
    },
    patternMismatch: {
      type: String,
      required: false,
      default: 'Please provide this in the correct format'
    },
    typeMismatch: {
      type: String,
      required: false,
      default: 'This value is not the correct type'
    },
    tooShort: {
      type: String,
      required: false,
      default: 'This needs to be longer'
    },
    tooLong: {
      type: String,
      required: false,
      default: 'This needs to be shorter'
    },
    rangeUnderflow: {
      type: String,
      required: false,
      default: 'This value is under the range required'
    },
    rangeOverflow: {
      type: String,
      required: false,
      default: 'This value is over the range required'
    },
    badInput: {
      type: String,
      required: false,
      default: 'This field has errors'
    },
    generalError: {
      type: String,
      required: false,
      default: 'This field has errors'
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
        this.error = this.valueMissing
      } else if (validity.patternMismatch) {
        this.error = this.patternMismatch
      } else if (validity.typeMismatch) {
        this.error = this.typeMismatch
      } else if (validity.tooShort) {
        this.error = this.tooShort
      } else if (validity.tooLong) {
        this.error = this.tooLong
      } else if (validity.rangeUnderflow) {
        this.error = this.rangeUnderflow
      } else if (validity.rangeOverflow) {
        this.error = this.rangeOverflow
      } else if (validity.badInput) {
        this.error = this.badInput
      } else {
        this.error = this.generalError
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
