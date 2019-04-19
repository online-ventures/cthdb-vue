<template lang="pug">
div
  h1 Show Listings
  VDataTable(:items="shows" :headers="headers" item-key="name" expand)
    template(v-slot:items="props")
      tr(@click='props.expanded = !props.expanded')
        td {{ props.item.name }}
        td {{ props.item.occurred_at }}
    template(v-slot:expand="props")
      v-card(color="#fcfcfc")
        v-card-text
          v-form
            v-container
              v-layout(row)
                v-flex(sx12 md6)
                  v-text-field(label="Name")
                v-flex(sx12 md6)
                  v-text-field(label="Happened")
              v-layout(row justify-end)
                v-btn Cancel
                v-btn Save
</template>

<script>
import ShowCard from '@/components/ShowCard.vue'
import { mapState } from 'vuex'

export default {
  components: {
    ShowCard
  },
  data () {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Happened On', value: 'occurred_at' }
      ]
    }
  },
  created() {
    this.$store.dispatch('fetchShows')
  },
  computed: mapState(['shows'])
}
</script>
