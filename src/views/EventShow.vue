<template lang="pug">
h1 {{ event.title }}
</template>

<script>
import EventService from '@/services/EventService.js'

export default {
  data() {
    return {
      event: {}
    }
  },
  props: ['id'],
  created() {
      EventService.getEvent(this.id)
      .then(response => {
        this.event = response.data
      })
      .catch(error => {
        console.log('There was an error: ', error.response)
      })
  }
}
</script>
