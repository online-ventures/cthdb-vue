<template lang="pug">
transition(name="long-fade")
  div(v-if="volunteer && memberships")
    section.hero.is-primary
      .hero-body
        .container
          h1.title {{ title }}
          p.subtitle Add New Membership

    section.section
      .container
        label.label Choose type
        w-select(v-model="record.membership_id" :options="membershipOptions")

        .columns
          .column
            .field
              label.label Starting
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="calendar-week")
                w-input(v-model="record.start_date" required type="date")

          .column
            .field
              label.label Expires
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="calendar-week")
                w-input(v-model="record.end_date" required type="date")

        label.label Purchaser
        .field
          select-volunteer(v-model="record.volunteer_id")

        template(v-if="record.membership_id")
          label.label {{ recipientTitle }}
          .field
            select-volunteer(v-model="record.volunteer_id")
</template>

<script>
import VOLUNTEER from '@/graphql/volunteers/name.gql'
import MEMBERSHIPS from '@/graphql/memberships/list.gql'
import SelectVolunteer from '@/components/SelectVolunteer'

export default {
  components: {
    SelectVolunteer
  },

  mounted () {
    window.scrollTo(0, 0)
  },

  data () {
    return {
      volunteer: null,
      memberships: null,
      record: {
        membership_id: 0,
        start_date: null,
        end_date: null,
        volunteer_id: 0
      }
    }
  },

  created () {
    this.record.start_date = this.formatDate()
    this.record.end_date = this.formatDate(this.nextYear)
    this.record.volunteer_id = this.volunteerId
  },

  computed: {
    volunteerId () {
      return parseInt(this.$route.params.id)
    },
    title () {
      return this.fullName
    },
    fullName () {
      return this.volunteer.first_name + ' ' + this.volunteer.last_name
    },
    membershipOptions () {
      if (!this.memberships) return []
      return this.memberships.map(membership => {
        return { value: membership.id, text: membership.name }
      })
    },
    nextYear () {
      const date = new Date()
      date.setDate(date.getDate() + 366)
      return date
    },
    recipientTitle () {
      return this.memberships.find(membership => {
        return membership.id === this.record.membership_id
      }).max_participants === 1 ? 'Recipient' : 'Recipients'
    }
  },

  apollo: {
    volunteer: {
      query: VOLUNTEER,
      skip () {
        return !this.volunteerId
      },
      variables () {
        return { id: this.volunteerId }
      },
      update (data) {
        return data.volunteers_by_pk
      }
    },
    memberships: {
      query: MEMBERSHIPS,
      skip () {
        return !this.$auth.tenantId
      },
      variables () {
        return { tenant_id: this.$auth.tenantId }
      },
      update (data) {
        return data.memberships
      }
    }
  },

  methods: {
    formatDate (date = null) {
      const d = date ? date : new Date()
      let month = (d.getMonth() + 1).toString()
      let day = d.getDate().toString()
      const year = d.getFullYear()

      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }

      return [year, month, day].join('-')
    }
  }
}
</script>

<style scoped lang="scss">
</style>
