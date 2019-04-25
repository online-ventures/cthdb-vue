<template lang="pug">
div
  v-toolbar(flat color="white")
    v-toolbar-title Show Listings
    v-spacer

    v-dialog(v-model="dialog" max-width="550px")
      template(v-slot:activator="{ on }")
        v-btn(color="primary" dark class="mb-2" v-on="on") New Item

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

  v-data-table(:items="shows" :headers="headers" item-key="id")
    template(v-slot:items="props")
      tr(@click='editItem(props.item)')
        td {{ props.item.name }}
        td {{ props.item.occurred_at }}
</template>

<script>
import Show from '@/store/models/Show'
import pick from 'lodash/pick'

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
      newItem: {
        name: '',
        occurred_at: ''
      }
    }
  },
  created () {
    if (this.shows.length === 0) {
      Show.$fetch()
    }
  },

  computed: {
    shows () { return Show.all() },
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
    editItem (item) {
      this.actionType = 'edit'
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.newItem)
        this.actionType = 'new'
      }, 300)
    },

    save () {
      if (this.actionType === 'new') {
        this.create()
      } else {
        this.update()
      }
      this.close()
    },

    create () {
      const data = pick(this.editedItem, ['name','occurred_at'])
      Show.$create({ data: data })
    },

    update () {
      const edited = this.editedItem
      const data = pick(edited, ['name','occurred_at'])
      Show.$update({ params: { id: edited.id }, data: data })
    }
  }
}
</script>
