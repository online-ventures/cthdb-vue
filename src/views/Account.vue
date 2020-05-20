<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        h1.title Account
        p.subtitle Manage account details

  transition(name="long-fade")
    section.section(v-if="!loading")
      .container
        w-form(
          :complete="onComplete"
          :record="record"
          :mutation="mutation"
          :showSummaryError="true")

          h2.title.is-4 Basic Info

          .columns
            .column
              .field
                label.label First Name
                .control.has-icons-left
                  span.icon.is-small
                    font-awesome-icon(icon="user")
                  w-input(v-model="record.first_name" maxlength="30")
            .column
              .field
                label.label Last Name
                .control.has-icons-left
                  span.icon.is-small
                    font-awesome-icon(icon="user")
                  w-input(v-model="record.last_name" maxlength="30")
</template>

<script>
import UPDATE_USER from '@/graphql/users/update.gql'

export default {
  data () {
    return {
      loading: true,
      email: '',
      record: {
        first_name: '',
        last_name: ''
      }
    }
  },

  mounted () {
    if (this.$auth.user) {
      this.loadRecord(this.$auth.user)
    } else {
      this.$auth.$watch('user', user => {
        if (user) this.loadRecord(user)
      })
    }
  },

  computed: {
    mutation () {
      return UPDATE_USER
    }
  },

  methods: {
    onComplete (data) {
    },
    loadRecord (user) {
      this.record = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
</style>
