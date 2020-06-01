<template lang="pug">
.field.has-addons
  .control.badge-color
    button.button.light-silver.is-fullwidth(
      :class="{ 'selected': color === lightSilver }"
      @click="selectColor(lightSilver)")
      a.icon(
        title="Badge color: light silver"
        :class="colorClass(lightSilver)")
        font-awesome-icon(icon="star")
  .control.badge-color
    button.button.silver.is-fullwidth(
      :class="{ 'selected': color === silver }"
      @click="selectColor(silver)")
      a.icon(
        title="Badge color: silver"
        :class="colorClass(silver)")
        font-awesome-icon(icon="star")
  .control.badge-color
    button.button.dark-silver.is-fullwidth(
      :class="{ 'selected': color === darkSilver }"
      @click="selectColor(darkSilver)")
      a.icon(
        title="Badge color: dark silver"
        :class="colorClass(darkSilver)")
        font-awesome-icon(icon="star")
  .control.badge-color
    button.button.dark-bronze.is-fullwidth(
      :class="{ 'selected': color === darkBronze }"
      @click="selectColor(darkBronze)")
      a.icon(
        title="Badge color: dark bronze"
        :class="colorClass(darkBronze)")
        font-awesome-icon(icon="star")
  .control.badge-color
    button.button.bronze.is-fullwidth(
      :class="{ 'selected': color === bronze }"
      @click="selectColor(bronze)")
      a.icon(
        title="Badge color: bronze"
        :class="colorClass(bronze)")
        font-awesome-icon(icon="star")
  .control.badge-color
    button.button.gold.is-fullwidth(
      :class="{ 'selected': color === gold }"
      @click="selectColor(gold)")
      a.icon(
        title="Badge color: gold"
        :class="colorClass(gold)")
        font-awesome-icon(icon="star")
  .control.badge-color
    button.button.platinum.is-fullwidth(
      :class="{ 'selected': color === platinum }"
      @click="selectColor(platinum)")
      a.icon(
        title="Badge color: platinum"
        :class="colorClass(platinum)")
        font-awesome-icon(icon="star")
</template>

<script>
export default {
  props: {
    value: {
      type: [String],
      required: false,
      default: null
    }
  },

  mounted () {
    if (this.value) {
      this.color = this.value
    }
  },

  data () {
    return {
      color: null,
      lightSilver: '#a7a9ae',
      silver: '#839696',
      darkSilver: '#71716f',
      darkBronze: '#6b0704',
      bronze: '#a3350c',
      gold: '#e6bf33',
      platinum: '#514e9c'
    }
  },

  watch: {
    value (value) {
      this.color = value
    }
  },

  methods: {
    selectColor (color) {
      this.$emit('input', color)
      this.$nextTick(() => this.$emit('change'))
    },
    colorClass (color) {
      if (this.color === color) {
        return 'has-text-white-ter'
      }
      return 'has-text-grey'
    }
  }
}
</script>

<style scoped lang="scss">
.badge-color {
  width: 14.5%;
  padding-left: 0;
  padding-right: 0;
}
.light-silver {
  background-color: #a7a9ae;
}
.silver {
  background-color: #839696;
}
.dark-silver {
  background-color: #71716f;
}
.dark-bronze {
  background-color: #6b0704;
}
.bronze {
  background-color: #a3350c;
}
.gold {
  background-color: #e6bf33;
}
.platinum {
  background-color: #514e9c;
}
</style>
