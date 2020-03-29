<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        p.title
          | {{ volunteer | fullName }}
          |
          a.is-size-6(@click="editVolunteer" v-if="canEdit('volunteers')") edit
        p.subtitle Joined {{ volunteer.joined_at | prettyMonth }}
  section.content
    div.container
      .box
        .columns
          .column.has-text-centered
            p.is-size-4.is-marginless.has-text-black ALL STAR POINTS
            p.is-size-4.has-text-weight-medium.is-marginless
              font-awesome-icon(icon="star" class="has-text-warning is-size-3")
              span  {{ points }}
          .column.has-text-centered
            p.is-size-4.is-marginless.has-text-black ALL STAR STATUS
            p.is-size-4.has-text-weight-medium.is-marginless
              span {{ status }}
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
import { VOLUNTEER_WITH_JOBS_AND_SHOWS } from '@/graphql/queries'
import ManageVolunteerJobsModal from '@/components/modal/ManageVolunteerJobsModal'
import ListRow from '@/components/ListRow'

export default {
  components: {
    ListRow
  },

  data () {
    return {
      volunteer: {}
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
    status () {
      return this.points >= 15 ? 'Eligible' : 'Ineligible'
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
      query: VOLUNTEER_WITH_JOBS_AND_SHOWS,
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

    handleApolloError (error) {
      this.batchError = error
      console.error(error)
      this.$buefy.toast.open({
        message: 'There was an error applying this action',
        type: 'is-danger'
      })
    },

    openModal (modal, props) {
      this.$buefy.modal.open({
        parent: this,
        component: modal,
        hasModalCard: true,
        props: props
      })
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
      if (!this.canEdit('shows')) {
        return
      }
      this.openModal(ManageVolunteerJobsModal, {
        show_id: show.id,
        volunteer: this.volunteer
      })
    },

    canEdit (type) {
      return this.$store.getters.can('edit-' + type)
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
