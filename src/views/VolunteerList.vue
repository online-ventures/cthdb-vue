<template lang="pug">
div
  w-hero(title="Volunteers" subtitle="View and manage volunteers")

  transition(name="long-fade")
    section.section(v-if="volunteers")
      .container

        .columns
          .column(v-if="canEdit")
            w-button.is-primary.is-fullwidth(@click="addVolunteer" icon="plus")
              span Add Volunteer
          .column(:class="canEdit ? 'is-10' : 'is-12'")
            form.search-form(@submit.prevent)
              w-field(icon="search")
                w-input(
                  placeholder="search"
                  :debounce="searchInput"
                  :disabled="filter !== 'all'"
                )

        .columns
          .column
            w-select(
              :options="filters"
              v-model="filter"
              :disabled="searching"
              selectedClass="has-background-white-ter"
              selectedIcon="filter"
              buttonClass="is-small"
              @input="resetResults"
            )

          .column
            w-select.is-pulled-right(
              :options="sorts"
              v-model="sort"
              :disabled="searching || filter === 'members'"
              selectedClass="has-background-white-ter"
              selectedIcon="sort"
              buttonClass="is-small"
            )

        list-row(v-for="volunteer in allVolunteers"
          :key="volunteer.id"
          :title="volunteer | name"
          :awards="volunteer.awards"
          :enrollment="volunteer.enrollment"
          :subtitle="subtitle(volunteer)"
          icon="ticket-alt"
          :item="volunteer"
          :points="volunteer | points"
          v-on:action="showVolunteer")
</template>

<script>
import ListRow from '@/components/ListRow'
import infiniteScrollingMixin from '@/mixins/infiniteScrollingMixin'
import VOLUNTEER_LIST from '@/graphql/volunteers/list.gql'
import VOLUNTEER_ELIGIBLE from '@/graphql/volunteers/eligible.gql'
import VOLUNTEER_SEARCH from '@/graphql/volunteers/search.gql'
import VOLUNTEER_MEMBERS from '@/graphql/volunteers/members.gql'

export default {
  name: 'VolunteerList',

  components: {
    ListRow
  },

  mixins: [
    infiniteScrollingMixin
  ],

  data () {
    return {
      volunteers: null,
      allVolunteers: [],
      search: '',
      sorts: [
        { value: 'activity', text: 'Activity' },
        { value: 'name', text: 'Name' },
        { value: 'points', text: 'Points' }
      ],
      sort: 'activity',
      filters: [
        { value: 'all', text: 'All' },
        { value: 'eligible', text: 'Eligible' },
        { value: 'members', text: 'Members' }
      ],
      filter: 'all'
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
      if (this.searching) {
        return VOLUNTEER_SEARCH
      } else if (this.filter === 'eligible') {
        return VOLUNTEER_ELIGIBLE
      } else if (this.filter === 'members') {
        return VOLUNTEER_MEMBERS
      } else {
        return VOLUNTEER_LIST
      }
    },
    querySort () {
      let primary = ''
      if (this.sort === 'activity') {
        primary = 'recently_involved_at'
      } else if (this.sort === 'points') {
        primary = 'points'
      }
      if (this.sort === 'name' || this.searching) {
        return [{ last_name: 'asc' }, { first_name: 'asc' }]
      }
      return [
        { [primary]: 'desc_nulls_last' },
        { last_name: 'asc' },
        { first_name: 'asc' }
      ]
    },
    queryVariables () {
      const variables = this.infiniteQueryVariables
      variables.tenant_id = this.$auth.tenantId
      if (this.searching) {
        variables.first_name = this.firstName
        variables.last_name = this.lastName
      } else {
        delete variables.first_name
        delete variables.last_name
      }
      variables.sort = this.querySort
      return variables
    }
  },

  filters: {
    name (person) {
      return person.first_name + ' ' + person.last_name
    },
    showCount (person) {
      const count = person.shows
      return count + ' show' + (count === 1 ? '' : 's')
    },
    points (person) {
      return person.points || 0
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
      update (data) {
        const volunteers = data.volunteer_list || data.volunteer_eligible
        return this.processFetchedData(volunteers, this.allVolunteers)
      }
    }
  },

  methods: {
    subtitle (volunteer) {
      if (this.filter !== 'members' || !volunteer.enrollment) {
        const count = volunteer.shows
        return count + ' show' + (count === 1 ? '' : 's')
      }
      return 'Expires: ' + this.prettyDate(volunteer.enrollment.end_date)
    },
    prettyDate (value) {
      const date = new Date(value + 'T12:00:00')
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    },
    changeSort (sort) {
      if (this.sort === sort) return
      this.sort = sort
      this.resetResults()
    },
    resetResults () {
      this.allVolunteers = []
      this.page = 1
    },
    searchInput (data) {
      this.resetResults()
      this.search = data.value
    },
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
