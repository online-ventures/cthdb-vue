<template lang="pug">
form(ref="form" @submit.prevent="save")
  w-notification(
    :message="notificationMessage"
    :type="notificationType"
    @closed="status = null")

  fieldset(:disabled="formDisabled")
    slot

  .columns.form-buttons
    .column(v-if="showDelete")
        button.button.is-danger(@click.prevent="onDelete" :disabled="formDisabled") Delete
    .column
      .control.buttons.is-right
        button.button(v-if="cancel" @click.prevent="cancel") Cancel
        button.button.is-primary(
          :disabled="formDisabled"
          @click.prevent="save"
          :class="{ 'is-loading': saving }") Save
</template>

<script>
import WNotification from '@/components/WNotification.vue'

export default {
  components: {
    WNotification
  },

  props: {
    record: {
      type: Object,
      required: true
    },
    editorId: {
      type: Number,
      required: false
    },
    tenantId: {
      type: Number,
      required: false
    },
    complete: {
      type: Function,
      required: true
    },
    cancel: {
      type: Function,
      required: false
    },
    onDelete: {
      type: Function,
      required: false
    },
    afterValidate: {
      type: Function,
      required: false
    },
    beforeSave: {
      type: Function,
      required: false
    },
    errorMessage: {
      type: String,
      required: false,
      default: 'Please fix the highlighted fields'
    },
    brokeMessage: {
      type: String,
      required: false,
      default: 'There were some technical difficulties saving this. Please try again later.'
    },
    successMessage: {
      type: String,
      required: false,
      default: 'Successfully saved'
    },
    mutation: {
      type: Object,
      required: true
    },
    showSummaryError: {
      type: Boolean,
      required: false,
      default: false
    },
    showSuccessMessage: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      savingCounter: 0,
      apolloError: null,
      mutationResult: null,
      formDisabled: false,
      status: null
    }
  },

  computed: {
    saving () {
      return this.savingCounter > 0
    },
    formFields () {
      return this.$refs.form.querySelectorAll('input,textarea,select')
    },
    fieldset () {
      return this.$refs.form.querySelector('fieldset')
    },
    showDelete () {
      return this.onDelete && this.record && this.record.id
    },
    notificationMessage () {
      if (this.status === 'validation') {
        return this.validationMessage
      } else if (this.status === 'broken') {
        return this.brokeMessage
      } else if (this.showSummaryError && this.status === 'error') {
        return this.errorMessage
      } else if (this.showSuccessMessage && this.status === 'successful') {
        return this.successMessage
      } else {
        return null
      }
    },
    notificationType () {
      if (this.status === 'broken') {
        return 'warning'
      } else if (this.status === 'error' || this.status === 'validation') {
        return 'danger'
      } else if (this.status === 'successful') {
        return 'success'
      } else {
        return null
      }
    },
    queryVariables () {
      const variables = this.beforeSave
        ? this.beforeSave(this.record)
        : this.record
      if (this.editorId) {
        variables.editor_id = this.editorId
      }
      if (this.tenantId && !this.record.id) {
        variables.tenant_id = this.tenantId
      }
      return variables
    }
  },

  methods: {
    loadRecord (data) {
      this.record = Object.assign({}, data)
      return data
    },

    async save () {
      if (this.formDisabled || (this.status && this.status !== 'error')) return
      if (this.validate()) {
        this.formDisabled = true
        this.mutationResult = await this.update()
        if (this.mutationResult) {
          this.status = 'successful'
          this.complete(this.mutationResult)
        }
      }
    },

    validate () {
      this.formFields.forEach(field => {
        const event = new Event('change')
        field.dispatchEvent(event)
      })
      const valid = this.$refs.form.checkValidity()
      if (this.afterValidate) {
        this.validationMessage = this.afterValidate()
        if (this.validationMessage) {
          this.status = 'validation'
          return
        }
      }
      if (!valid) this.status = 'error'
      return valid
    },

    update () {
      return this.$apollo.mutate({
        mutation: this.mutation,
        variables: this.queryVariables,
        loadingKey: 'savingCounter'
      }).then(result => {
        const keys = Object.keys(result.data).filter(key => {
          return key.startsWith('insert_') || key.startsWith('update_')
        })
        if (keys && keys.length) {
          const returning = result.data[keys[0]].returning
          if (returning) return returning[0]
        }
        return result.data
      }).catch(error => this.handleApolloError(error))
    },

    resetForm () {
      this.brokeNotification = null
      this.successNotification = null
      this.status = null
      this.formDisabled = false
    },

    handleApolloError (error) {
      console.log(error)
      this.apolloError = error
      this.status = 'broken'
    }
  }
}
</script>

<style scoped lang="scss">
.fade-notification-enter-active, .fade-notification-leave-active {
  transition: all 0.5s;
}
.fade-notification-enter, .fade-notification-leave-to {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0;
  opacity: 0;
}
.form-buttons {
  margin-top: 1em;
}
</style>
