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
          .column(:class="canEdit ? 'is-10' : 'is-12'")
            form.search-form(@submit.prevent)
              .control.has-icons-left
                input.input(placeholder="search" @input="searchInput")
                span.icon.is-small.is-left
                  font-awesome-icon(icon="search" size="1x")
          .column.has-text-right-tablet(v-if="canEdit")
            button.button.is-primary.is-fullwidth(@click="addVolunteer")
              span.icon.is-small
                font-awesome-icon(icon="plus" size="1x")
              span Add Volunteer
        .columns
          .column
            .field.has-addons
              .control
                button.button.is-small(
                  :class="{ 'has-background-white-ter': filter === 'all' }"
                  :disabled="searching"
                  @click="filter = 'all'")
                  span All
              .control
                button.button.is-small(
                  :class="{ 'has-background-white-ter': filter === 'eligible' }"
                  :disabled="searching"
                  @click="filter = 'eligible'")
                  span Eligible

          .column
            .field.has-addons.is-pulled-right
              .control
                button.button.is-small(
                  :class="{ 'has-background-white-ter': sort === 'activity' }"
                  :disabled="searching"
                  @click="changeSort('activity')")
                  span.icon.is-small(v-if="sort === 'activity'")
                    font-awesome-icon(icon="sort" size="1x")
                  span Activity
              .control
                button.button.is-small(
                  :class="{ 'has-background-white-ter': sort === 'name' }"
                  :disabled="searching"
                  @click="changeSort('name')")
                  span.icon.is-small(v-if="sort === 'name'")
                    font-awesome-icon(icon="sort" size="1x")
                  span Name
              .control
                button.button.is-small(
                  :class="{ 'has-background-white-ter': sort === 'points' }"
                  :disabled="searching"
                  @click="changeSort('points')")
                  span.icon.is-small(v-if="sort === 'points'")
                    font-awesome-icon(icon="sort" size="1x")
                  span Points

        list-row(v-for="volunteer in allVolunteers"
          :key="volunteer.id"
          :title="volunteer | name"
          :badge="volunteer.awards | badge"
          :badgeColor="volunteer.awards | badgeColor"
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
import VOLUNTEER_ELIGIBLE from '@/graphql/volunteers/eligible.gql'
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
      search: '',
      sort: 'activity',
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
    },
    badge (awards) {
      if (!awards || !awards.length) return null
      return 'star'
    },
    badgeColor (awards) {
      if (!awards || !awards.length) return null
      return awards[0].level.color
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
    changeSort (sort) {
      if (this.sort === sort) return
      this.sort = sort
      this.resetResults()
    },
    resetResults () {
      this.allVolunteers = []
      this.page = 1
    },
    searchInput: debounce(function (event) {
      this.resetResults()
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
