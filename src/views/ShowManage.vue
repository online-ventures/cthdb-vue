<template lang="pug">
transition(name="long-fade")
  div(v-if="show")
    section.hero.is-primary
      .hero-body
        .container
          h1.title
            | {{ show.name }}
            |
            a.is-size-6(@click="editShow") edit
          p.subtitle {{ show.occurred_at | prettyMonth }}

    section.section
      .container
        .buttons
          button.button.is-secondary(@click="addVolunteer")
            span.icon.is-small
              font-awesome-icon(icon="plus")
            span Add volunteers

        list-row(v-for="row in show.volunteer_shows"
          :key="row.volunteer.id"
          :title="row.volunteer | fullName"
          :subtitle="row.volunteer.positions | jobList"
          icon="hammer"
          icon-type="is-grey-light"
          :item="row"
          :points="row.points"
          v-on:action="editVolunteer")
</template>

<script>
import ListRow from '@/components/ListRow'
import SHOW from '@/graphql/shows/find.gql'

export default {
  components: {
    ListRow
  },

  mounted () {
    window.scrollTo(0, 0)
  },

  data () {
    return {
      show: null
    }
  },

  computed: {
    showId () {
      return parseInt(this.$route.params.id)
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
    jobList (positions) {
      return positions.map(position => position.job.name).join(', ')
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
    }
  },

  methods: {
    addVolunteer () {
      this.$router.push({
        name: 'show-add-volunteer',
        params: {
          id: this.showId
        }
      })
    },
    editVolunteer (volunteerShow) {
      this.$router.push({ name: 'volunteer-show',
        params: {
          id: volunteerShow.volunteer.id,
          show_id: this.showId,
          from: 'show'
        }
      })
    },
    editShow () {
      this.$router.push({ name: 'edit-show', params: { id: this.showId } })
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
