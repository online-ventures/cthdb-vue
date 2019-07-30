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
          iconType="is-warning"
          :item="job"
          :onClick="editModal")
        div(class="buttons")
          b-button(@click="moreJobs" v-if="displayMore") See more
          b-button(type="is-primary" @click="newModal" icon-left="plus") Add job
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
    offset () {
      return (this.page - 1) * this.rowsPerPage
    },
    displayMore () {
      return this.allJobs.length < this.jobCount
    }
  },

  apollo: {
    jobs: {
      query: gql`query currentJobs($offset: Int!, $limit: Int!, $ignore: [Int!]) {
        jobs(where: {id: {_nin: $ignore}},
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
        jobs_aggregate {
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
      jobs.forEach(job => {
        if (this.allJobs.every((existing) => job.id !== existing.id)) {
          this.allJobs.push(Object.assign({}, job))
        }
      })
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
      this.$modal.open({
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
      this.openModal({
        title: 'Edit Job',
        item: item
      })
    }
  }
}
</script>

<style scoped>
.row:hover {
  background: hsl(0, 0%, 96%);
  cursor: pointer;
}
.content {
  margin-top: 1em;
}
</style>
