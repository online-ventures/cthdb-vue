<template lang="pug">
transition(name="long-fade")
  div(v-if="job")
    section.hero.is-primary
      .hero-body
        .container
          h1.title
            | {{ job.name }}
            |
            a.is-size-6(@click="editJob" v-if="canEdit") edit
          p.subtitle Created {{ prettyMonth(job.created_at) }}
    section.section
      .container
        .box
          .columns
            .column.has-text-centered
              p.is-size-4.is-marginless.has-text-black ALL STAR POINTS
              p.is-size-4.has-text-weight-medium.is-marginless
                font-awesome-icon.has-text-warning.is-size-3(icon="star")
                span  {{ job.points }}
            .column.has-text-centered
              p.is-size-4.is-marginless.has-text-black VOLUNTEERS
              p.is-size-4.has-text-weight-medium.is-marginless
                span {{ jobCount(job) }}

        br

        list-row(v-for="row in allVolunteers"
          :key="row.volunteer.id"
          :title="row.volunteer | fullName"
          :subtitle="[row.show.name, prettyMonth(row.show.occurred_at)]"
          :awards="row.volunteer.awards"
          :enrollment="row.volunteer | enrollment"
          :icon="['ticket-alt', 'calendar-week']"
          :points="volunteerPoints(row.volunteer)"
          :item="row"
          v-on:action="viewVolunteer(row.volunteer)")
</template>

<script>
import JOB from '@/graphql/jobs/find.gql'
import VOLUNTEERS from '@/graphql/jobs/volunteers.gql'
import ListRow from '@/components/ListRow'
import infiniteScrollingMixin from '@/mixins/infiniteScrollingMixin'

export default {
  components: {
    ListRow
  },

  mixins: [
    infiniteScrollingMixin
  ],

  data () {
    return {
      job: null,
      volunteers: null,
      allVolunteers: [],
      infiniteIdKey: 'volunteer_id'
    }
  },

  computed: {
    jobId () {
      return parseInt(this.$route.params.id)
    },
    canEdit () {
      return this.$auth.has('staff')
    },
    volunteerVariables () {
      return Object.assign(this.infiniteQueryVariables, { id: this.jobId })
    }
  },

  filters: {
    fullName (volunteer) {
      return volunteer.first_name + ' ' + volunteer.last_name
    },
    enrollment (volunteer) {
      if (!volunteer.enrollees.length) return null
      return volunteer.enrollees[0].enrollment
    }
  },

  apollo: {
    job: {
      query: JOB,
      variables () {
        return { id: this.jobId }
      },
      update (data) {
        return data.jobs_by_pk
      }
    },
    volunteers: {
      query: VOLUNTEERS,
      variables () {
        return this.volunteerVariables
      },
      update (data) {
        return this.processFetchedData(data.job_volunteers, this.allVolunteers)
      }
    }
  },

  methods: {
    jobCount (job) {
      const count = job.positions_aggregate.aggregate.count
      const text = count === 1 ? 'person' : 'people'
      return Intl.NumberFormat('en-US').format(count) + ' ' + text
    },
    volunteerPoints (data) {
      return data.volunteer_shows_aggregate.aggregate.sum.points
    },
    prettyMonth (value) {
      const dateText = value.length <= 10 ? value + 'T12:00:00' : value
      const date = new Date(dateText)
      const options = { year: 'numeric', month: 'long' }
      return date.toLocaleDateString('en-US', options)
    },

    editJob () {
      if (!this.canEdit) return
      this.$router.push({
        name: 'edit-job',
        params: { id: this.jobId }
      })
    },

    viewVolunteer (volunteer) {
      this.$router.push({
        name: 'volunteer',
        params: { id: volunteer.id }
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
