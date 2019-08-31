<template lang="pug">
form(ref="jobForm")
  div(class="modal-card")
    header(class="modal-card-head")
      p(class="modal-card-title") {{ title }}
    section(class="modal-card-body")
      b-field(label="Name")
        b-input(v-model="job.name" required)
      b-field(label="Points")
      b-field
        b-radio-button(v-for="option in pointOptions"
          v-model="job.points"
          :native-value="option.value"
          :key="option.value")
            span {{ option.text }}
    footer(class="modal-card-foot")
      b-button(@click.prevent="$parent.close()") Cancel
      b-button(:class="{ 'is-loading': isSaving }"
        type="is-primary"
        icon-left="save"
        @click.prevent="saveRecord()") Save
      b-button(type="is-danger"
        v-if="job.id"
        icon-left="trash"
        @click.prevent="confirmDeleteJob()") Delete
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
      default: 'New Job'
    },
    item: {
      type: Object
    }
  },

  data () {
    return {
      job: {},
      savingCounter: 0,
      pointOptions: [
        { text: '0', value: 0 },
        { text: '0.5', value: 1 },
        { text: '1', value: 2 },
        { text: '2', value: 4 },
        { text: '3', value: 6 }
      ]
    }
  },

  created () {
    this.job = {
      id: this.item.id,
      name: this.item.name,
      points: this.item.points
    }
  },

  computed: {
    isSaving () {
      return this.savingCounter > 0
    },
    newJob () {
      return {
        id: this.job.id,
        name: this.job.name,
        points: this.job.points
      }
    }
  },

  methods: {
    async saveRecord () {
      if (!this.validateRecord()) {
        return
      } else if (this.job.id) {
        await this.updateJob()
      } else {
        await this.createJob()
      }
      this.$parent.close()
    },

    validateRecord () {
      if (this.$refs.jobForm.checkValidity()) {
        return true
      } else {
        this.$refs.jobForm.reportValidity()
        return false
      }
    },

    async createJob () {
      await this.$apollo.mutate({
        mutation: gql`mutation createJob($name:String!, $points:Int!) {
          insert_jobs(objects: {name: $name, points: $points}) {
            returning {
              id
              name
              points
            }
          }
        }`,
        variables: {
          name: this.job.name,
          points: this.job.points
        },
        loadingKey: 'savingCounter'
      }).then((result) => {
        const newJob = result.data.insert_jobs.returning[0]
        this.$parent.$parent.addJob(newJob)
      }).catch((error) => {
        const message = 'There was an error creating this job.'
        this.handleApolloError(error, message)
      })
      this.$parent.close()
    },

    async updateJob () {
      await this.$apollo.mutate({
        mutation: gql`mutation updateJob($id:Int!, $name:String!, $points:Int!) {
          update_jobs(where: {id: {_eq: $id}}, _set: {name: $name, points: $points}) {
            affected_rows
          }
        }`,
        variables: {
          id: this.job.id,
          name: this.job.name,
          points: this.job.points
        },
        loadingKey: 'savingCounter'
      }).catch((error) => {
        const message = 'There was an error updating this job.'
        this.handleApolloError(error, message)
      })
      this.$parent.$parent.updateJob(this.newJob)
      this.$parent.close()
    },

    confirmDeleteJob () {
      this.$buefy.dialog.confirm({
        title: 'Remove Job',
        message: 'Are you sure you want to <b>remove</b> this job? ' +
          'Removing it here will not affect volunteers that have performed it in the past.',
        confirmText: 'Remove job',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: this.deleteJob
      })
    },

    async deleteJob () {
      await this.$apollo.mutate({
        mutation: gql`mutation updateJob($id:Int!) {
          update_jobs(where: {id: {_eq: $id}}, _set: {deleted_at: "now()"}) {
            affected_rows
          }
        }`,
        variables: {
          id: this.job.id
        },
        loadingKey: 'savingCounter'
      }).catch((error) => {
        const message = 'There was an error deleting this job.'
        this.handleApolloError(error, message)
      })
      if (!this.apolloError) {
        this.$parent.$parent.onJobRemoved(this.job)
        this.$buefy.toast.open({
          message: 'Job removed',
          type: 'is-success'
        })
      }
      this.$parent.close()
    }
  }
}
</script>

<style scoped>
</style>
