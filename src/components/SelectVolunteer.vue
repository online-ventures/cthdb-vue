<template lang="pug">
.control.has-icons-left
  span.icon.is-small
    font-awesome-icon(icon="user")
  w-suggestion(
    placeholder="Volunteer name"
    v-model="selected"
    :minLen="3"
    :items="volunteers"
    :setLabel="setVolunteerText"
    @changed="text => search = text"
    @selected="onSelected")
</template>

<script>
import VOLUNTEER from '@/graphql/volunteers/name.gql'
import VOLUNTEER_SELECT from '@/graphql/volunteers/select.gql'

export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    ignore: {
      type: Array,
      required: false,
      default: () => [0]
    }
  },

  mounted () {
    this.volunteerId = this.value
  },

  data () {
    return {
      search: '',
      selected: null,
      volunteerId: null,
      volunteer: null,
      volunteers: []
    }
  },

  computed: {
    names () {
      return this.search.split(/\s+/)
    },
    firstName () {
      return (this.names[0] || '') + '%'
    },
    lastName () {
      return (this.names[1] || '') + '%'
    }
  },

  apollo: {
    volunteer: {
      skip () {
        return !this.volunteerId
      },
      query: VOLUNTEER,
      variables () {
        return { id: this.volunteerId }
      },
      update (data) {
        const volunteer = data.volunteers_by_pk
        this.selected = this.processVolunteer(volunteer)
        return volunteer
      }
    },
    volunteers: {
      skip () {
        return !this.search
      },
      query: VOLUNTEER_SELECT,
      variables () {
        return {
          tenant_id: this.$auth.tenantId,
          first_name: this.firstName,
          last_name: this.lastName,
          ignore: this.ignore
        }
      },
      update (data) {
        return data.volunteers
          .map(volunteer => this.processVolunteer(volunteer))
      }
    }
  },

  methods: {
    processVolunteer (volunteer) {
      return {
        id: volunteer.id,
        name: [volunteer.first_name, volunteer.last_name].join(' ')
      }
    },
    setVolunteerText (volunteer) {
      return volunteer.name
    },
    onSelected (volunteer) {
      this.selected = volunteer
      this.$emit('input', volunteer.id)
      this.$nextTick(() => this.$emit('changed', volunteer.id))
    }
  }
}
</script>

<style scoped lang="scss">
</style>
