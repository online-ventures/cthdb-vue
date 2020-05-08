<template lang="pug">
div(:class="rowClasses" @click="performClick")
  .column.is-1.has-text-centered(v-if="checkable")
    font-awesome-icon(icon="check-circle" size="2x" :class="iconClass")
  .column
    p.title.is-4 {{ title }}
    .subtitle.is-6.is-mobile
      .icon(v-if="icon")
        font-awesome-icon(:icon="icon" size="1x" :class="iconClass")
      span {{ subtitle }}
  .column.is-2-tablet.is-one-quarter-mobile.has-text-right(v-if="showPoints")
    span.icon.is-medium.has-text-warning
      font-awesome-icon(icon="coins" size="lg")
    span.is-size-3.has-text-weight-medium  {{ points | points }}
</template>

<script>
export default {
  data () {
    return {}
  },

  created () {
  },

  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: false
    },
    icon: {
      type: String,
      required: false
    },
    iconType: {
      type: String,
      required: false
    },
    item: {
      type: Object,
      required: false
    },
    onClick: {
      type: Function,
      required: false
    },
    checkable: {
      type: Boolean,
      required: false,
      default: false
    },
    checked: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    points: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    iconTypeOrDefault () {
      return this.iconType || 'is-grey-lighter'
    },
    rowClasses () {
      return 'columns is-6 row is-mobile' + (this.disabled ? ' disabled' : '')
    },
    iconClass () {
      if (this.checked) {
        return 'has-text-success'
      } else if (this.disabled) {
        return 'has-text-grey-lighter'
      } else {
        return 'has-text-grey-light'
      }
    },
    showPoints () {
      return this.points !== null
    }
  },
  filters: {
    points (value) {
      return value * 0.5
    }
  },
  methods: {
    performClick () {
      if (this.disabled) {
        return
      }
      if (this.checkable) {
        this.$emit('check', this.item)
      } else {
        this.$emit('action', this.item)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.row:hover {
  background: hsl(0, 0%, 96%);
  cursor: pointer;
}
.row.disabled {
  background-color: hsl(0, 0%, 98%);
  &:hover {
    background: none;
    cursor: not-allowed;
  }
  .title {
    color: hsl(0, 0%, 80%);
  }
}
</style>
