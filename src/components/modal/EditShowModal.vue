<template lang="pug">
form(ref="showForm")
  div(class="modal-card")
    header(class="modal-card-head")
      p(class="modal-card-title") {{ title }}
    section(class="modal-card-body")
      b-field(label="Name")
        b-input(v-model="show.name" required)
      b-field(label="Month")
        div(class="buttons")
          b-radio-button(v-for="monthOption in months"
            v-model="month"
            :native-value="monthOption.value"
            :key="monthOption.value"
            required)
              span {{ monthOption.text }}
      b-field(label="Year")
        b-input(type="number" v-model="year" required)
    footer(class="modal-card-foot")
      b-button(@click.prevent="$parent.close()") Cancel
      b-button(:class="{ 'is-loading': isSaving }"
        type="is-primary"
        icon-left="save"
        @click.prevent="saveShow()") Save
</template>

<script>
import gql from 'graphql-tag'
import apolloMixin from '@/mixins/apolloMixin'

export default {
  mixins: {
    apolloMixin
  },

  props: {
    title: {
      type: String,
      default: 'New Show'
    },
    item: {
      type: Object
    }
  },

  data () {
    return {
      show: {},
      savingCounter: 0,
      year: null,
      month: null,
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
    Object.assign(this.show, this.item)
    this.year = this.occurredDate[0]
    this.month = this.occurredDate[1]
  },

  computed: {
    occurredDate () {
      return this.show.occurred_at.split('-')
    },
    newOccurredAt () {
      return this.year + '-' + this.month + '-01'
    },
    isSaving () {
      return this.savingCounter > 0
    },
    newShow () {
      return {
        id: this.show.id,
        name: this.show.name,
        occurred_at: this.newOccurredAt
      }
    }
  },

  methods: {
    async saveShow () {
      if (!this.validateRecord()) {
        return
      } else if (this.show.id) {
        await this.updateShow()
      } else {
        await this.createShow()
      }
      this.$parent.close()
    },

    validateRecord () {
      if (this.$refs.showForm.checkValidity()) {
        return true
      } else {
        this.$refs.showForm.reportValidity()
        return false
      }
    },

    async createShow () {
      await this.$apollo.mutate({
        mutation: gql`mutation createShow($name:String!, $occurred_at:date!) {
          insert_shows(objects: {name: $name, occurred_at: $occurred_at}) {
            returning {
              id
              name
              occurred_at
            }
          }
        }`,
        variables: {
          name: this.show.name,
          occurred_at: this.newOccurredAt
        },
        loadingKey: 'savingCounter'
      }).then((result) => {
        const newShow = result.data.insert_shows.returning[0]
        this.$parent.$parent.addShow(newShow)
      }).catch((error) => {
        const message = 'There was an error creating this show.'
        this.handleApolloError(error, message)
      })
      this.$parent.close()
    },

    async updateShow () {
      const show = {
        id: this.show.id,
        name: this.show.name,
        occurred_at: this.newOccurredAt
      }
      await this.$apollo.mutate({
        mutation: gql`mutation updateShow($id:Int!, $name:String!, $occurred_at:date!) {
          update_shows(where: {id: {_eq: $id}}, _set: {name: $name, occurred_at: $occurred_at}) {
            returning {
              id
              name
              occurred_at
            }
          }
        }`,
        variables: show,
        loadingKey: 'savingCounter'
      }).then((result) => {
        this.$parent.$parent.onShowUpdated(show)
      }).catch((error) => {
        const message = 'There was an error updating this show.'
        this.handleApolloError(error, message)
      })
      this.$parent.close()
    }
  }
}
</script>

<style scoped>
</style>
