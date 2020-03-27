<template lang="pug">
form(ref="volunteerForm" @submit.prevent="saveRecords")
  div(class="modal-card")
    header(class="modal-card-head")
      p(class="modal-card-title") {{ volunteer | name }}'s Jobs

    section(class="modal-card-body")
      b-tabs(v-model="selectedTab")

        b-tab-item(label="Existing jobs" icon="hammer")
          div(class="list-outer")
            div(v-for="position in currentPositions" class="columns row")
              div(class="column")
                p(class="title is-4") {{ position.job.name }}
              div(class="column")
                b-tooltip(label="Number of hours performing this job")
                  b-input(v-model="position.hours" placeholder="hours" type="number" icon="clock")

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
              b-button(@click.prevent="$parent.close") Cancel
            div(class="level-item")
              b-button(:class="{ 'is-loading': isSaving }"
                type="is-primary"
                icon-left="save"
                @click.prevent="saveRecords") Save
          div(class="level-right")
            div(class="level-item")
              b-button(type="is-danger"
                icon-left="trash"
                @click.prevent="confirmDeleteVolunteer") Delete
</template>

<script>
import gql from 'graphql-tag'
import { VOLUNTEER_POSITIONS, cache } from '@/graphql/queries'
import ListRow from '@/components/ListRow'
import differenceBy from 'lodash/differenceBy'

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
      existingPositions: [],
      currentPositions: null,
      allJobs: [],
      savingCounter: 0,
      selectedTab: 0
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
    updatedPositions () {
      return this.currentPositions
        .map(position => {
          return {
            show_id: this.show_id,
            volunteer_id: this.volunteer.id,
            job_id: position.job.id,
            hours: position.hours
          }
        })
    },
    droppedPositions () {
      return differenceBy(
        this.existingPositions,
        this.currentPositions,
        position => position.job.id)
    }
  },

  filters: {
    name (person) {
      return person.first_name + ' ' + person.last_name
    }
  },

  apollo: {
    existingPositions: {
      query: VOLUNTEER_POSITIONS,
      variables () {
        return {
          volunteer_id: this.volunteer.id,
          show_id: this.show_id
        }
      },
      update (data) {
        const existing = data.positions
        if (this.currentPositions == null) {
          this.currentPositions = []
          existing.forEach(p => this.currentPositions.push(Object.assign({}, p)))
        }
        if (!existing.length) this.selectedTab = 1
        return existing
      }
    },
    allJobs: {
      query: gql`query jobs($name: String, $job_ids: [Int!]) {
          jobs(
            where: {_and: [
              {name: {_ilike: $name}},
              {deleted_at: {_is_null: true}}]}
            order_by: {name: asc}) {
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
      if (!this.currentPositions) return false
      return this.currentPositions.some(position => position.job.id === job.id)
    },

    onCheck (job) {
      if (this.currentPositions.some(position => position.job.id === job.id)) {
        this.currentPositions = this.currentPositions.filter(p => p.job.id !== job.id)
      } else {
        const newPosition = { job: job, hours: null }
        this.currentPositions.push(newPosition)
        this.resortPositions()
      }
    },

    resortPositions () {
      this.currentPositions.sort((a, b) => a.job.name.localeCompare(b.job.name))
    },

    async saveRecords () {
      await this.updatePositions()
      await this.deleteRows()
      await this.insertOrDeleteVolunteer()
      this.$parent.$parent.onPositionsChanged(this.volunteer, this.currentPositions)
      this.$parent.close()
    },

    async updatePositions () {
      await this.$apollo.mutate({
        mutation: gql`mutation addRecords($objects:[positions_insert_input!]!) {
          insert_positions(
            objects: $objects,
            on_conflict: {
              constraint: positions_show_id_volunteer_id_job_id_key,
              update_columns: [hours]
          }) {
            returning {
              id
              show {
                id
                name
                occurred_at
              }
              volunteer {
                id
                first_name
                last_name
              }
              job {
                id
                name
              }
              points
              hours
            }
          }
        }`,
        variables: {
          objects: this.updatedPositions
        },
        update (store, result) {
          cache.onAddPosition(store, result)
        },
        loadingKey: 'savingCounter'
      })
    },

    async deleteRows () {
      if (!this.droppedPositions.length) {
        return
      }
      const jobIds = this.droppedPositions.map(position => position.job.id)
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
            returning {
              id
              volunteer_id
              show_id
            }
          }
        }`,
        variables: {
          show_id: this.show_id,
          volunteer_id: this.volunteer.id,
          job_ids: jobIds
        },
        loadingKey: 'savingCounter',
        update (store, result) {
          cache.onDeletePosition(store, result)
        }
      })
    },

    async insertOrDeleteVolunteer () {
      if (this.currentPositions.length && !this.existingPositions.length) {
        this.deleteEmptyJob()
      } else if (!this.currentPositions.length && this.existingPositions.length) {
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
            returning {
              id
            }
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
            returning {
              id
              show_id
              volunteer_id
              job_id
              hours
            }
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
            returning {
              id
            }
          }
        }`,
        variables: {
          show_id: this.show_id,
          volunteer_id: this.volunteer.id
        },
        loadingKey: 'savingCounter'
      })
      this.$parent.$parent.onVolunteerRemoved(this.volunteer, this.show_id)
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
