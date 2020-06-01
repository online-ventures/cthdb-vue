<template lang="pug">
section.section
  .container

    w-notification(
      :message="notification"
      :type="notificationType"
      :lifetime="2"
      @closed="notification = null")

    h2.title.is-4.has-help-icon
      | Editors
      |
      a.icon.is-small.has-text-link.is-size-6(:title="helpText")
        font-awesome-icon(icon="question-circle")

    .buttons
      button.button.is-primary(
        @click="addNewEditor"
        :class="{ 'is-loading': updating }")
        span.icon.is-small
          font-awesome-icon(icon="plus" size="1x")
        span Add editor

    transition(name="expand")
      p.has-text-centered.is-italic(v-if="newEditors.length === 0 && !adding")
        | No editors have been added yet.

    template(v-if="newEditors.length > 0")
      .columns.headings.is-hidden-mobile
        .column
          p.is-size-6.has-text-weight-bold Name
        .column.is-2

    transition-group(name="expand" tag="div")
      .row(v-for="editor in newEditors" :key="editor.id")
        .columns.is-vcentered
          .column.editor-row
            span.icon.is-small.user-icon
              font-awesome-icon(icon="user")
            span.is-size-5.editor-name {{ editor.name }}
          .column.is-2
            button.button.is-danger.is-fullwidth(@click="deleting = editor")
              span.icon.is-small
                font-awesome-icon(icon="trash")
              span Delete

        .is-hidden-tablet(v-if="editor.id !== newEditors[newEditors.length-1].id")
          hr.divider

    transition(name="expand")
      .row(v-if="adding" ref="addNewEditor")
        .columns
          .column
            .field
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="user")
                w-input(v-model="editorEmail"
                  required
                  type="email"
                  minlength="2"
                  maxlength="30"
                  typeMismatch="Please enter a valid email address"
                  autocomplete="off"
                  placeholder="Account email")
          .column.is-2
            button.button.is-primary.is-fullwidth(@click="addEditor")
              span.icon.is-small
                font-awesome-icon(icon="save")
              span Save

    .add-new-editor(ref="addNewEditorTarget")

  w-confirm(
    :accepted="removeEditor"
    :cancelled="cancelConfirm"
    title="Remove editor confirmation"
    :item="deleting"
    :name="item => item.name")
</template>

<script>
import animateScrollTo from 'animated-scroll-to'
import EDITORS from '@/graphql/users/editors.gql'
import INSERT_EDITOR from '@/graphql/roles/insert.gql'
import DELETE_EDITOR from '@/graphql/roles/delete.gql'

export default {
  mounted () {
    window.scrollTo(0, 0)
  },

  data () {
    return {
      updating: false,
      adding: false,
      editors: null,
      newEditors: [],
      editorEmail: '',
      notification: null,
      notificationType: null,
      helpText: 'Editors are users that have the ability to make changes for this theatre',
      deleting: null
    }
  },

  computed: {
    tenantId () {
      return parseInt(this.$route.params.id)
    }
  },

  apollo: {
    editors: {
      query: EDITORS,
      skip () {
        return !this.tenantId || !this.$auth.userId
      },
      variables () {
        return {
          tenant_id: this.tenantId,
          user_id: this.$auth.userId,
          name: 'staff'
        }
      },
      update (data) {
        this.newEditors = []
        data.users.forEach(user => this.pushEditor(user))
        return data.users
      }
    }
  },

  methods: {
    addNewEditor () {
      this.adding = true
      this.editorEmail = ''
      setTimeout(() => animateScrollTo(this.$refs.addNewEditorTarget), 500)
    },
    async addEditor () {
      if (this.updating) return
      this.updating = true
      const user = await this.insertEditor()
      if (user.id) {
        this.notify('success', user.name + ' successfully added')
        this.pushEditor(user)
        this.adding = false
      } else {
        this.notify('danger', 'User could not be found or could not be added')
      }
      this.updating = false
    },
    async insertEditor () {
      try {
        const result = await this.$apollo.mutate({
          mutation: INSERT_EDITOR,
          variables: {
            tenant_id: this.tenantId,
            email: this.editorEmail
          }
        })
        return result.data.add_editor
      } catch (error) {
        this.notify('warning', 'An error occurred, so sorry')
        return {}
      }
    },
    notify (type, message) {
      this.notificationType = type
      this.notification = message
    },
    pushEditor (record) {
      this.newEditors.push({
        id: record.id,
        name: record.name
      })
    },
    cancelConfirm () {
      this.deleting = null
    },
    async removeEditor () {
      if (this.updating) return
      this.updating = true
      const editor = this.deleting
      const role = await this.deleteEditor(editor.record)
      if (role) {
        this.editorNotify('success', editor.record.name + ' successfully removed')
        this.newEditors = this.newEditors.filter(existing => existing.id !== editor.id)
      } else {
        this.editorNotify('danger', 'There was an error removing this editor')
      }
      this.updating = false
    },
    deleteEditor (editor) {
      return this.$apollo.mutate({
        mutation: DELETE_EDITOR,
        variables: {
          user_id: editor.id,
          name: 'staff',
          tenant_id: this.tenantId
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.has-help-icon {
  line-height: 1.2em;
  .icon {
    margin-left: 0.25em;
  }
}
.row {
  max-height: 10em;
  .columns {
    margin-top: 0;
    margin-bottom: 0;
  }
}
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s;
}
.expand-enter,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.add-new-editor {
}
.editor-row {
  position: relative;
}
.user-icon {
  position: absolute;
  top: 1.2em;
}
.editor-name {
  margin-left: 2em;
}
.divider {
  margin-top: 2.5em;
  margin-bottom: 2em;
  border-top: #eee 2px solid;
}
</style>
