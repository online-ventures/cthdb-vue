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
              v-flex(xs12 md6 align-center)
                v-select(:items="months" v-model="editedItem.month" label="Month")
              v-flex(xs12 md6 align-center)
                v-select(:items="years" v-model="editedItem.year" label="Year")
        v-card-actions
          v-spacer
          v-btn(color="blue darken-1" flat @click="close") Cancel
          v-btn(color="blue darken-1" flat @click="save") Save

  v-data-table(:items="showData" :headers="headers" item-key="id" :rows-per-page-items="rowsPerPage" :pagination.sync="pagination")
    template(v-slot:items="props")
      tr(@click='editItem(props.item)')
        td {{ props.item.name }}
        td {{ props.item.occurred_at | prettyMonth }}
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
      rowsPerPage: [10, 25, 50],
      pagination: {
        descending: true,
        sortBy: 'occurred_at'
      },
      editedItem: {},
      blankItem: {
        _jv: { type: 'shows' }
      },
      months: [
        { text: 'January', value: '01' },
        { text: 'February', value: '02' },
        { text: 'March', value: '03' },
        { text: 'April', value: '04' },
        { text: 'May', value: '05' },
        { text: 'June', value: '06' },
        { text: 'July', value: '07' },
        { text: 'August', value: '08' },
        { text: 'September', value: '09' },
        { text: 'October', value: '10' },
        { text: 'November', value: '11' },
        { text: 'December', value: '12' }
      ]
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
      for (let id in this.shows) {
        arr.push(this.shows[id])
      }
      return arr
    },
    shows () {
      return this.$store.getters['jv/get']('shows')
    },
    formTitle () {
      return this.actionType === 'new' ? 'New Show' : 'Edit Show'
    },
    years () {
      const yrs = []
      for (let year = new Date().getFullYear() + 1; year >= 2000; year--) {
        yrs.push({ text: year.toString(), value: year.toString() })
      }
      return yrs
    }
  },

  filters: {
    prettyMonth (value) {
      const date = new Date(value + 'T12:00:00')
      const options = { year: 'numeric', month: 'long' }
      return date.toLocaleDateString('en-US', options)
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
      const date = this.editedItem.occurred_at.split('-')
      this.editedItem.year = date[0]
      this.editedItem.month = date[1]
      this.dialog = true
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.newItem()
      }, 300)
    },

    prepareItem () {
      const { year, month } = this.editedItem
      this.editedItem.occurred_at = year + '-' + month + '-01'
      return this.editedItem
    },

    save () {
      const method = this.actionType === 'new' ? 'post' : 'patch'
      this.$store.dispatch('jv/' + method, this.prepareItem())
      this.close()
    }
  }
}
</script>
