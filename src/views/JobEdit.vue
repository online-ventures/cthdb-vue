<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        h1.title {{ title }}

  section.section
    .container
      w-form(
        :cancel="onCancel"
        :complete="onComplete"
        :record="record"
        :mutation="mutation"
        :editorId="$auth.userId"
        :tenantId="$auth.tenantId"
        :beforeSave="beforeSave")
        .columns
          .column
            .field
              label.label Name
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="hammer")
                w-input(v-model="record.name" required maxlength="40")

          .column
            .field
              label.label Points
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="coins")
                w-input(v-model="record.points" required type="number" min="0" max="100")
</template>

<script>
import JOB from '@/graphql/jobs/edit.gql'
import INSERT_JOB from '@/graphql/jobs/insert.gql'
import UPDATE_JOB from '@/graphql/jobs/update.gql'

export default {
  mounted () {
  },

  data () {
    return {
      job: null,
      record: {
        name: '',
        points: null
      }
    }
  },

  computed: {
    jobId () {
      return parseInt(this.$route.params.id)
    },
    title () {
      return this.job ? this.job.name : 'Add New Job'
    },
    mutation () {
      return this.job ? UPDATE_JOB : INSERT_JOB
    }
  },

  apollo: {
    job: {
      query: JOB,
      skip () {
        return !this.jobId
      },
      variables () {
        return { id: this.jobId }
      },
      update (data) {
        const job = data.jobs_by_pk
        this.record = { ...job }
        delete this.record.__typename
        return job
      }
    }
  },

  methods: {
    onCancel () {
      this.$router.push({ name: 'jobs' })
    },
    onComplete (data) {
      this.$router.push({ name: 'jobs' })
    },
    beforeSave (job) {
      const newJob = { ...job }
      newJob.points *= 2
      return newJob
    }
  }
}
</script>

<style scoped lang="scss">
</style>
