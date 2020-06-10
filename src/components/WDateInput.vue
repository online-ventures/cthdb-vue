<template lang="pug">
datepicker(
  v-bind="$attrs"
  v-model="date"
  :use-utc="true"
  @input="onChanged"
  input-class="input")
</template>

<script>
import Datepicker from 'vuejs-datepicker'

export default {
  components: {
    Datepicker
  },

  props: {
    value: {
      type: [String, Date],
      required: true
    }
  },

  data () {
    return {
      date: null
    }
  },

  created () {
    this.date = this.value
  },

  computed: {
  },

  methods: {
    onChanged () {
      const output = this.formatDate(this.date)
      this.$emit('input', output)
      this.$nextTick(() => this.$emit('changed', output))
    },
    formatDate (date = null) {
      const d = date || new Date()
      let month = (d.getUTCMonth() + 1).toString()
      let day = d.getUTCDate().toString()
      const year = d.getUTCFullYear()

      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }

      return [year, month, day].join('-')
    }
  }
}
</script>

<style lang="scss">
@import "src/scss/_variables";

.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,
.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,
.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {
  border: 1px solid $primary !important;
}
.vdp-datepicker__calendar .cell.selected {
  background: $primary !important;
  color: white !important;
}
.vdp-datepicker__calendar .cell.selected:hover {
  background: $primary !important;
}
.vdp-datepicker__calendar .cell.selected.highlighted {
  background: $primary !important;
}
</style>
