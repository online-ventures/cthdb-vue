<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        h1.title {{ title }}

  section.section
    .container
      w-form(
        :afterValidate="onValidate"
        :cancel="onCancel"
        :complete="onComplete"
        :record="record"
        :editorId="$auth.userId"
        :tenantId="$auth.tenantId"
        :mutation="mutation")

        h2.title.is-4 Required fields

        .columns
          .column
            .field
              label.label Name
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="ticket-alt")
                w-input(v-model="record.name" required maxlength="100")

          .column
            .field
              label.label Year
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="calendar-week")
                w-input(
                  v-model="selectedYear"
                  required
                  min="1980"
                  max="2050"
                  type="number")

        label.label Month

        .columns.is-multiline.is-mobile
          .column.is-2-tablet.is-6-mobile(v-for="month in months")
            button.button.is-fullwidth(
              :class="{ 'is-primary': month.value === selectedMonth.value }"
              @click.prevent="selectedMonth = month"
            ) {{ month.text }}
</template>

<script>
import SHOW from '@/graphql/shows/edit.gql'
import INSERT_SHOW from '@/graphql/shows/insert.gql'
import UPDATE_SHOW from '@/graphql/shows/update.gql'

export default {
  mounted () {
    if (!this.selectedYear) {
      const d = new Date()
      this.selectedYear = d.getFullYear()
    }
  },

  data () {
    return {
      show: null,
      record: {
        name: '',
        occurred_at: null
      },
      year: null,
      month: {
        text: '',
        value: ''
      },
      months: [
        { text: 'January', value: '01' },
        { text: 'February', value: '02' },
        { text: 'March', value: '03' },
        { text: 'April', value: '04' },
        { text: 'May', value: '05' },
        { text: 'June', value: '06' },
        { text: 'July', value: '07' },
        { text: 'August', value: '08' },
        { text: 'September', value: '09' },
        { text: 'October', value: '10' },
        { text: 'November', value: '11' },
        { text: 'December', value: '12' }
      ]
    }
  },

  computed: {
    showId () {
      return parseInt(this.$route.params.id)
    },
    title () {
      return this.show ? this.show.name : 'Add New Show'
    },
    occurredAt () {
      return this.selectedYear + '-' + this.selectedMonth.value + '-01'
    },
    mutation () {
      return this.show ? UPDATE_SHOW : INSERT_SHOW
    },
    selectedYear: {
      get () {
        return this.year
      },
      set (value) {
        this.year = value
        this.record.occurred_at = this.occurredAt
      }
    },
    selectedMonth: {
      get () {
        return this.month
      },
      set (value) {
        this.month = value
        this.record.occurred_at = this.occurredAt
      }
    }
  },

  apollo: {
    show: {
      query: SHOW,
      skip () {
        return !this.showId
      },
      variables () {
        return { id: this.showId }
      },
      update (data) {
        const show = data.shows_by_pk
        this.record = { ...show }
        delete this.record.__typename
        const fields = this.record.occurred_at.split('-')
        this.selectedYear = fields[0]
        this.selectedMonth = this.months.find(month => month.value === fields[1])
        return show
      }
    }
  },

  methods: {
    onCancel () {
      this.$router.push({ name: 'shows' })
    },
    onComplete (data) {
      this.$router.push({ name: 'shows' })
    },
    onValidate () {
      if (!this.selectedMonth.value) {
        return 'Please select a month'
      }
      return false
    }
  }
}
</script>

<style scoped lang="scss">
</style>
