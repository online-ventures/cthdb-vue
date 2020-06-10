<template lang="pug">
transition(name="long-fade")
  div(v-if="volunteer && memberships")
    w-hero(:title="title" subtitle="Add new membership")

    section.section
      .container
        template(v-if="noMemberships")
          h2.is-size-4 No Memberships
          p.is-size-6 There are no memberships currently listed for this theatre to join.  Discuss this with your theatre manager who oversees this theatre here to get memberships added.

        template(v-if="!noMemberships")
          w-form(
            :cancel="onCancel"
            :complete="onComplete"
            :record="record"
            :mutation="mutation"
            saveText="Continue")

            w-field(label="Choose type")
              w-select(v-model="record.membership_id" :options="membershipOptions")

            .columns
              .column
                w-field(label="Starting" icon="calendar-week")
                  w-date-input(v-model="record.start_date")

              .column
                w-field(label="Expires" icon="calendar-week")
                  w-date-input(v-model="record.end_date")

            w-field(label="Purchaser")
              select-volunteer(v-model="record.volunteer_id")
</template>

<script>
import VOLUNTEER from '@/graphql/volunteers/name.gql'
import MEMBERSHIPS from '@/graphql/memberships/list.gql'
import INSERT_ENROLLMENT from '@/graphql/enrollments/insert.gql'
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
      noMemberships: false,
      record: {
        membership_id: 0,
        start_date: null,
        end_date: null,
        volunteer_id: 0
      },
      mutation: INSERT_ENROLLMENT
    }
  },

  created () {
    const today = new Date()
    this.record.start_date = today
    this.record.end_date = new Date()
    this.record.end_date.setDate(today.getDate() + 366)
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
      update ({ memberships }) {
        if (!memberships.length) {
          this.noMemberships = true
        } else {
          this.record.membership_id = memberships[0].id
        }
        return memberships
      }
    }
  },

  methods: {
    onCancel () {
      this.$router.push({
        name: 'volunteer-membership',
        params: { id: this.volunteerId }
      })
    },
    onComplete (enrollment) {
      this.$router.push({
        name: 'edit-enrollment',
        params: { id: enrollment.id }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
