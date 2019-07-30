<template lang="pug">
div
  div(class="columns" v-for="row in stats")
    div(class="column is-one-half-desktop" v-for="stat in row" :key="stat.id")
      div(class="box")
        p(class="title is-2 has-text-centered") {{ stat.value }}
        p(class="subtitle is-4 has-text-centered") {{ stat.subtitle }}
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      jobs_aggregate: { aggregate: { count: '-' } },
      shows_aggregate: { aggregate: { count: '-' } }
    }
  },
  computed: {
    stats () {
      return [
        [
          {
            id: 'show-count',
            subtitle: 'Total shows',
            value: this.shows_aggregate.aggregate.count
          },
          {
            id: 'job-count',
            subtitle: 'Total jobs',
            value: this.jobs_aggregate.aggregate.count
          }
        ]
      ]
    }
  },
  apollo: {
    jobs_aggregate: gql`query jobCount {
      jobs_aggregate {
        aggregate {
          count
        }
      }
    }`,
    shows_aggregate: gql`query showCount {
      shows_aggregate {
        aggregate {
          count
        }
      }
    }`
  }
}
</script>
