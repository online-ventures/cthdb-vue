<template lang="pug">
div
  section(class="hero is-primary")
    div(class="hero-body")
      div(class="container")
        p(class="title") Volunteers
        p(class="subtitle") View and manage volunteers
  section
    div(class="content")
      div(class="container")
        form(class="search-form" @submit.prevent)
          b-field
            b-input(icon="search" placeholder="search" type="search" v-model="search")
        list-row(v-for="volunteer in volunteerList"
          :key="volunteer.id"
          :title="volunteer | name"
          :subtitle="volunteer | showCount"
          icon="ticket-alt"
          :item="volunteer"
          v-on:action="editModal")
        div(class="buttons")
          b-button(@click="moreVolunteers" v-if="displayMore") See more ({{ remainingCount }})
          b-button(type="is-primary" @click="newModal" icon-left="plus") Add volunteer
</template>

<script>
import gql from 'graphql-tag'
import ListRow from '@/components/ListRow'
import EditVolunteerModal from '@/components/modal/EditVolunteerModal'

export default {
  components: {
    ListRow,
    EditVolunteerModal
  },

  created () {
    // Refetch on creation to invalidate a potentially outdated cache
    this.$apollo.queries.volunteers.refetch()
    this.$apollo.queries.volunteerCount.refetch()
  },

  data () {
    return {
      volunteers: [],
      volunteerCount: 0,
      createdVolunteers: 0,
      allVolunteers: [],
      ignoreVolunteers: [],
      search: '',
      page: 1,
      rowsPerPage: 5
    }
  },

  computed: {
    offset () {
      if (this.searching) {
        return 0
      } else {
        return (this.page - 1) * this.rowsPerPage
      }
    },
    searching () {
      return this.search !== ''
    },
    displayMore () {
      return !this.searching &&
        this.allVolunteers.length < (this.volunteerCount + this.createdVolunteers)
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
    volunteerList () {
      return this.searching ? this.volunteers : this.allVolunteers
    },
    remainingCount () {
      return this.volunteerCount + this.createdVolunteers - this.allVolunteers.length
    }
  },

  apollo: {
    volunteers: {
      query: gql`query currentVolunteers($offset: Int!,
        $limit: Int!, $ignore: [Int!], $first_name: String, $last_name: String) {
          volunteers(where: {
            _and: [
              {id: {_nin: $ignore}},
              {_or: [
                {first_name: {_ilike: $first_name}},
                {last_name: {_ilike: $first_name}}
              ]},
              {_or: [
                {first_name: {_ilike: $last_name}},
                {last_name: {_ilike: $last_name}}
              ]},
            ]},
            order_by: {last_name: asc, first_name: asc},
            limit: $limit,
            offset: $offset) {
              id
              first_name
              last_name
              email
              phone
              street
              city
              positions_aggregate(distinct_on: show_id) {
                aggregate {
                  count
                }
              }
            }
      }`,
      variables () {
        return {
          ignore: this.ignoreVolunteers,
          offset: this.offset,
          limit: this.rowsPerPage,
          first_name: this.firstName,
          last_name: this.lastName
        }
      }
    },
    volunteerCount: {
      query: gql`query volunteerCount {
        volunteers_aggregate {
          aggregate {
            count
          }
        }
      }`,
      update (data) {
        return data.volunteers_aggregate.aggregate.count
      }
    }
  },

  filters: {
    name (person) {
      return person.first_name + ' ' + person.last_name
    },
    showCount (person) {
      const positions = person.positions_aggregate
      const count = (positions && positions.aggregate.count) || 0
      return count + ' show' + (count === 1 ? '' : 's')
    }
  },

  watch: {
    volunteers (volunteers) {
      if (!this.searching) {
        volunteers.forEach(person => {
          if (this.allVolunteers.every((existing) => person.id !== existing.id)) {
            this.allVolunteers.push(Object.assign({}, person))
          }
        })
      }
    }
  },

  methods: {
    moreVolunteers () {
      this.page++
    },

    onVolunteerCreated (added) {
      this.ignoreVolunteers.push(added.id)
      this.allVolunteers.push(added)
      this.createdVolunteers++
    },

    onVolunteerUpdated (updated) {
      const volunteer = this.allVolunteers.find(volunteer => volunteer.id === updated.id)
      Object.assign(volunteer, updated)
    },

    openModal (props) {
      this.$buefy.modal.open({
        parent: this,
        component: EditVolunteerModal,
        hasModalCard: true,
        props: props
      })
    },

    newModal () {
      this.openModal({
        title: 'New Volunteer',
        item: {}
      })
    },

    editModal (item) {
      this.openModal({
        title: 'Edit Volunteer',
        item: item
      })
    }
  }
}
</script>

<style scoped lang="scss">
.search-form {
  margin-bottom: 1.5rem;
}
</style>
