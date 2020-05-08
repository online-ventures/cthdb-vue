<template lang="pug">
div
  span {{ item.name }}
</template>

<script>
export default {
  props: {
    item: { required: true }
  }
}
</script>
