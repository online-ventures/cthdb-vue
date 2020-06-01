<template lang="pug">
div
  section.section
    .container

      w-notification(
        :message="notification"
        :type="notificationType"
        :lifetime="2"
        @closed="notification = null")

      h2.title.is-4.has-help-icon
        | {{ itemText }}s
        template(v-if="helpText")
          |
          a.icon.is-small.has-text-link.is-size-6(:title="helpText")
            font-awesome-icon(icon="question-circle")

      .buttons
        button.button.is-primary(
          @click="addItem"
          :class="{ 'is-loading': updating }")
          span.icon.is-small
            font-awesome-icon(icon="plus" size="1x")
          span Add {{ itemText }}

      transition(name="expand")
        p.has-text-centered.is-italic(v-if="newItems.length === 0")
          | No {{ itemText.toLowerCase() }}s have been added yet.

      template(v-if="newItems.length > 0")
        .columns.headings.is-hidden-mobile
          .column(v-for="(column, i) in columns" :key="i")
            p.is-size-6.has-text-weight-bold {{ column.header }}
          .column.is-2

        transition-group(name="expand" tag="div")
          .row(v-for="item in newItems" :key="item.id")
            .columns
              .column(v-for="(column, i) in columns" :key="i")
                label.label.is-hidden-tablet {{ column.header }}
                .field(v-if="isInput(column.type)")
                  .control.has-icons-left
                    span.icon.is-small(v-if="column.icon")
                      font-awesome-icon(:icon="column.icon")
                    w-input(v-model="item[column.field]"
                      required
                      :type="column.type"
                      :minlength="column.minlength"
                      :maxlength="column.maxlength"
                      :min="column.min"
                      :max="column.max"
                      :debounce="updateItem"
                      :debounceItem="item")
                .field(v-if="column.type === 'toggle'")
                  w-toggle.is-fullwidth(
                    v-model="item[column.field]"
                    :yesText="column.yesText"
                    :noText="column.noText"
                    @change="updateItem({ valid: true, item: item })")
                .field(v-if="column.type === 'badge-color'")
                  badge-color(
                    v-model="item[column.field]"
                    @change="updateItem({ valid: true, item: item })")
              .column.is-2
                button.button.is-danger.is-fullwidth(@click="deletingItem = item")
                  span.icon.is-small
                    font-awesome-icon(icon="trash")
                  span Delete

            .is-hidden-tablet(v-if="item.id !== newItems[newItems.length-1].id")
              hr.divider

  .insert-target(ref="insertTarget")

  w-confirm(
    :accepted="removeItem"
    :cancelled="cancelConfirmation"
    :title="confirmTitle"
    :item="deletingItem"
    :name="deleteName")
</template>

<script>
import animateScrollTo from 'animated-scroll-to'
import BadgeColor from '@/components/BadgeColor'

export default {
  components: {
    BadgeColor
  },

  props: {
    title: {
      type: String,
      required: false
    },
    itemName: {
      type: String,
      required: true
    },
    helpText: {
      type: String,
      required: false,
      default: null
    },
    columns: {
      type: Array,
      required: true
    },
    listMutation: {
      type: Object,
      required: true
    },
    insertMutation: {
      type: Object,
      required: true
    },
    updateMutation: {
      type: Object,
      required: true
    },
    deleteMutation: {
      type: Object,
      required: true
    },
    deleteName: {
      type: Function,
      required: false,
      default: item => item.name
    },
    skip: {
      type: Function,
      required: false,
      default: () => false
    },
    listVariables: {
      type: Object,
      required: true
    },
    newItem: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      updating: false,
      items: null,
      newItems: [],
      generatedId: 1,
      notification: null,
      notificationType: null,
      deletingItem: null
    }
  },

  computed: {
    confirmTitle () {
      return 'Remove ' + this.itemText.toLowerCase() + ' confirmation'
    },
    itemText () {
      return this.title || this.itemName
    }
  },

  watch: {
    listVariables (value) {
      this.listVariables = value
    }
  },

  apollo: {
    items: {
      query () {
        return this.listMutation
      },
      skip () {
        return this.skip()
      },
      variables () {
        return this.listVariables
      },
      update (data) {
        const items = this.getRecords(data)
        if (items) {
          items.forEach(item => {
            const index = this.newItems.findIndex(existing => {
              return existing.id === item.id
            })
            if (index >= 0) {
              this.newItems[index] = { ...item }
            } else {
              this.newItems.push({ ...item })
            }
          })
          return items
        }
        console.log('Cannot find results for listing items from result set')
        return []
      }
    }
  },

  methods: {
    isInput (type) {
      return ['text', 'email', 'number', 'color', 'date', 'tel', 'url'].includes(type)
    },
    async runMutation (mutation, variables, success) {
      if (this.updating) return false
      try {
        this.updating = true
        delete variables.__typename
        const result = await this.$apollo.mutate({
          mutation: mutation,
          variables: variables
        })
        this.updating = false
        if (success) this.notify(success)
        return result
      } catch (error) {
        this.updating = false
        console.log(error)
        this.notify('There was an error processing this ' + this.itemText, 'danger')
        return null
      }
    },
    getRecords (data) {
      const field = Object.keys(data).find(key => {
        const recordName = this.itemName.toLowerCase() + 's'
        if (key === recordName) return true
        if (key === 'insert_' + recordName) return true
        if (key === 'update_' + recordName) return true
        return false
      })
      if (field.startsWith('insert_') || field.startsWith('update_')) {
        return data[field].returning
      } else if (field) {
        return data[field]
      }
      return null
    },
    async removeItem () {
      if (!this.deletingItem) return
      const itemId = this.deletingItem.id
      const result = await this.deleteItem(itemId)
      if (result) {
        this.newItems = this.newItems.filter(item => item.id !== itemId)
      }
    },
    async addItem () {
      const result = await this.runMutation(
        this.insertMutation,
        this.newItem(this.newItems),
        this.itemText + ' created successfully'
      )
      animateScrollTo(this.$refs.insertTarget)
      const record = this.getRecords(result.data)[0]
      this.newItems.push({ ...record })
    },
    updateItem (data) {
      if (data.valid) {
        this.runMutation(
          this.updateMutation,
          data.item,
          this.itemText + ' updated successfully'
        )
      }
    },
    deleteItem (id) {
      return this.runMutation(
        this.deleteMutation,
        { id: id },
        this.itemText + ' was successfully deleted'
      )
    },
    cancelConfirmation () {
      this.deletingItem = null
    },
    notify (message, type = 'success') {
      this.notification = message
      this.notificationType = type
    },
    nextId () {
      this.generatedId += 1
      return this.generatedId - 1
    }
  }
}
</script>

<style scoped lang="scss">
.headings {
  .column {
    padding-bottom: 0;
    p {
      margin-left: 0.25em;
    }
  }
  margin-bottom: 0;
}
.has-help-icon {
  line-height: 1.2em;
  .icon {
    margin-left: 0.25em;
  }
}
.row {
  max-height: 30em;
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
.insert-target {
  display: none;
}
.divider {
  margin-top: 2.5em;
  margin-bottom: 2em;
  border-top: #eee 2px solid;
}
</style>
