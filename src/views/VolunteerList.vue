<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        p.title Volunteers
        p.subtitle View and manage volunteers
  section
    .content
      .container
        .columns
          .column
            form.search-form(@submit.prevent)
              b-field
                b-input(icon="search" ref="search" placeholder="search" type="search" @input="searchInput")
          .column.has-text-right
            b-button(type="is-primary" @click="addVolunteer" icon-left="plus" v-if="canEdit") Add volunteer
        list-row(v-for="volunteer in allVolunteers"
          :key="volunteer.id"
          :title="volunteer | name"
          :subtitle="volunteer | showCount"
          icon="ticket-alt"
          :item="volunteer"
          v-on:action="showVolunteer")
        infinite-loading(@infinite="infiniteHandler")
</template>

<script>
import ListRow from '@/components/ListRow'
import InfiniteLoading from 'vue-infinite-loading'
import debounce from 'lodash/debounce'
import { VOLUNTEER_LIST, SEARCH_VOLUNTEER_LIST } from '@/graphql/queries'

export default {
  components: {
    InfiniteLoading,
    ListRow
  },

  mounted () {
    window.scrollTo(0, 0)
    setTimeout(() => {
      this.$refs.search.focus()
    }, 100)
  },

  data () {
    return {
      volunteers: [],
      allVolunteers: [],
      search: '',
      pageNum: 0,
      rowsPerPage: 15
    }
  },

  computed: {
    canEdit () {
      return this.$store.getters.can('edit-volunteers')
    },
    page () {
      return this.pageNum <= 1 ? 1 : this.pageNum
    },
    offset () {
      return (this.page - 1) * this.rowsPerPage
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
      return this.searching ? SEARCH_VOLUNTEER_LIST : VOLUNTEER_LIST
    },
    queryVariables () {
      return {
        offset: this.offset,
        limit: this.rowsPerPage,
        first_name: this.firstName,
        last_name: this.lastName
      }
    },
    searchSensitiveQueryVariables () {
      return Object.keys(this.queryVariables).reduce((map, attribute) => {
        if (attribute === 'offset' || attribute === 'limit' || this.searching) {
          map[attribute] = this.queryVariables[attribute]
        }
        return map
      }, {})
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
    }
  },

  apollo: {
    volunteers: {
      fetchPolicy: 'no-cache',
      loadingKey: 'loading',
      query () {
        return this.query
      },
      variables () {
        return this.searchSensitiveQueryVariables
      }
    }
  },

  watch: {
    volunteers (volunteers) {
      volunteers.forEach(person => {
        this.allVolunteers.push(person)
      })
      if (this.infinite) {
        if (volunteers.length > 0) {
          this.infinite.loaded()
        } else {
          this.infinite.complete()
        }
      }
    }
  },

  methods: {
    searchInput: debounce(function (value) {
      this.allVolunteers = []
      this.pageNum = 1
      this.search = value
    }, 300),

    infiniteHandler ($state) {
      this.pageNum++
      this.infinite = $state
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
.search-form {
}
</style>
