<template lang="pug">
div
  section(class="hero is-primary")
    div(class="hero-body")
      div(class="container")
        p(class="title") Jobs
        p(class="subtitle") View and manage jobs
  section
    div(class="content")
      div(class="container")
        list-row(v-for="job in allJobs"
          :key="job.id"
          :title="job.name"
          :subtitle="job.points | prettyPoints"
          icon="coins"
          icon-type="is-warning"
          :item="job"
          v-on:action="editModal")
        div(class="buttons")
          b-button(@click="moreJobs" v-if="displayMore") See more ({{ remainingCount }})
          b-button(type="is-primary" @click="newModal" icon-left="plus" v-if="canEdit") Add job
</template>

<script>
import gql from 'graphql-tag'
import ListRow from '@/components/ListRow'
import EditJobModal from '@/components/modal/EditJobModal'

export default {
  components: {
    ListRow,
    EditJobModal
  },

  created () {
    // Refetch on creation to invalidate a potentially outdated cache
    console.log('created job list component!')
    this.$apollo.queries.jobs.refetch()
    this.$apollo.queries.jobCount.refetch()
  },

  data () {
    return {
      jobs: [],
      jobCount: 0,
      allJobs: [],
      ignoreJobs: [],
      page: 1,
      rowsPerPage: 5
    }
  },

  computed: {
    canEdit () {
      return this.$store.getters.can('edit-jobs')
    },
    offset () {
      return (this.page - 1) * this.rowsPerPage
    },
    displayMore () {
      return this.allJobs.length < this.jobCount
    },
    remainingCount () {
      return this.jobCount - this.allJobs.length
    }
  },

  apollo: {
    jobs: {
      query: gql`query currentJobs($offset: Int!, $limit: Int!, $ignore: [Int!]) {
        jobs(where: {id: {_nin: $ignore}, deleted_at: {_is_null: true}},
          order_by: {name: asc, points: asc},
          limit: $limit,
          offset: $offset) {
          id
          name
          points
        }
      }`,
      variables () {
        return {
          ignore: this.ignoreJobs,
          offset: this.offset,
          limit: this.rowsPerPage
        }
      }
    },
    jobCount: {
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
    }
  },

  filters: {
    prettyPoints (value) {
      const plural = value > 2 ? 's' : ''
      return (value * 0.5).toFixed(1) + ' point' + plural
    }
  },

  watch: {
    jobs (jobs) {
      console.log(jobs[0])
      jobs.forEach(job => {
        if (this.allJobs.every((existing) => job.id !== existing.id)) {
          this.allJobs.push(Object.assign({}, job))
        } else {
          console.log('updating job!')
          console.log(job)
          const i = this.allJobs.findIndex((existing) => job.id === existing.id)
          console.log('index found: ' + i)
          this.allJobs[i] = Object.assign({}, job)
        }
      })
      console.log(this.allJobs[0])
    }
  },

  methods: {
    moreJobs () {
      this.page++
    },

    addJob (added) {
      this.ignoreJobs.push(added.id)
      this.allJobs.push(added)
      this.jobCount++
    },

    updateJob (updated) {
      const job = this.allJobs.find(job => job.id === updated.id)
      Object.assign(job, updated)
    },

    openModal (props) {
      this.$buefy.modal.open({
        parent: this,
        component: EditJobModal,
        hasModalCard: true,
        props: props
      })
    },

    newModal () {
      this.openModal({
        title: 'New Job',
        item: {
          name: '',
          points: 0
        }
      })
    },

    editModal (item) {
      if (!this.canEdit) {
        return
      }
      this.openModal({
        title: 'Edit Job',
        item: item
      })
    },

    onJobRemoved (item) {
      this.allJobs = this.allJobs.filter((existing) => existing.id !== item.id)
    }
  }
}
</script>

<style scoped>
</style>
