<template lang="pug">
.modal
  .modal-background
  .modal-card
    header.modal-card-head
      <p class="modal-card-title">Modal title</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success">Save changes</button>
      <button class="button">Cancel</button>
    </footer>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      msg: ''
    }
  },
  methods: {
    handleLoginEvent (data) {
      if (data.error) {
        this.show = true
        this.msg = data.error.errorDescription
      } else {
        this.show = false
        this.msg = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
