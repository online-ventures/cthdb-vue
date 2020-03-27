import { mapState, mapGetters } from 'vuex'
import gql from 'graphql-tag'

export default {
  data () {
    return {
      dbUser: {}
    }
  },
  created () {
    if (this.$router.currentRoute.name !== 'callback') {
      this.$store.dispatch('renewTokens')
    }
  },
  computed: {
    ...mapState({
      authStatus: state => state.auth.status,
      profile: state => state.auth.profile,
      user: state => state.auth.user
    }),
    ...mapGetters(['isAuthenticated', 'isIdTokenValid']),
    authId () {
      return (this.profile && this.profile.sub) || 0
    },
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
    dbUser: {
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
    dbUser (foundUser, oldValue) {
      // We are waiting for the auth id to come in from the auth mixin
      if (!this.authId) {
        return
      }
      // The user query has run looking for a user based on the auth mixin id
      if (!foundUser || !foundUser.id) {
        this.createUser()
      } else {
        this.updateUser(foundUser)
      }
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login')
    },

    logout () {
      this.$store.dispatch('logout')
    },

    createUser () {
      this.$apollo.mutate({
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

    updateUser (user) {
      this.$apollo.mutate({
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
            returning {
              id
              nickname
              name
              email
              picture
              auth_id
              last_login_at
            }
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
