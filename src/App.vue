<template lang="pug">
div
  nav-bar
  transition(name="shrink")
    .notification.is-warning.has-text-centered.is-radiusless.is-marginless(v-if="newContent")
      | A new version if available.
      |
      a(@click="refresh") Refresh
      |
      | now to load it.
  transition(appear name='slide-fade' mode='out-in')
    router-view
</template>

<script>
import NavBar from '@/components/NavBar'

export default {
  name: 'App',

  components: {
    NavBar
  },

  created () {
    if (process.env.NODE_ENV === 'production') {
      setTimeout(this.checkForUpdate, 10000)
      setTimeout(this.requireUpdateCheck, 1000)
    }
  },

  data () {
    return {
      newContent: false
    }
  },

  computed: {
  },

  methods: {
    refresh () {
      this.$router.go()
    },
    checkForUpdate () {
      if (this.newContent) return
      navigator.serviceWorker.getRegistration('/service-worker.js').then(reg => {
        reg.update()
      })
      setTimeout(this.checkForUpdate, 10000)
    },
    requireUpdateCheck () {
      if (this.newContent) return

      const elem = document.getElementById('service-worker-data')
      if (elem && elem.getAttribute('data-new-content')) {
        this.newContent = true
      } else {
        setTimeout(this.requireUpdateCheck, 1000)
      }
    }
  }
}
</script>

<style lang="scss">
@import "src/scss/_variables";
@import "~bulma";

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s;
}
.slide-fade-enter {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.long-fade-enter-active, .long-fade-leave-active {
  transition: opacity .5s;
}
.long-fade-enter, .long-fade-leave-to {
  opacity: 0;
}
.notification {
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  max-height: 6em;
  &.large {
    max-height: 10em;
  }
}
.shrink-enter-active {
  transition: all 0.3s;
}
.shrink-enter {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.shrink-leave-active {
  transition: all 0.3s;
  overflow: hidden;
}
.shrink-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
