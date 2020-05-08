<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        h1.title Volunteers
        p.subtitle View and manage volunteers
  transition(name="long-fade")
    section.section(v-if="volunteers")
      .container
        .columns
          .column.is-10
            form.search-form(@submit.prevent)
              .control.has-icons-left
                input.input(placeholder="search" @input="searchInput")
                span.icon.is-small.is-left
                  font-awesome-icon(icon="search" size="1x")
          .column.has-text-right-tablet
            button.button.is-primary.is-fullwidth(@click="addVolunteer" v-if="canEdit")
              span.icon.is-small
                font-awesome-icon(icon="plus" size="1x")
              span Add Volunteer

        list-row(v-for="volunteer in allVolunteers"
          :key="volunteer.id"
          :title="volunteer | name"
          :subtitle="volunteer | showCount"
          icon="ticket-alt"
          :item="volunteer"
          :points="volunteer | points"
          v-on:action="showVolunteer")
</template>

<script>
import ListRow from '@/components/ListRow'
import infiniteScrollingMixin from '@/mixins/infiniteScrollingMixin'
import debounce from 'lodash/debounce'
import VOLUNTEER_LIST from '@/graphql/volunteers/list.gql'
import VOLUNTEER_SEARCH from '@/graphql/volunteers/search.gql'

export default {
  components: {
    ListRow
  },

  mixins: [
    infiniteScrollingMixin
  ],

  mounted () {
    window.scrollTo(0, 0)
  },

  data () {
    return {
      volunteers: null,
      allVolunteers: [],
      search: ''
    }
  },

  computed: {
    canEdit () {
      return this.$auth.has('staff')
    },
    names () {
      return this.search.split(/\s+/)
    },
    firstName () {
      return (this.names[0] || '') + '%'
    },
    lastName () {
      return (this.names[1] || '') + '%'
    },
    searching () {
      return this.search !== ''
    },
    query () {
      return this.searching ? VOLUNTEER_SEARCH : VOLUNTEER_LIST
    },
    queryVariables () {
      const variables = this.infiniteQueryVariables
      if (this.searching) {
        variables.first_name = this.firstName
        variables.last_name = this.lastName
        variables.withPoints = true
      } else {
        delete variables.first_name
        delete variables.last_name
        delete variables.withPoints
      }
      return variables
    }
  },

  filters: {
    name (person) {
      return person.first_name + ' ' + person.last_name
    },
    showCount (person) {
      const shows = person.volunteer_shows_aggregate
      const count = (shows && shows.aggregate.count) || 0
      return count + ' show' + (count === 1 ? '' : 's')
    },
    points (person) {
      return person.volunteer_shows_aggregate.aggregate.sum.points || 0
    }
  },

  apollo: {
    volunteers: {
      query () {
        return this.query
      },
      variables () {
        return this.queryVariables
      },
      update ({ volunteers }) {
        return this.processFetchedData(volunteers, this.allVolunteers)
      }
    }
  },

  methods: {
    searchInput: debounce(function (event) {
      this.allVolunteers = []
      this.page = 1
      this.search = event.target.value
    }, 300),
    addVolunteer () {
      this.$router.push({ name: 'new-volunteer' })
    },
    showVolunteer (item) {
      this.$router.push({ name: 'volunteer', params: { id: item.id } })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
