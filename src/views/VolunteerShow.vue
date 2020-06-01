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
          p.subtitle Joined {{ prettyMonth(volunteer.joined_at) }}
    section.section
      .container
        .box
          .columns
            .column.has-text-centered
              p.is-size-4.is-marginless.has-text-black ALL STAR POINTS
              p.is-size-4.has-text-weight-medium.is-marginless
                font-awesome-icon.has-text-warning.is-size-4(icon="coins")
                span  {{ points }}
            .column.has-text-centered
              p.is-size-4.is-marginless.has-text-black MEMBERSHIP
              p.is-size-4.has-text-weight-medium.is-marginless
                span {{ membership }}

        template(v-if="volunteer.awards.length")
          br

          h2.title.is-4 Awards

          list-row(v-for="award in volunteer.awards"
            :bigIcon="{ icon: 'star', color: award.level.color }"
            :key="award.level.id"
            :title="award.level.name"
            :subtitle="prettyMonth(award.awarded_at)"
            icon="calendar-week"
            :item="award")

        template(v-if="shows.length")
          br

          h2.title.is-4 Shows

          list-row(v-for="data in shows"
            :key="data.show.id"
            :title="data.show.name"
            :subtitle="[prettyMonth(data.show.occurred_at), prettyJobs(data.show)]"
            :icon="['calendar-week', 'hammer']"
            :points="data.points"
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
        const max = this.$auth.tenant.max_points_per_show
        return sum + Math.min(show.points, max)
      }, 0)
    },
    canEdit () {
      return this.$auth.has('staff')
    },
    membership () {
      const enrollees = this.volunteer.enrollees
      return enrollees.length ? enrollees[0].enrollment.membership.name : 'None'
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

    prettyMonth (value) {
      const date = new Date(value + 'T12:00:00')
      const options = { year: 'numeric', month: 'long' }
      return date.toLocaleDateString('en-US', options)
    },

    editVolunteer () {
      this.$router.push({ name: 'edit-volunteer', params: { id: this.$route.params.id } })
    },

    editShow (show) {
      if (this.$auth.has('staff')) {
        this.$router.push({
          name: 'volunteer-show',
          params: {
            id: this.$route.params.id,
            show_id: show.id
          }
        })
      } else {
        this.$router.push({ name: 'show', params: { id: show.id } })
      }
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
