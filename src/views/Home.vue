<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        p.title Welcome!
        p.subtitle Here are some interesting statistics on our numbers to-date
  section.section
    nav.level.is-mobile(v-for="row in stats")
      .level-item.has-text-centered(v-for="stat in row" :key="stat.id")
        div
          p.heading {{ stat.subtitle }}
          p.title {{ stat.value }}
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      jobs: null,
      shows: null,
      volunteers: null,
      positions: null
    }
  },
  computed: {
    stats () {
      return [
        [
          {
            id: 'show-count',
            subtitle: 'Total shows',
            value: this.shows
          },
          {
            id: 'job-count',
            subtitle: 'Total jobs',
            value: this.jobs
          },
          {
            id: 'volunteer-count',
            subtitle: 'Total volunteers',
            value: this.volunteers
          },
          {
            id: 'positions-count',
            subtitle: 'Total positions',
            value: this.positions
          }
        ]
      ]
    }
  },
  apollo: {
    jobs: {
      query: gql`query jobCount {
        jobs_aggregate(where: {deleted_at: {_is_null: true}}) {
          aggregate {
            count
          }
        }
      }`,
      update (data) {
        return data.jobs_aggregate.aggregate.count
      }
    },
    shows: {
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
    },
    volunteers: {
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
    },
    positions: {
      query: gql`query positionsCount {
        positions_aggregate {
          aggregate {
            count
          }
        }
      }`,
      update (data) {
        return data.positions_aggregate.aggregate.count
      }
    }
  }
}
</script>
