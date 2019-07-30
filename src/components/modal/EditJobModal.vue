<template lang="pug">
form
  div(class="modal-card")
    header(class="modal-card-head")
      p(class="modal-card-title") {{ title }}
    section(class="modal-card-body")
      b-field(label="Name")
        b-input(v-model="job.name")
      b-field(label="Points")
      b-field
        b-radio-button(v-for="option in pointOptions"
          v-model="job.points"
          :native-value="option.value"
          :key="option.value")
            span {{ option.text }}
    footer(class="modal-card-foot")
      button(class="button" type="button" @click.prevent="$parent.close()") Close
      button(:class="{ 'is-loading': isSaving }" class="button is-primary" @click.prevent="saveJob()") Save
</template>

<script>
import gql from 'graphql-tag'

export default {
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
    async saveJob () {
      if (this.job.id) {
        await this.updateJob()
      } else {
        await this.createJob()
      }
      this.$parent.close()
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
      })
      this.$parent.$parent.updateJob(this.newJob)
      this.$parent.close()
    }
  }
}
</script>

<style scoped>
</style>
