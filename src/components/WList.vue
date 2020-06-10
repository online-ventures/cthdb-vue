<template lang="pug">
section.section
  .container

    w-notification(:message="notification" :type="notificationType")

    w-title(:title="title" :help="help")

    transition(name="expand")
      .buttons.expandable(v-if="canAdd")
        w-button.is-primary(
          @click="newItem"
          icon="plus"
          :class="{ 'is-loading': updating }"
        )
          span Add {{ itemName }}

    transition(name="expand")
      p.has-text-centered.is-italic(v-if="items.length === 0 && !adding")
        | No {{ itemName.toLowerCase() }}s have been added yet.

    transition-group(name="expand" tag="div")
      .row(v-for="item in items" :key="item.id")
        .columns.is-vcentered
          .column.item-row
            span.icon.is-small.row-icon
              font-awesome-icon(:icon="rowIcon")
            span.is-size-5.row-text {{ rowText(item) }}
          .column.is-2
            w-button.is-danger.is-fullwidth(@click="deleting = item" icon="trash")
              span Delete

        .is-hidden-tablet(v-if="item.id !== items[items.length-1].id")
          hr.divider

    transition(name="expand")
      .row(v-if="adding")
        .columns
          .column
            slot
          .column.is-2
            w-button.is-primary.is-fullwidth(@click="addItem" :icon="saveIcon")
              span {{ saveText }}

    .add-new-editor(ref="addItemScrollPoint")

  w-confirm(
    :accepted="removeItem"
    :cancelled="cancelConfirm"
    :item="deleting"
    :name="item => item.name"
  )
</template>

<script>
import animateScrollTo from 'animated-scroll-to'

export default {
  props: {
    help: {
      type: String,
      required: false
    },
    itemName: {
      type: String,
      required: true
    },
    rowIcon: {
      type: String,
      required: false
    },
    rowText: {
      type: Function,
      required: false,
      default: item => item.name
    },
    saveText: {
      type: String,
      required: false,
      default: 'Save'
    },
    saveIcon: {
      type: String,
      required: false,
      default: 'save'
    },
    query: {
      type: Object,
      required: true
    },
    queryVariables: {
      type: Object,
      required: true
    },
    skipQuery: {
      type: Function,
      required: false,
      default: () => false
    },
    processResults: {
      type: Function,
      required: true
    },
    insertMutation: {
      type: Object,
      required: true
    },
    insertId: {
      type: Number,
      required: true
    },
    mutationVariables: {
      type: Function,
      required: true,
      default: id => { return { id: id } }
    },
    validateInsert: {
      type: Function,
      required: false,
      default: item => true
    },
    deleteMutation: {
      type: Object,
      required: true
    },
    canAdd: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data () {
    return {
      updating: false,
      adding: false,
      items: [],
      notification: null,
      notificationType: null,
      deleting: null
    }
  },

  computed: {
    title () {
      return this.itemName + 's'
    }
  },

  apollo: {
    items: {
      query () {
        return this.query
      },
      skip () {
        return this.skipQuery()
      },
      variables () {
        return this.queryVariables
      },
      update (data) {
        const items = this.findAndProcessResults(data)
        this.$emit('changed', items)
        return items
      }
    }
  },

  methods: {
    findAndProcessResults (data) {
      const key = Object.keys(data)[0]
      const results = data[key].returning || data[key]
      return this.processResults(results)
    },
    newItem () {
      this.adding = true
      setTimeout(() => animateScrollTo(this.$refs.addItemScrollPoint), 500)
    },
    async addItem () {
      if (this.updating || !this.insertId) return
      this.updating = true
      const data = await this.insertItem()
      const items = this.findAndProcessResults(data)
      const item = items[0]
      if (this.validateInsert(item)) {
        this.items.push(item)
        this.$emit('changed', this.items)
        this.notify('success', item.name + ' successfully added')
        this.adding = false
      } else {
        this.notify('danger', item.name + ' could could not be added')
      }
      this.updating = false
    },
    notify (type, message) {
      this.notificationType = type
      this.notification = message
      this.$nextTick(() => { this.notification = null })
    },
    cancelConfirm () {
      this.deleting = null
    },
    async removeItem () {
      if (this.updating || !this.deleting) return
      this.updating = true
      const data = await this.deleteItem(this.deleting)
      const items = this.findAndProcessResults(data)
      const item = items[0]
      if (item) {
        this.items = this.items.filter(existing => existing.id !== item.id)
        this.$emit('changed', this.items)
        this.notify('success', item.name + ' successfully removed')
      } else {
        this.notify('danger', 'There was an error removing ' + item.name)
      }
      this.updating = false
    },
    insertItem () {
      return this.runMutation(this.insertMutation, this.insertId)
    },
    deleteItem (item) {
      return this.runMutation(this.deleteMutation, item.id)
    },
    async runMutation (mutation, itemId) {
      try {
        const result = await this.$apollo.mutate({
          mutation: mutation,
          variables: this.mutationVariables(itemId)
        })
        return result.data
      } catch (error) {
        this.notify('warning', 'An error occurred. Please try again later.')
        return {}
      }
    }
  }
}
</script>

<style scoped lang="scss">
.expandable {
  max-height: 10em;
  margin-top: 0;
  margin-bottom: 0;
}
.headings {
  margin-bottom: 0;
  .column {
    padding-bottom: 0;
  }
}
.row {
  max-height: 10em;
  .columns {
    margin-top: 0;
    margin-bottom: 0;
  }
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s;
}
.expand-enter,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.item-row {
  position: relative;
}
.row-icon {
  position: absolute;
  top: 1.2em;
}
.row-text {
  margin-left: 2em;
}
.divider {
  margin-top: 2.5em;
  margin-bottom: 2em;
  border-top: #eee 2px solid;
}
</style>
