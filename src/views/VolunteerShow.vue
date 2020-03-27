<template lang="pug">
div
  section(class="hero is-primary")
    div(class="hero-body")
      div(class="container")
        p(class="title")
          | {{ volunteer | fullName }}
          |
          a(class="is-size-6" @click="editVolunteer" v-if="canEdit('volunteers')") edit
        p(class="subtitle") Joined {{ volunteer.joined_at | prettyMonth }}
  section(class="content")
    div(class="container")
      list-row(v-for="show in shows"
        :key="show.id"
        :title="show.name"
        :subtitle="prettyJobs(show)"
        icon="ticket-alt"
        :item="show"
        v-on:action="editShow")
</template>

<script>
import { VOLUNTEER_WITH_JOBS_AND_SHOWS } from '@/graphql/queries'
import ListRow from '@/components/ListRow'
import EditVolunteerModal from '@/components/modal/EditVolunteerModal'
import ManageVolunteerJobsModal from '@/components/modal/ManageVolunteerJobsModal'
import uniqBy from 'lodash/uniqBy'

export default {
  components: {
    ListRow,
    EditVolunteerModal,
    ManageVolunteerJobsModal
  },

  data () {
    return {
      volunteer: {}
    }
  },

  computed: {
    shows () {
      if (!this.volunteer || !this.volunteer.positions) {
        return []
      }
      return uniqBy(this.volunteer.positions.map(position => position.show), 'id')
    }
  },

  filters: {
    fullName (volunteer) {
      return volunteer.first_name + ' ' + volunteer.last_name
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
      return this.volunteer.positions
        .filter(position => position.show.id === show.id)
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

    editVolunteer (volunteer) {
      this.openModal(EditVolunteerModal, {
        title: 'Edit volunteer',
        item: volunteer
      })
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
