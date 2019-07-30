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
            b-input(icon="search" placeholder="search" type="search" v-model="search" @keyup.enter.native="performSearch")
        list-row(v-for="volunteer in volunteerList"
          :key="volunteer.id"
          :title="volunteer | name"
          subtitle=""
          icon=""
          :item="volunteer"
          :onClick="editModal")
        div(class="buttons")
          b-button(@click="moreVolunteers" v-if="displayMore") See more
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
      return !this.searching && this.allVolunteers.length < this.volunteerCount
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
    }
  },

  watch: {
    volunteers (volunteers) {
      console.log(volunteers)
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

    addRecord (added) {
      this.ignoreVolunteers.push(added.id)
      this.allVolunteers.push(added)
      this.volunteerCount++
    },

    updateRecord (updated) {
      const volunteer = this.allVolunteers.find(volunteer => volunteer.id === updated.id)
      Object.assign(volunteer, updated)
    },

    openModal (props) {
      this.$modal.open({
        parent: this,
        component: EditVolunteerModal,
        hasModalCard: true,
        props: props
      })
    },

    newModal () {
      this.openModal({
        title: 'New Volunteer',
        item: {
          name: '',
          points: 0
        }
      })
    },

    editModal (item) {
      this.openModal({
        title: 'Edit Volunteer',
        item: item
      })
    },

    performSearch () {
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
  margin-top: 2em;
}
.search-form {
  margin-top: 2em;
  margin-bottom: 1em;
}
</style>
