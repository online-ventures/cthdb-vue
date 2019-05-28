<template lang="pug">
div
  v-toolbar(flat color="white")
    v-toolbar-title Job Listings
    v-spacer

    v-dialog(v-model="dialog" max-width="550px")
      template(v-slot:activator="{ on }")
        v-btn(color="primary" dark class="mb-2" @click="newItem(true)") New Job

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
                v-select(:items="points" v-model="editedItem.points" label="Points")
        v-card-actions
          v-spacer
          v-btn(color="blue darken-1" flat @click="close") Cancel
          v-btn(color="blue darken-1" flat @click="save") Save

  v-data-table(:items="jobData" :headers="headers" item-key="id" :rows-per-page-items="rowsPerPage" :pagination.sync="pagination")
    template(v-slot:items="props")
      tr(@click='editItem(props.item)')
        td {{ props.item.name }}
        td {{ props.item.points | prettyPoints }}
</template>

<script>
import dataMixin from '../mixins/dataMixin'

export default {
  mixins: [dataMixin],

  data () {
    return {
      dialog: false,
      actionType: 'new',
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Points', value: 'points' }
      ],
      rowsPerPage: [10, 25, 50],
      pagination: {
        descending: false,
        sortBy: 'name'
      },
      editedItem: {},
      blankItem: {
        _jv: { type: 'jobs' }
      },
      points: [
        { text: 'None', value: '0' },
        { text: '0.5', value: '1' },
        { text: '1', value: '2' },
        { text: '2', value: '4' },
        { text: '3', value: '6' }
      ]
    }
  },

  computed: {
    jobData () {
      const arr = []
      for (let id in this.jobs) {
        arr.push(this.jobs[id])
      }
      return arr
    },
    formTitle () {
      return this.actionType === 'new' ? 'New Job' : 'Edit Job'
    }
  },

  filters: {
    prettyPoints (value) {
      if (value === 0) {
        return '0'
      }
      const num = parseInt(value)
      const half = num / 2
      return half.toFixed(1)
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

    prepareItem () {
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
