<template lang="pug">
transition(name="long-fade")
  div(v-if="show")
    section.hero.is-primary
      .hero-body
        .container
          h1.title {{ volunteer.first_name }} {{ volunteer.last_name }}
          p.subtitle {{ show.show.name }}

    section.section
      .container
        .box
          .columns
            .column.has-text-centered
              p.is-size-4.is-marginless.has-text-black TOTAL JOBS
              p.has-text-weight-medium.is-marginless
                span.icon.is-large.has-text-grey
                  font-awesome-icon.is-size-4(icon="hammer")
                span.is-size-3 {{ positions.length }}

            .column.has-text-centered
              p.is-size-4.is-marginless.has-text-black POINTS EARNED
              p.has-text-weight-medium.is-marginless
                span.icon.is-large
                  font-awesome-icon.has-text-warning.is-size-4(icon="coins")
                span.is-size-3 {{ totalPoints }}

        br

        .buttons
          button.button.is-secondary(@click="addNewPosition")
            span.icon.is-small
              font-awesome-icon(icon="plus")
            span Add new job

        div(v-for="position in positions")
          .columns.has-background-light
            .column.is-6
              .field
                .control.has-icons-left
                  span.icon.is-small
                    font-awesome-icon(icon="hammer")
                  w-suggestion(
                    placeholder="job name"
                    v-model="position.job"
                    :minLength="1"
                    :items="filteredJobs"
                    :setLabel="setJobText"
                    @changed="updateSuggestions"
                    @selected="onJobSelected(position)")

            .column.is-4
              .field
                .control.has-icons-left
                  span.icon.is-small
                    font-awesome-icon(icon="coins")
                  input.input(
                    v-model="position.points"
                    placeholder="points"
                    type="number"
                    @change="onChange(position)")

            .column.is-2
              button.button.is-danger.is-fullwidth(@click="remove(position)")
                span.icon.is-small
                  font-awesome-icon(icon="trash")
                span Delete

          br.is-hidden-tablet
          br.is-hidden-tablet

        .buttons.is-right
          button.button.is-primary(@click="done")
            span Done

</template>

<script>
import VOLUNTEER from '@/graphql/volunteers/find.gql'
import INSERT_POSITION from '@/graphql/positions/insert.gql'
import UPDATE_POSITION from '@/graphql/positions/update.gql'
import DELETE_POSITION from '@/graphql/positions/delete.gql'
import JOB_LIST from '@/graphql/jobs/active.gql'
import WSuggestion from '@/components/WSuggestion.vue'

export default {
  components: {
    WSuggestion
  },

  mounted () {
  },

  data () {
    return {
      volunteer: null,
      show: null,
      jobs: null,
      filteredJobs: [],
      positions: null
    }
  },

  filters: {},

  computed: {
    volunteerId () {
      return parseInt(this.$route.params.id)
    },
    showId () {
      return parseInt(this.$route.params.show_id)
    },
    returnTo () {
      return this.$route.params.from
    },
    totalPoints () {
      const total = this.positions.reduce((sum, position) => {
        return sum + position.points
      }, 0)
      return Math.min(total, 3)
    }
  },

  apollo: {
    volunteer: {
      query: VOLUNTEER,
      skip () {
        return !this.volunteerId
      },
      variables () {
        return { id: this.volunteerId }
      },
      update (data) {
        const volunteer = data.volunteers_by_pk
        const shows = volunteer.volunteer_shows
        this.show = shows && shows.find(show => show.show.id === this.showId)
        this.positions = []
        this.show.show.positions.forEach(position => {
          this.positions.push({
            points: position.points * 0.5,
            currentJob: position.job,
            job: position.job
          })
        })
        return volunteer
      }
    },
    jobs: {
      query: JOB_LIST,
      variables () {
        return { tenant_id: this.$auth.tenantId }
      },
      update (data) {
        return data.jobs
      }
    }
  },

  methods: {
    isDeletedJob (jobId) {
      return jobId && this.jobs && this.jobs.every(active => active.id !== jobId)
    },
    done () {
      if (this.returnTo === 'show') {
        this.$router.push({ name: 'show', params: { id: this.showId } })
      } else {
        this.$router.push({ name: 'volunteer', params: { id: this.volunteerId } })
      }
    },
    addNewPosition () {
      this.positions.push({
        points: 0,
        currentJob: null,
        job: null
      })
    },
    onChange (position) {
      let mutation = position.currentJob === null
        ? this.insert(position)
        : this.update(position)
      mutation.then(result => {
        const data = result.data.update_positions || result.data.insert_positions
        const newPosition = data.returning[0]
        position.currentJob = position.job
        position.points = newPosition.points * 0.5
      })
    },
    remove (position) {
      return this.$apollo.mutate({
        mutation: DELETE_POSITION,
        variables: {
          volunteerId: this.volunteerId,
          showId: this.showId,
          jobId: position.job.id
        }
      }).then(result => {
        this.positions = this.positions.filter(existing => existing.job.id !== position.job.id)
      })
    },
    insert (position) {
      return this.$apollo.mutate({
        mutation: INSERT_POSITION,
        variables: {
          volunteerId: this.volunteerId,
          showId: this.showId,
          jobId: position.job.id
        }
      })
    },
    update (position) {
      const points = position.job.id === position.currentJob.id ? position.points * 2 : null
      return this.$apollo.mutate({
        mutation: UPDATE_POSITION,
        variables: {
          volunteerId: this.volunteerId,
          showId: this.showId,
          jobId: position.currentJob.id,
          newJobId: position.job.id,
          points: points
        }
      })
    },
    setJobText (job) {
      return (job && job.name) || ''
    },
    updateSuggestions (name) {
      const words = name.split(/\s+/)
      const regex = new RegExp(words.join('.*'), 'i')
      this.filteredJobs = this.jobs
        .filter(job => job.name.match(regex))
        .filter(job => this.positions.every(pos => job.id !== pos.job.id))
    },
    onJobSelected (position) {
      this.filteredJobs = []
      this.onChange(position)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
