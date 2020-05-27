<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        h1.title Add Theatre

  section.section
    .container

      .large.notification(v-if="showNotification")
        button.delete(@click="showNotification = false")
        .content
          p
            | Creating a new theatre is
            |
            b completely free
            | .  Your theatre will be submitted to our review team for approval, and once approved, will show up on our theatre selection page and you can begin managing your volunteers within the AllStar application.
          p We are currently accepting a limited number of new theatres during our alpha release phase.  By submitting your theatre.  We will notify you via email to let you know when your theatre has been activated for usage.

      w-form(
        :complete="onSaved"
        :showSuccessMessage="true"
        :successMessage="successMessage"
        :record="record"
        :beforeSave="beforeSave"
        :mutation="mutation")

        h2.title.is-4 Required fields

        .columns
          .column
            .field
              label.label Theatre Name
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="ticket-alt")
                w-input(v-model="record.name" required maxlength="50")

          .column
            .field
              label.label Abbreviated Name
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="ticket-alt")
                w-input(v-model="record.short_name" required minlength="2" maxlength="8")

        .columns
          .column
            .field
              label.label City
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="map-marker-alt")
                w-input(v-model="record.city" required maxlength="40")

          .column
            .field
              label.label State
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="map-marker-alt")
                w-input(v-model="record.state" required minlength="2" maxlength="2")
</template>

<script>
import INSERT_TENANT from '@/graphql/tenants/insert.gql'

export default {
  mounted () {
    window.scrollTo(0, 0)
  },

  data () {
    return {
      showNotification: true,
      record: {
        name: '',
        short_name: '',
        city: '',
        state: ''
      },
      successMessage: 'Your theatre has been successfully submitted for approval'
    }
  },

  computed: {
    mutation () {
      return INSERT_TENANT
    }
  },

  methods: {
    beforeSave (record) {
      record.owner_id = this.$auth.userId
      return record
    },
    onSaved (data) {
    }
  }
}
</script>

<style scoped lang="scss">
.help-link {
  margin-left: 0.25em;
}
</style>
