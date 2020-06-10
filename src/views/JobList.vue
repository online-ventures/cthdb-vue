<template lang="pug">
div
  w-hero(title="Jobs" subtitle="View and manage jobs")

  transition(name="long-fade")
    section.section(v-if="jobs")
      .container
        .columns
          .column(v-if="canEdit")
            w-button.is-primary.is-fullwidth(@click="addJob" icon="plus")
              span Add Job
          .column(:class="canEdit ? 'is-10' : 'is-12'")
            form.search-form(@submit.prevent)
              w-field(icon="search")
                w-input(placeholder="search" :debounce="searchInput")

        list-row(v-for="job in allJobs"
          :key="job.id"
          :title="job.name"
          :subtitle="[jobPoints(job.points), jobCount(job)]"
          :icon="['coins', 'user']"
          icon-type="is-warning"
          :item="job"
          v-on:action="viewJob")
</template>

<script>
import ListRow from '@/components/ListRow'
import infiniteScrollingMixin from '@/mixins/infiniteScrollingMixin'
import JOB_LIST from '@/graphql/jobs/list.gql'
import JOB_SEARCH from '@/graphql/jobs/search.gql'

export default {
  components: {
    ListRow
  },

  mixins: [
    infiniteScrollingMixin
  ],

  data () {
    return {
      jobs: null,
      allJobs: [],
      search: ''
    }
  },

  computed: {
    canEdit () {
      return this.$auth.has('staff')
    },
    searching () {
      return this.search !== ''
    },
    jobName () {
      return '%' + this.search + '%'
    },
    query () {
      return this.searching ? JOB_SEARCH : JOB_LIST
    },
    queryVariables () {
      const variables = this.infiniteQueryVariables
      variables.tenant_id = this.$auth.tenantId
      if (this.searching) {
        variables.search = this.jobName
      } else {
        delete variables.search
      }
      return variables
    }
  },

  apollo: {
    jobs: {
      query () {
        return this.query
      },
      variables () {
        return this.queryVariables
      },
      update ({ jobs }) {
        return this.processFetchedData(jobs, this.allJobs)
      }
    }
  },

  methods: {
    jobPoints (points) {
      const text = points > 1 ? ' points' : ' point'
      return points + text
    },
    jobCount (job) {
      const count = job.positions_aggregate.aggregate.count
      const text = count === 1 ? 'person' : 'people'
      return Intl.NumberFormat('en-US').format(count) + ' ' + text
    },
    searchInput (data) {
      this.allJobs = []
      this.page = 1
      this.search = data.value
    },
    addJob () {
      this.$router.push({ name: 'new-job' })
    },
    editJob (item) {
      if (!this.$auth.has('staff')) return
      this.$router.push({ name: 'edit-job', params: { id: item.id } })
    },
    viewJob (item) {
      this.$router.push({ name: 'job', params: { id: item.id } })
    }
  }
}
</script>

<style scoped>
</style>
