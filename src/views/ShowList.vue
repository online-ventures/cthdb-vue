<template lang="pug">
div
  w-hero(title="Show Listings" subtitle="View and manage shows")

  transition(name="long-fade")
    section.section(v-if="shows")
      .container

        .columns
          .column(v-if="canEdit")
            w-button.is-primary.is-fullwidth(@click="addShow" icon="plus")
              span Add Show
          .column(:class="canEdit ? 'is-10' : 'is-12'")
            form.search-form(@submit.prevent)
              w-field(icon="search")
                w-input(placeholder="search" :debounce="searchInput")

        list-row(v-for="show in allShows"
          :key="show.id"
          :title="show.name"
          :subtitle="show.occurred_at | prettyMonth"
          icon="calendar-week"
          :item="show"
          v-on:action="manageShow")
</template>

<script>
import ListRow from '@/components/ListRow'
import infiniteScrollingMixin from '@/mixins/infiniteScrollingMixin'
import SHOW_LIST from '@/graphql/shows/list.gql'
import SHOW_SEARCH from '@/graphql/shows/search.gql'

export default {
  components: {
    ListRow
  },

  mixins: [
    infiniteScrollingMixin
  ],

  data () {
    return {
      shows: null,
      allShows: [],
      search: ''
    }
  },

  computed: {
    canEdit () {
      return this.$auth.has('staff')
    },
    today () {
      const now = new Date()
      const month = now.getMonth() + 1
      const mm = (month > 9 ? '' : '0') + month
      return [now.getFullYear(), mm, '01'].join('-')
    },
    years () {
      const yrs = []
      for (let year = new Date().getFullYear() + 1; year >= 2000; year--) {
        yrs.push({ text: year.toString(), value: year.toString() })
      }
      return yrs
    },
    searching () {
      return this.search !== ''
    },
    showName () {
      return '%' + this.search + '%'
    },
    query () {
      return this.searching ? SHOW_SEARCH : SHOW_LIST
    },
    queryVariables () {
      const variables = this.infiniteQueryVariables
      variables.tenant_id = this.$auth.tenantId
      if (this.searching) {
        variables.search = this.showName
      } else {
        delete variables.search
      }
      return variables
    }
  },

  apollo: {
    shows: {
      query () {
        return this.query
      },
      variables () {
        return this.queryVariables
      },
      update ({ shows }) {
        return this.processFetchedData(shows, this.allShows)
      }
    }
  },

  filters: {
    prettyMonth (value) {
      const date = new Date(value + 'T12:00:00')
      const options = { year: 'numeric', month: 'long' }
      return date.toLocaleDateString('en-US', options)
    }
  },

  methods: {
    searchInput (data) {
      this.allShows = []
      this.page = 1
      this.search = data.value
    },
    addShow () {
      this.$router.push({ name: 'new-show' })
    },
    editShow (item) {
      this.$router.push({ name: 'edit-show', params: { id: item.id } })
    },
    manageShow (item) {
      this.$router.push({ name: 'show', params: { id: item.id } })
    }
  }
}
</script>

<style scoped>
</style>
