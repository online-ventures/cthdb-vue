<template lang="pug">
transition(name="fade")
  .modal(v-if="display" class="is-active")
    .modal-background
    .modal-card
      header.modal-card-head
        p.modal-card-title {{ title }}
        button.delete(aria-label="close" @click="rejected")
      section.modal-card-body
        p Are you sure you want to delete {{ name(item) }}?
      footer.modal-card-foot
        button.button.is-success(
          :class="{ 'is-loading': loading }"
          @click="confirmed") Yes
        button.button(:disabled="loading" @click="rejected") No
</template>

<script>
export default {
  props: {
    accepted: {
      type: Function,
      required: true
    },
    cancelled: {
      type: Function,
      required: false
    },
    title: {
      type: String,
      default: 'Confirmation',
      required: false
    },
    item: {
      type: Object,
      required: false
    },
    name: {
      type: Function,
      default: item => item.name,
      required: false
    }
  },
  data () {
    return {
      display: false,
      loading: false
    }
  },
  computed: {
    modalClass () {
      return this.display ? 'is-active' : ''
    }
  },
  watch: {
    item (value) {
      if (value) this.display = true
    }
  },
  methods: {
    async confirmed () {
      this.loading = true
      await this.accepted(this.item)
      this.loading = false
      this.display = false
    },
    rejected () {
      if (this.loading) return
      this.display = false
      if (this.cancelled) {
        this.cancelled()
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
