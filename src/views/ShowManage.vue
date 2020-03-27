<template lang="pug">
div
  section(class="hero is-primary")
    div(class="hero-body")
      div(class="container")
        p(class="title")
          | {{ show.name }}
          |
          a(class="is-size-6" @click="editShow") edit
        p(class="subtitle") {{ show.occurred_at | prettyMonth }}
  section(class="content")
    div(class="container")
      div(class="level")
        div(class="level-left")
          div(class="level-item")
            b-button(type="is-primary" @click="addVolunteer" icon-left="plus") Add volunteer
          div(class="level-item")
            b-switch(v-model="batchEdit") Batch add jobs
          div(class="level-item" v-if="batchEdit")
            b-select(placeholder="Select a job" v-model="batchJob" icon="hammer" rounded size="is-small")
              option(v-for="job in allJobs" :value="job") {{ job.name }}
          div(class="level-item" v-if="batchEdit")
            b-button(type="is-primary" @click="applyBatch" rounded size="is-small") Add Jobs
      list-row(v-for="volunteer in volunteers"
        :key="volunteer.id"
        :title="volunteer | fullName"
        :subtitle="volunteer.jobs | jobList"
        icon="user-check"
        :icon-type="volunteer | iconColor"
        :item="volunteer"
        v-on:action="editVolunteer"
        v-on:check="onCheck"
        :checkable="batchEdit"
        :checked="alreadySelected(volunteer)")
</template>

<script>
import gql from 'graphql-tag'
import ListRow from '@/components/ListRow'
import EditShowModal from '@/components/modal/EditShowModal'
import AddShowVolunteerModal from '@/components/modal/AddShowVolunteerModal'
import ManageVolunteerJobsModal from '@/components/modal/ManageVolunteerJobsModal'
import clone from 'lodash/clone'

export default {
  components: {
    ListRow,
    EditShowModal,
    AddShowVolunteerModal,
    ManageVolunteerJobsModal
  },

  created () {
    this.$apollo.queries.showData.refetch()
  },

  data () {
    return {
      show: {},
      allJobs: [],
      selectedVolunteers: [],
      batchJob: null,
      positions: [],
      showData: null,
      batchEditValue: false,
      batchError: null
    }
  },

  computed: {
    uniqueVolunteerIds () {
      return this.positions
        .map((p) => p.volunteer.id)
        .filter((v, i, a) => a.indexOf(v) === i)
    },
    volunteers () {
      return this.uniqueVolunteerIds
        .map(id => {
          return Object.assign({}, this.positions.find(p => p.volunteer.id === id).volunteer)
        })
        .map((v) => { v.jobs = this.volunteerJobs(v); return v })
    },
    batchEdit: {
      get () {
        return this.batchEditValue
      },
      set (value) {
        if (!value) {
          this.batchJob = null
          this.batchError = null
          this.selectedVolunteers = []
        }
        this.batchEditValue = value
      }
    },
    batchPositions () {
      return this.selectedVolunteers
        .filter((volunteer) => {
          return !volunteer.jobs.map((j) => j && j.id).includes(this.batchJob.id)
        })
        .map((volunteer) => {
          return {
            show: this.show,
            volunteer: volunteer,
            job: this.batchJob,
            hours: null
          }
        })
    },
    batchPositionGraphql () {
      return this.batchPositions
        .map((p) => {
          return {
            show_id: p.show.id,
            volunteer_id: p.volunteer.id,
            job_id: p.job.id,
            hours: null
          }
        })
    },
    selectedVolunteerIds () {
      return this.selectedVolunteers.map((v) => v.id)
    }
  },

  filters: {
    prettyMonth (value) {
      const date = new Date(value + 'T12:00:00')
      const options = { year: 'numeric', month: 'long' }
      return date.toLocaleDateString('en-US', options)
    },
    fullName (volunteer) {
      return volunteer.first_name + ' ' + volunteer.last_name
    },
    jobList (jobs) {
      jobs = jobs.filter(Boolean)
      if (jobs.length === 0) {
        return 'No jobs selected yet'
      }
      return jobs.map((j) => j.name).join(', ')
    },
    iconColor (volunteer) {
      const empty = volunteer.jobs.length === 1 && !volunteer.jobs[0]
      return 'is-' + (empty ? 'grey-light' : 'success')
    }
  },

  apollo: {
    showData: {
      query: gql`query show($id: Int!) {
        shows_by_pk(id: $id) {
          id
          name
          occurred_at
          positions(order_by: { volunteer: { last_name: asc, first_name: asc }}) {
            id
            volunteer {
              id
              first_name
              last_name
            }
            job {
              id
              name
            }
            hours
          }
        }
      }`,
      variables () {
        return {
          id: this.$route.params.id
        }
      },
      update (data) {
        return data.shows_by_pk
      }
    },
    allJobs: {
      query: gql`query jobs {
        jobs(where: {deleted_at: {_is_null: true}}, order_by: {name: asc}) {
          id
          name
        }
      }`,
      update (data) {
        return data.jobs
      }
    }
  },

  watch: {
    showData (show) {
      this.show = {
        id: show.id,
        name: show.name,
        occurred_at: show.occurred_at
      }
      this.positions = clone(show.positions)
    }
  },

  methods: {
    alreadySelected (volunteer) {
      return this.selectedVolunteerIds.includes(volunteer.id)
    },

    validateBatch () {
      if (!this.selectedVolunteers.length) {
        this.$buefy.toast.open({
          message: 'Select volunteers first',
          type: 'is-danger'
        })
        return false
      }
      if (!this.batchJob) {
        this.$buefy.toast.open({
          message: 'Select a job to apply to the volunteers first',
          type: 'is-danger'
        })
        return false
      }
      if (!this.batchPositions.length) {
        this.$buefy.toast.open({
          message: 'These volunteers already have this job.  All set!',
          type: 'is-warning'
        })
        return false
      }
      return true
    },

    async applyBatch () {
      if (this.batchEditWorking || !this.validateBatch()) {
        return
      }
      await this.insertBatchJobs()
      this.notifyBatchSuccess()
    },

    async insertBatchJobs () {
      this.batchEditWorking = true
      await this.$apollo.mutate({
        mutation: gql`mutation addJobs($objects:[positions_insert_input!]!) {
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
          objects: this.batchPositionGraphql
        }
      }).catch((error) => {
        this.handleApolloError(error)
      })
      await this.$apollo.mutate({
        mutation: gql`mutation deleteRecords(
          $show_id:Int!,
          $volunteer_ids:[Int!]
        ) {
          delete_positions(where: {
            show_id: {_eq: $show_id},
            volunteer_id: {_in: $volunteer_ids},
            job_id: {_is_null: true}}
          ) {
            returning {
              id
            }
          }
        }`,
        variables: {
          show_id: this.show.id,
          volunteer_ids: this.selectedVolunteerIds
        }
      }).catch((error) => {
        this.handleApolloError(error)
      })
    },

    notifyBatchSuccess () {
      if (this.batchError) {
        return
      }
      // Delete empty jobs if they didn't have any yet
      this.positions = this.positions.filter((p) => {
        return !this.selectedVolunteerIds.includes(p.volunteer.id) || p.job
      })
      // Add these new jobs to each volunteer in the list
      this.batchPositions.forEach((p) => this.positions.push(p))
      this.resortPositions()
      this.batchEditWorking = false
      this.$buefy.toast.open({
        message: 'Job added to selected volunteers successfully',
        type: 'is-success'
      })
      this.batchEdit = false
      // console.log(this.positions)
    },

    handleApolloError (error) {
      this.batchError = error
      console.error(error)
      this.$buefy.toast.open({
        message: 'There was an error applying this action',
        type: 'is-danger'
      })
    },

    onCheck (item) {
      if (this.selectedVolunteerIds.includes(item.id)) {
        this.selectedVolunteers = this.selectedVolunteers.filter((v) => v.id !== item.id)
      } else {
        this.selectedVolunteers.push(item)
      }
    },

    buildJobFromPosition (position) {
      if (!position.job) {
        return null
      } else {
        return {
          id: position.job.id,
          name: position.job.name,
          hours: position.hours
        }
      }
    },

    volunteerJobs (volunteer) {
      return this.positions
        .filter((p) => p.volunteer.id === volunteer.id)
        .map((p) => this.buildJobFromPosition(p))
        .sort((a, b) => a.name.localeCompare(b.name))
    },

    openModal (modal, props) {
      this.$buefy.modal.open({
        parent: this,
        component: modal,
        hasModalCard: true,
        props: props
      })
    },

    editShow () {
      this.openModal(EditShowModal, {
        title: 'Edit Show',
        item: this.show
      })
    },

    onShowUpdated (show) {
      this.show = show
    },

    addVolunteer () {
      this.openModal(AddShowVolunteerModal, {
        item: this.show,
        existingPositions: this.positions
      })
    },

    onVolunteersAdded (positions) {
      positions.forEach((p) => this.positions.push(p))
      this.resortPositions()
      // console.log(this.positions)
    },

    editVolunteer (volunteer) {
      if (this.batchEdit) {
        return
      }
      this.openModal(ManageVolunteerJobsModal, {
        show_id: this.show.id,
        volunteer: volunteer
      })
    },

    onPositionsChanged (volunteer, positions) {
      this.positions = this.positions.filter(p => p.volunteer.id !== volunteer.id)
      positions.forEach(position => {
        this.positions.push({
          id: position.id,
          volunteer: {
            id: volunteer.id,
            first_name: volunteer.first_name,
            last_name: volunteer.last_name
          },
          job: position.job,
          hours: position.hours
        })
      })
      this.resortPositions()
    },

    onVolunteerRemoved (volunteer) {
      this.positions = this.positions.filter((p) => p.volunteer.id !== volunteer.id)
      this.resortPositions()
    },

    resortPositions () {
      this.positions.sort((a, b) => {
        const lname = a.volunteer.last_name.localeCompare(b.volunteer.last_name)
        if (lname === 0) {
          return a.volunteer.first_name.localeCompare(b.volunteer.first_name)
        } else {
          return lname
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.title a {
  color: white;
  font-weight: normal;
}
.title a:hover {
  text-decoration: underline;
}
</style>
