<template lang="pug">
div
  section(class="hero is-primary")
    div(class="hero-body")
      div(class="container")
        p(class="title") Show Listings
        p(class="subtitle") View and manage shows
  section(class="content")
    div(class="container")
      list-row(v-for="show in allShows"
        :key="show.id"
        :title="show.name"
        :subtitle="show.occurred_at | prettyMonth"
        icon="calendar-week"
        :item="show"
        :onClick="editModal")
      div(class="buttons")
        b-button(@click="moreShows" v-if="displayMore") See more
        b-button(type="is-primary" @click="newModal" icon-left="plus") Add show
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

  data () {
    return {
      shows: [],
      showCount: 0,
      allShows: [],
      ignoreShows: [],
      page: 1,
      rowsPerPage: 5
    }
  },

  computed: {
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
    offset () {
      return (this.page - 1) * this.rowsPerPage
    },
    displayMore () {
      return this.allShows.length < this.showCount
    }
  },

  apollo: {
    shows: {
      query: gql`query currentShows($offset: Int!, $limit: Int!, $ignore: [Int!]) {
        shows(where: {id: {_nin: $ignore}},
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
      shows.forEach(show => {
        if (this.allShows.every((existing) => show.id !== existing.id)) {
          this.allShows.push(Object.assign({}, show))
        }
      })
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
    },

    updateShow (updated) {
      const show = this.allShows.find(show => show.id === updated.id)
      Object.assign(show, updated)
    },

    openModal (props) {
      this.$modal.open({
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
    }
  }
}
</script>

<style scoped>
.row:hover {
  background: hsl(0, 0%, 96%);
  cursor: pointer;
}
.content {
  margin-top: 1em;
}
</style>
