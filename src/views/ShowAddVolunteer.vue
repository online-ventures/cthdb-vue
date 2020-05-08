<template lang="pug">
transition(name="long-fade")
  div(v-if="show")
    section.hero.is-primary
      .hero-body
        .container
          h1.title {{ show.name }}
          p.subtitle Add volunteeer

    section.section
      .container
        w-notification(:message="error" type="danger" @closed="error = null")
        h2.title.is-size-4 Select job
        .columns
          .column.is-6
            .field
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="hammer")
                w-suggestion(
                  placeholder="job name"
                  v-model="job"
                  :minLength="1"
                  :items="filteredJobs"
                  :setLabel="setJobText"
                  @changed="updateJobSuggestions"
                  @selected="onJobSelected")

          .column.is-6
            .field
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="coins")
                input.input(
                  v-model="points"
                  placeholder="points"
                  type="number")

        h2.title.is-size-4 Add volunteers

        transition-group(name="expand" tag="div")
          .volunteer(v-for="volunteer in volunteers" :key="volunteer.id")
            .columns
              .column.is-10
                .field
                  .control.has-icons-left
                    span.icon.is-small
                      font-awesome-icon(icon="user")
                    w-suggestion(
                      placeholder="volunteer name"
                      v-model="volunteer.record"
                      :minLen="3"
                      :items="filteredVolunteers"
                      :setLabel="setVolunteerText"
                      @changed="updateVolunteerSuggestions"
                      @selected="onVolunteerSelected")

              .column.is-2
                button.button.is-danger.is-fullwidth(@click="removeVolunteer(volunteer.id)")
                  span.icon.is-small
                    font-awesome-icon(icon="trash")
                  span Delete

        br

        .columns
          .column
            .buttons
              button.button(@click="addVolunteer")
                span.icon.is-small
                  font-awesome-icon(icon="plus" size="1x")
                span Add volunteer
          .column
            .buttons.is-right
              button.button(@click="cancel")
                span Cancel
              button.button.is-primary(@click="save" :class="{ 'is-loading': saving }")
                span Save
</template>

<script>
import SHOW from '@/graphql/shows/find.gql'
import INSERT_POSITIONS from '@/graphql/positions/insertMany.gql'
import JOB_LIST from '@/graphql/jobs/active.gql'
import VOLUNTEER_SEARCH from '@/graphql/volunteers/search.gql'
import WSuggestion from '@/components/WSuggestion.vue'
import WNotification from '@/components/WNotification.vue'

export default {
  components: {
    WSuggestion,
    WNotification
  },

  mounted () {
  },

  data () {
    return {
      show: null,
      job: null,
      points: '',
      jobs: null,
      filteredJobs: [],
      filteredVolunteers: [],
      volunteerSearch: null,
      volunteers: [{ id: 1, record: null }],
      nextVolunteerId: 2,
      error: null,
      saving: false
    }
  },

  computed: {
    showId () {
      return parseInt(this.$route.params.id)
    },
    names () {
      return this.volunteerSearch.split(/\s+/)
    },
    firstName () {
      return (this.names[0] || '') + '%'
    },
    lastName () {
      return (this.names[1] || '') + '%'
    },
    insertVariables () {
      return {
        positions: this.volunteers
          .filter(volunteer => volunteer.record !== null)
          .map(volunteer => {
            return {
              volunteer_id: volunteer.record.id,
              show_id: this.showId,
              job_id: this.job.id,
              points: this.points * 2
            }
          })
      }
    }
  },

  apollo: {
    show: {
      skip () {
        return !this.showId
      },
      query: SHOW,
      variables () {
        return { id: this.showId }
      },
      update (data) {
        return data.shows_by_pk
      }
    },
    jobs: {
      query: JOB_LIST,
      update (data) {
        return data.jobs
      }
    },
    filteredVolunteers: {
      skip () {
        return !this.volunteerSearch
      },
      query: VOLUNTEER_SEARCH,
      variables () {
        return {
          first_name: this.firstName,
          last_name: this.lastName,
          offset: 0,
          limit: 15,
          withPoints: false
        }
      },
      update ({ volunteers }) {
        return volunteers
          .filter(volunteer => {
            return this.volunteers.every(existing => {
              return !existing.record || volunteer.id !== existing.record.id
            })
          })
          .map(volunteer => {
            return {
              id: volunteer.id,
              name: [volunteer.first_name, volunteer.last_name].join(' ')
            }
          })
      }
    }
  },

  methods: {
    cancel () {
      this.$router.push({ name: 'show-manage', params: { id: this.showId } })
    },
    addVolunteer () {
      this.volunteers.push({ id: this.nextVolunteerId, record: null })
      this.nextVolunteerId += 1
    },
    removeVolunteer (id) {
      this.volunteers = this.volunteers.filter(existing => existing.id !== id)
    },
    validate () {
      if (!this.job) {
        this.error = 'You need to select a job first'
        return false
      }
      if (!this.points) {
        this.error = 'You need to select a points first'
        return false
      }
      if (!this.volunteers.some(v => v.record !== null)) {
        this.error = 'You need to select at least 1 volunteer'
        return false
      }
      return true
    },
    async save () {
      if (!this.validate()) return
      this.saving = true
      await this.$apollo.mutate({
        mutation: INSERT_POSITIONS,
        variables: this.insertVariables
      })
      this.saving = false
      this.cancel()
    },
    setJobText (job) {
      return (job && job.name) || ''
    },
    updateJobSuggestions (name) {
      const words = name.split(/\s+/)
      const regex = new RegExp(words.join('.*'), 'i')
      this.filteredJobs = this.jobs.filter(job => job.name.match(regex))
    },
    onJobSelected (job) {
      this.filteredJobs = []
      this.points = job.points * 0.5
    },
    setVolunteerText (volunteer) {
      return (volunteer && volunteer.name) || ''
    },
    updateVolunteerSuggestions (name) {
      this.volunteerSearch = name
    },
    onVolunteerSelected (volunteer) {
      this.filtered = []
      this.volunteerSearch = null
    }
  }
}
</script>

<style scoped lang="scss">
.volunteer {
  max-height: 20em;
  margin: 0.75em 0;
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s;
}
.expand-enter {
  max-height: 0;
  opacity: 0;
}
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.expand-enter-to,
.expand-leave {
  max-height: 4em;
  margin: 0;
}
</style>
