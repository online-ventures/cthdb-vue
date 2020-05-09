<template lang="pug">
transition(name="long-fade")
  div(v-if="volunteer")
    section.hero.is-primary
      .hero-body
        .container
          h1.title
            | {{ volunteer | fullName }}
            |
            a.is-size-6(@click="editVolunteer" v-if="canEdit") edit
          p.subtitle Joined {{ volunteer.joined_at | prettyMonth }}
    section.section
      .container
        .box
          .columns
            .column.has-text-centered
              p.is-size-4.is-marginless.has-text-black ALL STAR POINTS
              p.is-size-4.has-text-weight-medium.is-marginless
                font-awesome-icon.has-text-warning.is-size-3(icon="star")
                span  {{ points }}
            .column.has-text-centered
              p.is-size-4.is-marginless.has-text-black AWARDS
              p.is-size-4.has-text-weight-medium.is-marginless
                span {{ awards }}

        br

        list-row(v-for="data in shows"
          :key="data.show.id"
          :title="data.show.name"
          :subtitle="prettyJobs(data.show)"
          :points="data.points"
          icon="ticket-alt"
          :item="data.show"
          v-on:action="editShow")
</template>

<script>
import VOLUNTEER from '@/graphql/volunteers/find.gql'
import ListRow from '@/components/ListRow'

export default {
  components: {
    ListRow
  },

  data () {
    return {
      volunteer: null
    }
  },

  computed: {
    shows () {
      if (!this.volunteer) return []
      return this.volunteer.volunteer_shows
    },
    points () {
      if (!this.shows) return 0
      return this.shows.reduce((sum, show) => {
        return sum + Math.min(show.points, 6)
      }, 0) * 0.5
    },
    canEdit () {
      return this.$auth.has('staff')
    },
    awards () {
      const awards = this.volunteer.awards.map(award => award.level.name)
      return awards.length === 0 ? 'None' : awards.join(', ')
    }
  },

  filters: {
    fullName (volunteer) {
      if (volunteer) {
        return volunteer.first_name + ' ' + volunteer.last_name
      } else {
        return ''
      }
    },
    prettyMonth (value) {
      const date = new Date(value + 'T12:00:00')
      const options = { year: 'numeric', month: 'long' }
      return date.toLocaleDateString('en-US', options)
    },
    iconColor (volunteer) {
      const empty = volunteer.jobs.length === 1 && !volunteer.jobs[0]
      return 'is-' + (empty ? 'grey-light' : 'success')
    }
  },

  apollo: {
    volunteer: {
      query: VOLUNTEER,
      variables () {
        return {
          id: parseInt(this.$route.params.id)
        }
      },
      update (data) {
        return data.volunteers_by_pk
      }
    }
  },

  methods: {
    prettyJobs (show) {
      return show.positions
        .map(position => position.job.name)
        .sort().join(', ')
    },

    editVolunteer () {
      this.$router.push({ name: 'edit-volunteer', params: { id: this.$route.params.id } })
    },

    onPositionsChanged (volunteer, positions) {
      // this.$apollo.queries.volunteer.refetch()
    },

    onVolunteerRemoved (volunteer, showId) {
      this.$apollo.queries.volunteer.refetch()
    },

    editShow (show) {
      if (!this.$auth.has('staff')) return
      this.$router.push({
        name: 'volunteer-show',
        params: {
          id: this.$route.params.id,
          show_id: show.id
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
