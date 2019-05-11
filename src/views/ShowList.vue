<template lang="pug">
div
  v-toolbar(flat color="white")
    v-toolbar-title Show Listings
    v-spacer

    v-dialog(v-model="dialog" max-width="550px")
      template(v-slot:activator="{ on }")
        v-btn(color="primary" dark class="mb-2" @click="newItem(true)") New Item

      v-card
        v-card-title
          span(class="headline") {{ formTitle }}
        v-card-text
          v-container(grid-list-md)
            v-layout
              v-flex(xs12)
                v-text-field(v-model="editedItem.name" label="Name")
            v-layout
              v-flex(xs12)
                v-date-picker(v-model="editedItem.occurred_at" label="Happened" landscape)
        v-card-actions
          v-spacer
          v-btn(color="blue darken-1" flat @click="close") Cancel
          v-btn(color="blue darken-1" flat @click="save") Save

  v-data-table(:items="showData" :headers="headers" item-key="id")
    template(v-slot:items="props")
      tr(@click='editItem(props.item)')
        td {{ props.item.name }}
        td {{ props.item.occurred_at }}
</template>

<script>

export default {
  data () {
    return {
      dialog: false,
      actionType: 'new',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Happened', value: 'occurred_at' }
      ],
      editedItem: {},
      blankItem: {
        _jv: { type: 'shows' }
      }
    }
  },
  created () {
    if (Object.keys(this.shows).length === 0) {
      this.$store.dispatch('jv/get', 'shows')
    }
    this.newItem()
  },

  computed: {
    showData () {
      const arr = []
      for ( let id in this.shows ) {
        arr.push(this.shows[id])
      }
      return arr
    },
    shows () {
      return this.$store.getters['jv/get']('shows')
    },
    formTitle () {
      return this.actionType === 'new' ? 'New Show' : 'Edit Show'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  methods: {
    newItem (open) {
      this.actionType = 'new'
      this.editedItem = Object.assign({}, this.blankItem)
      if (open) {
        this.dialog = true
      }
    },

    editItem (item) {
      this.actionType = 'edit'
      this.editedItem = item
      this.dialog = true
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.newItem()
      }, 300)
    },

    save () {
      const method = this.actionType === 'new' ? 'post' : 'patch'
      console.log(this.editedItem)
      this.$store.dispatch('jv/'+method, this.editedItem)
      this.close()
    }
  }
}
</script>
