<template lang="pug">
  .user
    h1 This is {{ username }}'s page
</template>

<script>
  export default {
    props: ['username']
  }
</script>
