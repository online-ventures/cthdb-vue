<template lang="pug">
form(ref="volunteerForm" @submit.prevent="saveRecord")
  div(class="modal-card")
    header(class="modal-card-head")
      p(class="modal-card-title") {{ title }}
    section(class="modal-card-body")
      div(class="columns")
        div(class="column")
          b-field(label="First name")
            b-input(v-model="record.first_name" ref="firstName" required v-on:keyup.enter.native="saveRecord")
        div(class="column")
          b-field(label="Last name")
            b-input(v-model="record.last_name" required v-on:keyup.enter.native="saveRecord")
      div(class="columns")
        div(class="column")
          b-field(label="Email")
            b-input(v-model="record.email" type="email" v-on:keyup.enter.native="saveRecord")
        div(class="column")
          b-field(label="Phone")
            b-input(v-model="record.phone"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="XXX-XXX-XXXX"
              validation-message="Please provide this in the format XXX-XXX-XXXX"
              v-on:keyup.enter.native="saveRecord")
      div(class="columns")
        div(class="column")
          b-field(label="Street")
            b-input(v-model="record.street" v-on:keyup.enter.native="saveRecord")
        div(class="column")
          b-field(label="City")
            b-input(v-model="record.city" v-on:keyup.enter.native="saveRecord")
    footer(class="modal-card-foot")
      b-button(@click.prevent="$parent.close()") Cancel
      b-button(:class="{ 'is-loading': isSaving }"
        type="is-primary"
        icon-left="save"
        @click.prevent="saveRecord") Save
</template>

<script>
import gql from 'graphql-tag'
import apolloMixin from '@/mixins/apolloMixin'

export default {
  mixins: {
    apolloMixin
  },

  props: {
    title: {
      type: String,
      default: 'New Volunteer'
    },
    item: {
      type: Object
    }
  },

  data () {
    return {
      record: {},
      attributes: [
        'id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'street',
        'city'
      ],
      savingCounter: 0
    }
  },

  created () {
    this.attributes.forEach(attribute => {
      this.record[attribute] = this.item[attribute]
    })
  },

  mounted () {
    this.$refs.firstName.focus()
  },

  computed: {
    isSaving () {
      return this.savingCounter > 0
    },
    newRecord () {
      return this.buildRecord()
    }
  },

  methods: {
    buildRecord (target = {}) {
      this.attributes.forEach(attribute => {
        target[attribute] = this.item[attribute]
      })
      return target
    },

    async saveRecord () {
      if (!this.validateRecord()) {
        return
      } else if (this.record.id) {
        await this.updateRecord()
      } else {
        await this.createRecord()
      }
      this.$parent.close()
    },

    validateRecord () {
      if (this.$refs.volunteerForm.checkValidity()) {
        return true
      } else {
        this.$refs.volunteerForm.reportValidity()
        return false
      }
    },

    async createRecord () {
      await this.$apollo.mutate({
        mutation: gql`mutation createRecord(
          $first_name:String!,
          $last_name:String!,
          $email:String,
          $phone:String,
          $street:String,
          $city:String
        ) {
          insert_volunteers(objects: {
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            phone: $phone,
            street: $street,
            city: $city
          }) {
            returning {
              id
              first_name
              last_name
              email
              phone
              street
              city
            }
          }
        }`,
        variables: this.record,
        loadingKey: 'savingCounter'
      }).then((result) => {
        const volunteer = result.data.insert_volunteers.returning[0]
        this.$parent.$parent.onVolunteerCreated(volunteer)
      }).catch((error) => {
        const message = 'There was an error creating this volunteer. Do they already exist?'
        this.handleApolloError(error, message)
      })
      this.$parent.close()
    },

    async updateRecord () {
      await this.$apollo.mutate({
        mutation: gql`mutation updateRecord(
          $id:Int!,
          $first_name:String!,
          $last_name:String!,
          $email:String,
          $phone:String,
          $street:String,
          $city:String
        ) {
          update_volunteers(where: {id: {_eq: $id}}, _set: {
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            phone: $phone,
            street: $street,
            city: $city
          }) {
            returning {
              id
              first_name
              last_name
              email
              phone
              street
              city
            }
          }
        }`,
        variables: this.record,
        loadingKey: 'savingCounter'
      })
      this.$parent.$parent.onVolunteerUpdated(this.record)
      this.$parent.close()
    }
  }
}
</script>

<style scoped>
</style>
