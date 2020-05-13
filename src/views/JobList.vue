<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        h1.title Jobs
        p.subtitle View and manage jobs
  transition(name="long-fade")
    section.section(v-if="jobs")
      .container
        .columns
          .column(:class="canEdit ? 'is-10' : 'is-12'")
            form.search-form(@submit.prevent)
              .control.has-icons-left
                input.input(placeholder="search" @input="searchInput")
                span.icon.is-small.is-left
                  font-awesome-icon(icon="search" size="1x")
          .column.has-text-right-tablet(v-if="canEdit")
            button.button.is-primary.is-fullwidth(@click="addJob")
              span.icon.is-small
                font-awesome-icon(icon="plus" size="1x")
              span Add Job

        list-row(v-for="job in allJobs"
          :key="job.id"
          :title="job.name"
          :subtitle="job.points | prettyPoints"
          icon="coins"
          icon-type="is-warning"
          :item="job"
          v-on:action="editJob")
</template>

<script>
import ListRow from '@/components/ListRow'
import infiniteScrollingMixin from '@/mixins/infiniteScrollingMixin'
import debounce from 'lodash/debounce'
import JOB_LIST from '@/graphql/jobs/list.gql'
import JOB_SEARCH from '@/graphql/jobs/search.gql'

export default {
  components: {
    ListRow
  },

  mixins: [
    infiniteScrollingMixin
  ],

  mounted () {
    window.scrollTo(0, 0)
  },

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
      variables.tenant_id = this.$auth.tenant.id
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

  filters: {
    prettyPoints (value) {
      const plural = value > 2 ? 's' : ''
      return (value * 0.5).toFixed(1) + ' point' + plural
    }
  },

  methods: {
    searchInput: debounce(function (event) {
      this.allJobs = []
      this.page = 1
      this.search = event.target.value
    }, 300),
    addJob () {
      this.$router.push({ name: 'new-job' })
    },
    editJob (item) {
      this.$router.push({ name: 'edit-job', params: { id: item.id } })
    }
  }
}
</script>

<style scoped>
</style>
