<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        p.title Welcome!
        p.subtitle Here are some interesting statistics on our numbers to-date
  transition(name="long-fade")
    section.section(v-if="stats")
      .container
        .columns
          .column(v-for="stat in computedStats")
            p.heading.has-text-centered {{ stat.text }}
            p.title.has-text-centered {{ stat.value }}
</template>

<script>
import STATS from '@/graphql/stats/home.gql'

export default {
  data () {
    return {
      stats: null
    }
  },
  computed: {
    computedStats () {
      if (this.stats) {
        return [
          {
            text: 'Total shows',
            value: this.stats.shows_aggregate.aggregate.count
          },
          {
            text: 'Total jobs',
            value: this.stats.jobs_aggregate.aggregate.count
          },
          {
            text: 'Total volunteers',
            value: this.stats.volunteers_aggregate.aggregate.count
          },
          {
            text: 'Awarded volunteers',
            value: this.stats.awards_aggregate.aggregate.count
          }
        ]
      }
      return []
    }
  },
  apollo: {
    stats: {
      query: STATS,
      skip () {
        return !this.$auth.tenantId
      },
      variables () {
        return { id: this.$auth.tenantId }
      },
      update (data) {
        return data
      }
    }
  }
}
</script>
