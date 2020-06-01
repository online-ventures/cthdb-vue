<template lang="pug">
.buttons.has-addons
  button.button(:class="yesClasses" @click="selectYes") {{ yesText }}
  button.button(:class="noClasses" @click="selectNo") {{ noText }}
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: null
    },
    yesText: {
      type: String,
      required: false,
      default: 'Yes'
    },
    noText: {
      type: String,
      required: false,
      default: 'No'
    }
  },

  mounted () {
    if (this.value) {
      this.yes = this.value
    }
  },

  data () {
    return {
      yes: false
    }
  },

  computed: {
    yesClasses () {
      if (this.yes) return 'is-success is-selected'
      return ''
    },
    noClasses () {
      if (!this.yes) return 'is-danger is-selected'
      return ''
    }
  },

  watch: {
    value (value) {
      this.yes = value
    }
  },

  methods: {
    selectYes () {
      this.yes = true
      this.$emit('input', true)
      this.$nextTick(() => this.$emit('change'))
    },
    selectNo () {
      this.yes = false
      this.$emit('input', false)
      this.$nextTick(() => this.$emit('change'))
    }
  }
}
</script>

<style scoped lang="scss">
.is-fullwidth {
  .button {
    width: 50%;
  }
}
</style>
