<template>
  <div>
    <nav>
      <div>
        <a href="#">Auth0 - Vue</a>
      </div>

      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li v-if="!isAuthenticated">
          <a href="#" @click.prevent="login">Login</a>
        </li>
        <li v-if="isAuthenticated">
          <a href="#" @click.prevent="logout">Log out</a>
        </li>
      </ul>
  </nav>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      isAuthenticated: false
    }
  },
  methods: {
    login () {
      this.$auth.login()
    },
    logout () {
      this.$auth.logOut()
    }
  }
}
</script>
