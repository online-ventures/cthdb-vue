<template lang="pug">
transition(name="long-fade")
  div(v-if="volunteer")
    section.hero.is-primary
      .hero-body
        .container
          h1.title {{ title }}
          p.subtitle Manage membership

    section.section
      .container
        .box(v-if="enrollment")
          .columns
            .column
              p.is-size-3.has-text-black
                span Status:
                |
                font-awesome-icon.has-text-warning.is-size-4(icon="coins")
                |
                | {{ status }}
              p.is-size-4.has-text-weight-medium
                span {{ enrollment.membership.name }}
            .column
              p.is-size-4.has-text-black
                span {{ startDate }}
              p.is-size-4.has-text-weight-medium
                span {{ endDate }}

        .buttons
          button.button.is-primary(@click="addNew")
            span.icon.is-small
              font-awesome-icon(icon="plus" size="1x")
            span Add New
          button.button.is-primary(@click="addExisting")
            span.icon.is-small
              font-awesome-icon(icon="link" size="1x")
            span Join Existing

    section.section
      .container
        h2.title.is-4 Past Memberships
        p.is-size-5(v-if="!volunteer.enrollees.length")
          | None
        .columns.is-vcentered.is-centered(
          v-for="enrollee in volunteer.enrollees"
          :class="{ 'has-background-white-ter': index % 2 === 0 }")
          .column.is-3
            p.title.is-5 {{ level.name }}
          .column.is-3
            p.subtitle.is-6 {{ points }} points / {{ level.points }} needed
          .column.is-3
            .buttons.has-addons.award-buttons
              button.button(
                @click="removeAward(level)"
                :class="{ 'is-primary': !awarded(level), 'is-loading': awardSaving[level.id] }")
                | Eligible
              button.button(
                @click="addAward(level)"
                :class="{ 'is-primary': awarded(level) }")
                | Awarded
          .column.is-3
            .field(v-if="awarded(level)")
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="calendar-week")
                w-input(v-model="awardFor(level).awarded_at" type="date" required @blur="updateAward(level)")
</template>

<script>
import VOLUNTEER from '@/graphql/volunteers/memberships.gql'

export default {
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
        if (volunteer.enrollees.length) {
          this.enrollment = volunteer.enrollees[0].enrollment
        }
        return volunteer
      }
    }
  },

  methods: {
    addNew () {
    },
    addExisting () {
    }
  }
}
</script>

<style scoped lang="scss">
.award-buttons {
  .button {
    width: 50%;
  }
}
</style>
