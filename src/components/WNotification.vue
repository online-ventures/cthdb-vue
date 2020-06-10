<template lang="pug">
transition(name="expand")
  .outer(v-if="display")
    div(:class="innerClass")
      .notification(:class="notificationClass") {{ text }}
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: false
    },
    lifetime: {
      type: Number,
      required: false,
      default: 3
    },
    full: {
      type: Boolean,
      required: false,
      default: false
    },
    extraClasses: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      text: null,
      display: false,
      callback: null
    }
  },

  watch: {
    message (value) {
      if (value) {
        this.text = value
        this.display = true
        this.fadeOutEventually()
      }
    }
  },

  computed: {
    notificationClass () {
      return ['is-' + this.type, this.extraClasses].join(' ')
    },
    innerClass () {
      return this.full ? 'innerFullWidth' : 'inner'
    }
  },

  methods: {
    fadeOutNow () {
      this.display = false
      this.$emit('closed')
    },
    fadeOutEventually () {
      clearTimeout(this.callback)
      this.callback = setTimeout(() => {
        this.fadeOutNow()
      }, this.lifetime * 1000)
    }
  }
}
</script>

<style scoped lang="scss">
.outer {
  position: relative;
  width: 100%;
}
.inner {
  position: absolute;
  overflow: hidden;
  margin-top: -1em;
  width: 60%;
  left: 20%;
  @media only screen and (max-width: 1024px) {
    width: 80%;
    left: 10%;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
    left: 0;
  }
}
.is-small {
  padding: 0.2em 1em;
}
.innerFullWidth {
  position: absolute;
  width: 100%;
  left: 0;
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s;
}
.expand-enter,
.expand-leave-to {
  opacity: 0;
}
</style>
