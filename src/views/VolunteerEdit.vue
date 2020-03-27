<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        p.title {{ title }}

  section.content
    .container
      form(ref="recordForm" @submit.prevent="save")
        .columns
          .column
            b-field(label="First name")
              b-input(v-model="record.first_name" ref="firstName" required v-on:keyup.enter.native="save")
          .column
            b-field(label="Last name")
              b-input(v-model="record.last_name" required v-on:keyup.enter.native="save")
        .columns
          .column
            b-field(label="Email")
              b-input(v-model="record.email" type="email" v-on:keyup.enter.native="save")
          .column
            b-field(label="Phone")
              b-input(v-model="record.phone"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="XXX-XXX-XXXX"
                validation-message="Please provide this in the format XXX-XXX-XXXX"
                v-on:keyup.enter.native="save")
        .columns
          .column
            b-field(label="Street")
              b-input(v-model="record.street" v-on:keyup.enter.native="save")
          .column
            b-field(label="City")
              b-input(v-model="record.city" v-on:keyup.enter.native="save")

        .buttons
          b-button(@click.prevent="backToList") Cancel
          b-button(:class="{ 'is-loading': saving }"
            type="is-primary"
            icon-left="save"
            @click.prevent="save") Save
</template>

<script>
import { VOLUNTEER } from '@/graphql/queries'
import { INSERT_VOLUNTEER, UPDATE_VOLUNTEER } from '@/graphql/mutations'
import formMixin from '@/mixins/formMixin'

export default {
  mixins: [
    formMixin
  ],

  mounted () {
    setTimeout(() => {
      this.$refs.firstName.focus()
    }, 100)
  },

  data () {
    return {
      volunteer: {},
      attributes: [
        'first_name',
        'last_name',
        'email',
        'phone',
        'street',
        'city'
      ]
    }
  },

  computed: {
    saving () {
      return this.savingCounter > 0
    },
    title () {
      return this.newRecord ? 'Add Volunteer' : this.fullName
    },
    fullName () {
      if (this.newRecord) {
        return ''
      }
      return this.record.first_name + ' ' + this.record.last_name
    },
    formMutation () {
      return this.newRecord ? INSERT_VOLUNTEER : UPDATE_VOLUNTEER
    }
  },

  apollo: {
    volunteer: {
      fetchPolicy: 'no-cache',
      loadingKey: 'loading',
      query: VOLUNTEER,
      variables () {
        return {
          id: parseInt(this.$route.params.id) || 0
        }
      },
      update (data) {
        this.loadRecord(data.volunteers_by_pk)
      }
    }
  },

  methods: {
    backToList () {
      this.$router.push({ name: 'volunteers' })
    },
    onSaveComplete () {
      this.backToList()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
