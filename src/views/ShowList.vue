<template lang="pug">
div
  section(class="hero is-primary")
    div(class="hero-body")
      div(class="container")
        p(class="title") Show Listings
        p(class="subtitle") View and manage shows
  section(class="content")
    div(class="container")
      form(class="search-form" @submit.prevent)
        b-field
          b-input(icon="search" placeholder="search" type="search" v-model="search")
      list-row(v-for="show in showList"
        :key="show.id"
        :title="show.name"
        :subtitle="show.occurred_at | prettyMonth"
        icon="calendar-week"
        :item="show"
        v-on:action="manageShow")
      div(class="buttons")
        b-button(@click="moreShows" v-if="displayMore") See more
        b-button(type="is-primary" @click="newModal" icon-left="plus" v-if="canEdit") Add show
</template>

<script>
import gql from 'graphql-tag'
import ListRow from '@/components/ListRow'
import EditShowModal from '@/components/modal/EditShowModal'

export default {
  components: {
    ListRow,
    EditShowModal
  },

  created () {
    // Refetch on creation to invalidate a potentially outdated cache
    this.$apollo.queries.shows.refetch()
    this.$apollo.queries.showCount.refetch()
  },

  data () {
    return {
      search: '',
      shows: [],
      showCount: 0,
      allShows: [],
      ignoreShows: [],
      createdShows: 0,
      page: 1,
      rowsPerPage: 10
    }
  },

  computed: {
    canEdit () {
      return this.$store.getters.can('edit-shows')
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
    showList () {
      return this.searching ? this.shows : this.allShows
    },
    offset () {
      if (this.searching) {
        return 0
      } else {
        return (this.page - 1) * this.rowsPerPage
      }
    },
    displayMore () {
      return !this.searching &&
        this.allShows.length < (this.showCount + this.createdShows)
    },
    remainingCount () {
      return this.showCount - this.allShows.length
    },
    jobName () {
      return this.search + '%'
    }
  },

  apollo: {
    shows: {
      query: gql`query currentShows($name: String, $offset: Int!, $limit: Int!, $ignore: [Int!]) {
        shows(where: {_and: [{id: {_nin: $ignore}}, {name: {_ilike: $name}}]},
          order_by: {occurred_at: desc, name: asc},
          limit: $limit,
          offset: $offset) {
          id
          name
          occurred_at
        }
      }`,
      variables () {
        return {
          ignore: this.ignoreShows,
          offset: this.offset,
          name: this.jobName,
          limit: this.rowsPerPage
        }
      }
    },
    showCount: {
      query: gql`query showCount {
        shows_aggregate {
          aggregate {
            count
          }
        }
      }`,
      update (data) {
        return data.shows_aggregate.aggregate.count
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

  watch: {
    shows (shows) {
      if (!this.searching) {
        shows.forEach(show => {
          if (this.allShows.every((existing) => show.id !== existing.id)) {
            this.allShows.push(Object.assign({}, show))
          }
        })
      }
    }
  },

  methods: {
    moreShows () {
      this.page++
    },

    addShow (added) {
      this.ignoreShows.push(added.id)
      this.allShows.push(added)
      this.showCount++
      this.createdShows++
    },

    updateShow (updated) {
      const show = this.allShows.find(show => show.id === updated.id)
      Object.assign(show, updated)
    },

    openModal (props) {
      this.$buefy.modal.open({
        parent: this,
        component: EditShowModal,
        hasModalCard: true,
        props: props
      })
    },

    newModal () {
      this.openModal({
        title: 'New Show',
        item: {
          name: '',
          occurred_at: this.today
        }
      })
    },

    editModal (item) {
      this.openModal({
        title: 'Edit Show',
        item: item
      })
    },

    manageShow (item) {
      if (!this.canEdit) {
        return
      }
      this.$router.push({ name: 'show-manage', params: { id: item.id } })
    }
  }
}
</script>

<style scoped>
.search-form {
  margin-bottom: 1.5rem;
}
</style>
