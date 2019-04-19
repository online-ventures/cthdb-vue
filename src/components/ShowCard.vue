<template lang="pug">
router-link(class="show-link" :to="{name: 'show-show', params: { id: show.id } }")
  div(class="show-card -shadow")
    span(class="eyebrow") @{{ show.occurred_at }}
    h4(class="title") {{ show.name }}
</template>

<script>
export default {
  props: {
    show: Object
  }
}
</script>

<style scoped>
.show-card {
  padding: 20px;
  margin-bottom: 24px;
  transition: all 0.2s linear;
  cursor: pointer;
}
.show-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2), 0 1px 15px 0 rgba(0, 0, 0, 0.19);
}
.show-card > .title {
  margin: 0;
}

.show-link {
  color: black;
  text-decoration: none;
  font-weight: 100;
}
</style>
