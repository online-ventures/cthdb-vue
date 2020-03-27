<template lang="pug">
form(ref="volunteerForm" @submit.prevent="saveRecords()")
  div(class="modal-card")
    header(class="modal-card-head")
      p(class="modal-card-title") Add Volunteer
    section(class="modal-card-body")
      div(class="tags" v-if="selectedVolunteers.length")
        b-tag(v-for="volunteer in selectedVolunteers"
          @close="removeVolunteer(volunteer)"
          :key="volunteer.id"
          closable
          type="is-info")
          | {{ volunteer | name }}
      form(class="search-form" @submit.prevent)
        b-field
          b-input(icon="search"
            autofocus
            placeholder="search"
            type="search"
            v-model="search")
      div(class="list-container")
        div(v-if="searching && !isSearching")
          list-row(v-for="volunteer in volunteers"
            :key="volunteer.id"
            :title="volunteer | name"
            :item="volunteer"
            checkable
            v-on:check="onCheck"
            :checked="alreadySelected(volunteer)"
            :disabled="volunteerExists(volunteer)")
        p(class="no-results has-text-centered has-text-grey is-italic" v-if="!searching")
          | Begin by typing a first/last name above
        p(class="no-results has-text-centered has-text-grey is-italic" v-if="noResultsFound")
          | No volunteers were found matching this search.
          br
          b-button(icon-left="plus"
            type="is-primary"
            size="is-small"
            @click.prevent="openVolunteerModal") Create volunteer
    footer(class="modal-card-foot")
      button(class="button" type="button" @click.prevent="$parent.close()") Cancel
      b-button(:class="{ 'is-loading': isSaving }"
        type="is-primary"
        icon-left="save"
        @click.prevent="saveRecords()") Save
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

  props: {
    item: {
      type: Object,
      required: true
    },
    existingPositions: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      search: '',
      volunteers: [],
      savingCounter: 0,
      searchingCounter: 0,
      selectedVolunteers: []
    }
  },

  created () {
  },

  computed: {
    noResultsFound () {
      return this.searching && !this.volunteers.length
    },
    isSaving () {
      return this.savingCounter > 0
    },
    isSearching () {
      return this.searchingCounter > 0
    },
    searching () {
      return this.search !== ''
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
    insertPositions () {
      return this.selectedVolunteers.map((v) => {
        return { show_id: this.item.id, volunteer_id: v.id }
      })
    },
    insertedPositions () {
      return this.selectedVolunteers.map((v) => {
        return {
          volunteer: v,
          job: null
        }
      })
    },
    existingVolunteers () {
      return this.existingPositions
        .map((p) => p.volunteer.id)
        .filter((v, i, a) => a.indexOf(v) === i)
    },
    selectedVolunteerIds () {
      return this.selectedVolunteers.map((v) => v.id)
    }
  },

  filters: {
    name (person) {
      return person.first_name + ' ' + person.last_name
    }
  },

  apollo: {
    volunteers: {
      query: gql`query volunteers($first_name: String, $last_name: String) {
          volunteers(where: {
            _and: [
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
            limit: 10) {
              id
              first_name
              last_name
            }
      }`,
      variables () {
        return {
          first_name: this.firstName,
          last_name: this.lastName
        }
      },
      loadingKey: 'searchingCounter'
    }
  },

  methods: {
    alreadySelected (volunteer) {
      return this.selectedVolunteerIds.includes(volunteer.id)
    },

    volunteerExists (volunteer) {
      return this.existingVolunteers.some((id) => id === volunteer.id)
    },

    onCheck (item) {
      if (this.selectedVolunteerIds.includes(item.id)) {
        this.removeVolunteer(item)
      } else {
        this.selectedVolunteers.push(item)
      }
    },

    removeVolunteer (volunteer) {
      this.selectedVolunteers = this.selectedVolunteers.filter((v) => v.id !== volunteer.id)
    },

    async saveRecords () {
      if (this.isSaving) {
        return
      }
      await this.insertRows()
      this.notifyParent()
      this.$parent.close()
    },

    async insertRows () {
      await this.$apollo.mutate({
        mutation: gql`mutation addRecords($objects:[positions_insert_input!]!) {
          insert_positions(objects: $objects) {
            returning {
              id
              show_id
              volunteer_id
              job_id
              hours
            }
          }
        }`,
        variables: {
          objects: this.insertPositions
        },
        loadingKey: 'savingCounter'
      }).then((result) => {
        this.$parent.$parent.onVolunteersAdded(this.insertedPositions)
      }).catch((error) => {
        this.handleApolloError(error)
      })
    },

    notifyParent () {
      const count = this.insertedPositions.length
      this.$buefy.toast.open({
        message: count + ' volunteer' + (count === 1 ? '' : 's') + ' added successfully',
        type: 'is-success'
      })
    },

    handleApolloError (error) {
      this.batchError = error
      console.error(error)
      this.$buefy.toast.open({
        message: 'There was an error applying this action',
        type: 'is-danger'
      })
    },

    openVolunteerModal () {
      this.$buefy.modal.open({
        parent: this,
        component: EditVolunteerModal,
        hasModalCard: true,
        props: {
          title: 'New Volunteer',
          item: {}
        }
      })
    },

    onVolunteerCreated (volunteer) {
      this.selectedVolunteers.push(volunteer)
      this.search = ''
    }
  }
}
</script>

<style scoped>
.search-form {
  margin-bottom: 1.5rem;
}
.list-container {
  height: 25rem;
}
</style>
