export default {
  data () {
    return {
      record: {},
      attributes: [],
      savingCounter: 0,
      apolloError: null,
      mutationResult: null
    }
  },

  computed: {
    saving () {
      return this.savingCounter > 0
    },
    newRecord () {
      return !this.record.id
    },
    attributesWithPk () {
      return this.attributes.filter(attr => attr !== 'id').concat(['id'])
    },
    recordData () {
      return this.attributesWithPk.reduce((map, attribute) => {
        if (!this.newRecord || attribute !== 'id') {
          map[attribute] = (this.record && this.record[attribute]) || null
        }
        return map
      }, {})
    }
  },

  methods: {
    loadRecord (data) {
      this.record = Object.assign({}, data)
      return data
    },

    async save () {
      if (!this.validate()) {
        return
      } else {
        await this.update()
      }
      this.onSaveComplete(this.mutationResult)
    },

    validate () {
      if (this.$refs.recordForm.checkValidity()) {
        return true
      } else {
        this.$refs.recordForm.reportValidity()
        return false
      }
    },

    async update () {
      await this.$apollo.mutate({
        mutation: this.formMutation,
        variables: this.recordData,
        loadingKey: 'savingCounter'
      }).then(result => {
        this.mutationResult = result.data
      })
    },

    handleApolloError (error, toast = '') {
      this.apolloError = error
      console.log(error)
      let message
      if (toast.length > 0) {
        message = toast
      } else {
        // TODO: Detect and display more useful toasts for common failure scenarios
        // eg. jwt expired, duplicate record insertion attempt, etc.
        message = 'There was an error saving this.  You may want to refresh the page'
      }
      this.$buefy.toast.open({
        message: message,
        type: 'is-danger'
      })
    }
  }
}
