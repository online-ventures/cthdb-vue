<template lang="pug">
transition(name="long-fade")
  div(v-if="enrollment && memberships")
    w-hero(title="Manage Membership")

    section.section
      .container

        w-notification(
          :message="notifyMessage"
          :type="notifyType"
          :lifetime="notifyLifetime"
        )

        w-title(title="Membership information")

        w-field(label="Choose type")
          w-select(
            v-model="membership_id"
            :options="membershipOptions"
            @changed="changeMembership"
          )

        .columns
          .column
            w-field(label="Starting" icon="calendar-week")
              w-date-input(v-model="record.start_date" @changed="updateRecord")

          .column
            w-field(label="Expires" icon="calendar-week")
              w-date-input(v-model="record.end_date" @changed="updateRecord")

        w-field(label="Purchaser" help="The individual who paid for the membership")
          select-volunteer(v-model="record.volunteer_id" @changed="updateRecord")

    w-list(
      itemName="Recipient"
      help="The actual member(s) who are receiving the membership"
      rowIcon="user"
      :query="enrolleesQuery"
      :queryVariables="enrolleeVariables"
      :processResults="processEnrollees"
      :canAdd="canAddEnrollee"
      :insertMutation="insertEnrollee"
      :insertId="enrolleeId"
      :mutationVariables="enrolleeMutationVariables"
      :deleteMutation="deleteEnrollee"
      @changed="enrolleesChanged"
    )
      select-volunteer(v-model="enrolleeId" :ignore="ignoreEnrollees")
</template>

<script>
import ENROLLMENT from '@/graphql/enrollments/edit.gql'
import MEMBERSHIPS from '@/graphql/memberships/list.gql'
import UPDATE_ENROLLMENT from '@/graphql/enrollments/update.gql'
import ENROLLEES from '@/graphql/enrollees/volunteers.gql'
import INSERT_ENROLLEE from '@/graphql/enrollees/insert.gql'
import DELETE_ENROLLEE from '@/graphql/enrollees/delete.gql'
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
      enrollment: null,
      memberships: null,
      notifyMessage: null,
      notifyType: 'success',
      notifyLifetime: 3,
      membership_id: 0,
      record: {
        membership_id: 0,
        start_date: null,
        end_date: null,
        volunteer_id: 0
      },
      updating: false,
      enrolleesQuery: ENROLLEES,
      enrollees: [],
      insertEnrollee: INSERT_ENROLLEE,
      deleteEnrollee: DELETE_ENROLLEE,
      enrolleeId: 0
    }
  },

  computed: {
    enrollmentId () {
      return parseInt(this.$route.params.id)
    },
    membershipOptions () {
      if (!this.memberships) return []
      return this.memberships.map(membership => {
        return { value: membership.id, text: membership.name }
      })
    },
    membership () {
      return this.memberships.find(membership => {
        return membership.id === this.membership_id
      })
    },
    recipientTitle () {
      return 'Recipient' + (this.membership.max_participants === 1 ? '' : 's')
    },
    canAddEnrollee () {
      return this.enrollees.length < this.membership.max_participants
    },
    enrolleeVariables () {
      return { enrollment_id: this.enrollmentId }
    },
    ignoreEnrollees () {
      if (!this.enrollees.length) return [0]
      return this.enrollees.map(enrollee => enrollee.id)
    }
  },

  apollo: {
    enrollment: {
      query: ENROLLMENT,
      skip () {
        return !this.enrollmentId
      },
      variables () {
        return { id: this.enrollmentId }
      },
      update (data) {
        const enrollment = data.enrollments_by_pk
        this.record = { ...enrollment }
        this.membership_id = this.record.membership_id
        delete this.record.__typename
        return enrollment
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
    async updateRecord () {
      if (this.updating) return
      try {
        this.updating = true
        await this.$apollo.mutate({
          mutation: UPDATE_ENROLLMENT,
          variables: this.record
        })
        this.notify('Membership updated successfully')
      } catch (error) {
        this.notify('There was an error saving this record', 'danger')
      } finally {
        this.updating = false
      }
    },
    changeMembership () {
      if (this.enrollees.length <= this.membership.max_participants) {
        this.record.membership_id = this.membership_id
        this.updateRecord()
      } else {
        const max = this.membership.max_participants
        const message = this.membership.name + ' can only support ' + max +
          ' recipient' + (max === 1 ? '' : 's') + '.  Lower your recipients' +
          ' to this amount first.'
        this.notify(message, 'info', 8)
        this.membership_id = this.record.membership_id
      }
    },
    notify (message, type = 'success', lifetime = 3) {
      this.notifyType = type
      this.notifyLifetime = lifetime
      this.notifyMessage = message
      this.$nextTick(() => { this.notifyMessage = null })
    },
    enrolleeMutationVariables (volunteerId) {
      return {
        volunteer_id: volunteerId,
        enrollment_id: this.enrollmentId
      }
    },
    processEnrollees (enrollees) {
      return enrollees.map(enrollee => {
        const volunteer = enrollee.volunteer
        return {
          id: volunteer.id,
          name: volunteer.first_name + ' ' + volunteer.last_name
        }
      })
    },
    enrolleesChanged (enrollees) {
      this.enrollees = enrollees
      this.enrolleeId = 0
    }
  }
}
</script>

<style scoped lang="scss">
</style>
