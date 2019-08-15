<template lang="pug">
  b-loading(:active="true")
</template>

<script>
import authMixin from '../mixins/authMixin'
import gql from 'graphql-tag'

export default {
  mixins: [authMixin],
  data () {
    return {
      authId: '',
      user: {}
    }
  },
  created () {
    this.$store.dispatch('handleAuthentication')
  },
  computed: {
    currentDatetime () {
      return new Date().toISOString().slice(0, 19).replace('T', ' ')
    },
    userData () {
      return {
        name: this.profile.name,
        nickname: this.profile.nickname,
        email: this.profile.email,
        picture: this.profile.picture,
        auth_id: this.profile.sub,
        last_login: this.currentDatetime
      }
    }
  },
  apollo: {
    user: {
      query: gql`query getUser($id: String!) {
        users(where: {auth_id: {_eq: $id}}) {
          id
          name
          nickname
          email
          picture
          auth_id
          roles_users {
            role {
              name
            }
          }
        }
      }`,
      variables () {
        return {
          id: this.authId
        }
      },
      update (data) {
        return data.users[0]
      }
    }
  },
  watch: {
    authStatus (newStatus, oldStatus) {
      if (newStatus === 'authenticated') {
        this.completeLogin()
      }
    },
    async user (foundUser, oldValue) {
      // We are waiting for the auth id to come in from the auth mixin
      if (!this.authId) {
        return
      }
      // The user query has run looking for a user based on the auth mixin id
      if (!foundUser || !foundUser.id) {
        await this.createUser()
      } else {
        await this.updateUser(foundUser)
      }
      this.redirectToHome()
    }
  },
  methods: {
    completeLogin () {
      this.authId = this.profile.sub
    },
    redirectToHome () {
      this.$router.push({ name: 'home' })
    },
    async createUser () {
      await this.$apollo.mutate({
        mutation: gql`mutation createUser(
            $nickname:String!,
            $name:String!,
            $email:String!,
            $picture:String!,
            $auth_id:String!,
            $last_login:timestamp!
          ) {
          insert_users(objects: {
            nickname: $nickname,
            name:$name,
            email:$email,
            picture:$picture,
            auth_id:$auth_id,
            last_login_at:$last_login
          }) {
            returning {
              id
              name
              nickname
              email
              picture
              auth_id
              roles_users {
                role {
                  name
                }
              }
            }
          }
        }`,
        variables: this.userData,
        loadingKey: 'savingCounter'
      }).then((result) => {
        const newUser = result.data.insert_users.returning[0]
        this.$store.dispatch('cacheUser', newUser)
      }).catch((error) => {
        console.error(error)
      })
    },

    async updateUser (user) {
      await this.$apollo.mutate({
        mutation: gql`mutation updateUser(
            $nickname:String!,
            $name:String!,
            $email:String!,
            $picture:String!,
            $auth_id:String!,
            $last_login:timestamp!
          ) {
          update_users(where: {auth_id: {_eq: $auth_id}},
            _set: {
              nickname: $nickname,
              name:$name,
              email:$email,
              picture:$picture,
              auth_id:$auth_id,
              last_login_at:$last_login
          }) {
            affected_rows
          }
        }`,
        variables: this.userData,
        loadingKey: 'savingCounter'
      }).then((result) => {
        this.$store.dispatch('cacheUser', user)
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>

<style scoped>
</style>
