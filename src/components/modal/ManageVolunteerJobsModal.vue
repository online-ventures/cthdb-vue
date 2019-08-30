<template lang="pug">
form(ref="volunteerForm" @submit.prevent="saveRecords()")
  div(class="modal-card")
    header(class="modal-card-head")
      p(class="modal-card-title") {{ volunteer | name }}'s Jobs

    section(class="modal-card-body")
      b-tabs(v-model="selectedTab")

        b-tab-item(label="Existing jobs" icon="hammer")
          div(class="list-outer")
            div(v-for="job in currentJobs" class="columns row")
              div(class="column")
                p(class="title is-4") {{ job.name }}
              div(class="column")
                b-tooltip(label="Number of hours performing this job")
                  b-input(v-model="job.hours" placeholder="hours" type="number" icon="clock")

        b-tab-item(label="Add / Remove" icon="plus")
          div(class="list-outer")

            list-row(v-for="job in allJobs"
              :key="job.id"
              :title="job.name"
              :item="job"
              checkable
              :checked="isSelected(job)"
              v-on:check="onCheck")

    footer(class="modal-card-foot")
      div(class="container")
        div(class="level")
          div(class="level-left")
            div(class="level-item")
              b-button(@click.prevent="$parent.close()") Cancel
            div(class="level-item")
              b-button(:class="{ 'is-loading': isSaving }"
                type="is-primary"
                icon-left="save"
                @click.prevent="saveRecords()") Save
          div(class="level-right")
            div(class="level-item")
              b-button(type="is-danger"
                icon-left="trash"
                @click.prevent="confirmDeleteVolunteer()") Delete
</template>

<script>
import gql from 'graphql-tag'
import ListRow from '@/components/ListRow'

export default {
  components: {
    ListRow
  },

  props: {
    show_id: {
      type: Number,
      required: true
    },
    volunteer: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      search: '',
      currentJobs: [],
      allJobs: [],
      savingCounter: 0,
      selectedTab: 0
    }
  },

  created () {
    // Create a copy of the existin jobs so we can make edits freely in this modal
    this.existingJobs.forEach((job) => this.currentJobs.push(Object.assign({}, job)))
    if (!this.existingJobs.length) {
      this.selectedTab = 1
    }
  },

  computed: {
    isSaving () {
      return this.savingCounter > 0
    },
    searching () {
      return this.search !== ''
    },
    searchTerm () {
      return this.search + '%'
    },
    currentJobIds () {
      return this.currentJobs.map((j) => j.id)
    },
    existingJobs () {
      return this.volunteer.jobs.filter(Boolean)
    },
    existingJobIds () {
      return this.existingJobs.map((j) => j.id)
    },
    newPositions () {
      if (this.currentJobs.length) {
        return this.currentJobs.map((job) => this.buildPosition(job))
      } else {
        return [this.buildPosition(null)]
      }
    },
    insertPositions () {
      return this.currentJobs
        .filter((job) => !this.existingJobIds.includes(job.id))
        .map((job) => {
          return {
            show_id: this.show_id,
            volunteer_id: this.volunteer.id,
            job_id: job.id,
            hours: null
          }
        })
    },
    deleteJobs () {
      return this.existingJobIds.filter((id) => !this.currentJobIds.includes(id))
    }
  },

  filters: {
    name (person) {
      return person.first_name + ' ' + person.last_name
    }
  },

  apollo: {
    allJobs: {
      query: gql`query jobs($name: String, $job_ids: [Int!]) {
          jobs(where:
            {name: {_ilike: $name}},
            order_by: {name: asc},
            limit: 500) {
              id
              name
            }
      }`,
      variables () {
        return {
          name: this.searchTerm,
          job_ids: this.existing
        }
      },
      update (data) {
        return data.jobs
      }
    }
  },

  methods: {
    isSelected (job) {
      return this.currentJobIds.includes(job.id)
    },

    buildPosition (job) {
      const hours = job ? job.hours : null
      return {
        show_id: this.show_id,
        volunteer: {
          id: this.volunteer.id,
          first_name: this.volunteer.first_name,
          last_name: this.volunteer.last_name
        },
        job: job,
        hours: hours
      }
    },

    onCheck (job) {
      if (this.currentJobIds.includes(job.id)) {
        this.currentJobs = this.currentJobs.filter((j) => j.id !== job.id)
      } else {
        const newJob = { id: job.id, name: job.name, hours: null }
        this.currentJobs.push(newJob)
      }
    },

    async saveRecords () {
      await this.insertRows()
      await this.deleteRows()
      await this.insertOrDeleteVolunteer()
      this.$parent.$parent.onPositionsChanged(this.newPositions)
      this.$parent.close()
    },

    async insertRows () {
      await this.$apollo.mutate({
        mutation: gql`mutation addRecords($objects:[positions_insert_input!]!) {
          insert_positions(objects: $objects) {
            affected_rows
          }
        }`,
        variables: {
          objects: this.insertPositions
        },
        loadingKey: 'savingCounter'
      })
    },

    async deleteRows () {
      if (!this.deleteJobs.length) {
        return
      }
      await this.$apollo.mutate({
        mutation: gql`mutation deleteRecords(
          $show_id:Int!,
          $volunteer_id:Int!,
          $job_ids:[Int!]
        ) {
          delete_positions(where: {
            show_id: {_eq: $show_id},
            volunteer_id: {_eq: $volunteer_id},
            job_id: {_in: $job_ids}}
          ) {
            affected_rows
          }
        }`,
        variables: {
          show_id: this.show_id,
          volunteer_id: this.volunteer.id,
          job_ids: this.deleteJobs
        },
        loadingKey: 'savingCounter'
      })
    },

    async insertOrDeleteVolunteer () {
      if (this.currentJobs.length && !this.existingJobs.length) {
        this.deleteEmptyJob()
      } else if (!this.currentJobs.length && this.existingJobs.length) {
        this.insertEmptyJob()
      }
    },

    async deleteEmptyJob () {
      await this.$apollo.mutate({
        mutation: gql`mutation deleteRecords(
          $show_id:Int!,
          $volunteer_id:Int!
        ) {
          delete_positions(where: {
            show_id: {_eq: $show_id},
            volunteer_id: {_eq: $volunteer_id},
            job_id: {_is_null: true}}
          ) {
            affected_rows
          }
        }`,
        variables: {
          show_id: this.show_id,
          volunteer_id: this.volunteer.id
        },
        loadingKey: 'savingCounter'
      })
    },

    async insertEmptyJob () {
      await this.$apollo.mutate({
        mutation: gql`mutation addRecords($objects:[positions_insert_input!]!) {
          insert_positions(objects: $objects) {
            affected_rows
          }
        }`,
        variables: {
          objects: {
            show_id: this.show_id,
            volunteer_id: this.volunteer.id
          }
        },
        loadingKey: 'savingCounter'
      })
    },

    confirmDeleteVolunteer () {
      this.$buefy.dialog.confirm({
        title: 'Remove Volunteer',
        message: 'Are you sure you want to <b>remove</b> this volunteer from this show? ' +
          'This volunteer itself will be kept in the database.',
        confirmText: 'Remove volunteer',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: this.deleteVolunteer
      })
    },

    async deleteVolunteer () {
      await this.$apollo.mutate({
        mutation: gql`mutation deleteRecords(
          $show_id:Int!,
          $volunteer_id:Int!
        ) {
          delete_positions(where: {
            show_id: {_eq: $show_id},
            volunteer_id: {_eq: $volunteer_id}}
          ) {
            affected_rows
          }
        }`,
        variables: {
          show_id: this.show_id,
          volunteer_id: this.volunteer.id
        },
        loadingKey: 'savingCounter'
      })
      this.$parent.$parent.onVolunteerRemoved(this.volunteer)
      this.$buefy.toast.open({
        message: 'Volunteer removed',
        type: 'is-success'
      })
      this.$parent.close()
    }
  }
}
</script>

<style scoped lang="scss">
.search-form {
  margin-bottom: 1.5rem;
}
.list-outer {
  height: 20rem;
}
.row {
}
</style>
