<template lang="pug">
transition(name="long-fade")
  div(v-if="volunteer")

    w-hero(:title="title" subtitle="Membership information")

    section.section
      .container

        .buttons(v-if="canEdit")
          button.button(@click="addNew")
            span.icon.is-small
              font-awesome-icon(icon="plus" size="1x")
            span Add New
          button.button(@click="addExisting" v-if="false")
            span.icon.is-small
              font-awesome-icon(icon="link" size="1x")
            span Join Existing

        .box(v-if="enrollment")
          .columns
            .column
              p.is-size-6.has-text-grey.summary-title Status:
              p.is-size-4.has-text-black.is-marginless
                span.icon.is-medium
                  font-awesome-icon.is-size-4.has-text-success(icon="check-circle")
                span  Active
            .column
              p.is-size-6.has-text-grey.summary-title Current Membership:
              p.is-size-4.has-text-black.is-marginless
                span.icon.is-medium
                  font-awesome-icon.is-size-4.has-text-grey-light(icon="user")
                span  {{ enrollment.membership.name }} member

          .columns
            .column
              p.is-size-6.has-text-grey.summary-title Starting:
              p.is-size-4.has-text-black.is-marginless
                span.icon.is-medium
                  font-awesome-icon.is-size-4.has-text-grey-light(icon="calendar-week")
                span  {{ prettyDate(enrollment.start_date) }}
            .column
              p.is-size-6.has-text-grey.summary-title Expiring:
              p.is-size-4.has-text-black.is-marginless
                span.icon.is-medium
                  font-awesome-icon.is-size-4.has-text-grey-light(icon="calendar-week")
                span  {{ prettyDate(enrollment.end_date) }}

        .box(v-if="!enrollment")
          .columns
            .column
              p.is-size-6.has-text-grey.summary-title Status:
              p.is-size-3.has-text-black.is-marginless
                span.icon.is-medium
                  font-awesome-icon.is-size-4.has-text-warning(icon="ban")
                span  Inactive
            .column
              p.is-size-6.has-text-grey.summary-title Current Membership:
              p.is-size-3.has-text-black.is-marginless
                span.icon.is-medium
                  font-awesome-icon.is-size-4.has-text-grey-light(icon="user")
                span  None

    section.section
      .container

        w-title(title="Received memberships")

        p.is-size-5(v-if="!volunteer.enrollees.length")
          | None

        list-row(v-for="enrollee in volunteer.enrollees"
          :key="enrollee.enrollment_id"
          :title="enrollee.enrollment.membership.name + ' member'"
          :subtitle="rowSubtitle(enrollee.enrollment)"
          :icon="['calendar-week', 'user']"
          :item="enrollee.enrollment"
          v-on:action="editEnrollment")

    section.section
      .container

        w-title(title="Purchased memberships")

        p.is-size-5(v-if="!volunteer.purchases.length")
          | None

        list-row(v-for="enrollment in volunteer.purchases"
          :key="enrollment.id"
          :title="enrollment.membership.name + ' member'"
          :subtitle="rowSubtitle(enrollment)"
          :icon="['calendar-week', 'user']"
          :item="enrollment"
          v-on:action="editEnrollment")
</template>

<script>
import VOLUNTEER from '@/graphql/volunteers/memberships.gql'
import ListRow from '@/components/ListRow'

export default {
  components: {
    ListRow
  },

  mounted () {
    window.scrollTo(0, 0)
  },

  data () {
    return {
      volunteer: null,
      enrollment: null
    }
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
    canEdit () {
      return this.$auth.has('staff')
    },
    membershipText () {
      if (this.enrollment) {
        return this.enrollment.membership.name + ' member'
      } else {
        return 'None'
      }
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
        const volunteer = data.volunteers_by_pk
        if (volunteer.current_enrollee.length) {
          this.enrollment = volunteer.current_enrollee[0].enrollment
        }
        return volunteer
      }
    }
  },

  methods: {
    rowSubtitle (enrollment) {
      const dates = [
        this.prettyDate(enrollment.start_date),
        this.prettyDate(enrollment.end_date)
      ]
      const members = enrollment.enrollees_aggregate.aggregate.count
      const memberText = (members === 0 ? 'No' : members) + ' member'
      return [dates.join(' - '), memberText + (members === 1 ? '' : 's')]
    },
    prettyDate (value) {
      const date = new Date(value + 'T12:00:00')
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    },
    editEnrollment (enrollment) {
      if (!this.canEdit) return
      this.$router.push({
        name: 'edit-enrollment',
        params: { id: enrollment.id }
      })
    },
    addNew () {
      this.$router.push({
        name: 'new-enrollment',
        params: { id: this.volunteerId }
      })
    },
    addExisting () {
    }
  }
}
</script>

<style scoped lang="scss">
.summary-title {
  margin-bottom: -0.25em;
}
</style>
