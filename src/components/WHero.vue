<template lang="pug">
section.hero.is-primary
  .hero-body
    .container
      h1.title
        | {{ title }}
        template(v-if="linkText && linkAction")
          | &nbsp;
          a.is-size-6(@click="linkAction") {{ linkText }}
      p.subtitle(v-if="subtitle") {{ subtitle }}
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: false
    },
    linkText: {
      type: String,
      required: false
    },
    linkAction: {
      type: Function,
      required: false
    }
  }
}
</script>

<style scoped lang="scss">
.title a {
  color: white;
  font-weight: normal;
}
.title a:hover {
  text-decoration: underline;
}
</style>
