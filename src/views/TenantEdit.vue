<template lang="pug">
transition(name="long-fade")
  div(v-if="tenant")
    section.hero.is-primary
      .hero-body
        .container
          h1.title {{ tenant.name }}
          h1.subtitle Manage theatre settings

    section.section
      .container

        w-notification(
          :message="notificationMessage"
          type="success"
          :lifetime="2"
          @closed="notificationMessage = null")

        h2.title.is-4 Basic Info

        .columns
          .column
            .field
              label.label Theatre Name
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="ticket-alt")
                w-input(v-model="record.name"
                  required
                  maxlength="50"
                  :debounce="updateTenant")

          .column
            .field
              label.label Abbreviated Name
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="ticket-alt")
                w-input(v-model="record.short_name"
                  required
                  maxlength="8"
                  :debounce="updateTenant")

        .columns
          .column
            .field
              label.label City
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="map-marker-alt")
                w-input(v-model="record.city"
                  required
                  maxlength="40"
                  :debounce="updateTenant")

          .column
            .field
              label.label State
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="map-marker-alt")
                w-input(v-model="record.state"
                  required
                  minlength="2"
                  maxlength="2"
                  :debounce="updateTenant")

    section.section
      .container

        h2.title.is-4 Shows

        .columns
          .column(v-if="tenant")
            .field
              label.label.has-help-icon
                | Max Points Per Show
                |
                a.icon.is-small.has-text-link(:title="maxPointHelpText")
                  font-awesome-icon(icon="question-circle")
              .control.has-icons-left
                span.icon.is-small
                  font-awesome-icon(icon="coins")
                w-input(v-model="record.max_points_per_show"
                  required
                  type="number"
                  min="1"
                  max="100"
                  :debounce="updateTenant")

    section.section
      .container

        w-notification(
          :message="levelSuccessMessage"
          type="success"
          :lifetime="2"
          @closed="levelSuccessMessage = null")

        h2.title.is-4.has-help-icon
          | Awards
          |
          a.icon.is-small.has-text-link.is-size-6(:title="levelHelpText")
            font-awesome-icon(icon="question-circle")

        .buttons
          button.button.is-primary(
            @click="addLevel"
            :class="{ 'is-loading': updating }")
            span.icon.is-small
              font-awesome-icon(icon="plus" size="1x")
            span Add award

        transition(name="expand")
          p.has-text-centered.is-italic(v-if="newLevels.length === 0") No levels have been added yet.

        transition-group(name="expand" tag="div")
          .row(v-for="level in newLevels" :key="level.id")
            .columns
              .column
                .field
                  .control.has-icons-left
                    span.icon.is-small
                      font-awesome-icon(icon="star")
                    w-input(v-model="level.record.name"
                      required
                      minlength="2"
                      maxlength="30"
                      placeholder="Level name"
                      :debounce="updateLevel"
                      :debounceItem="level.record")
              .column
                .field
                  .control.has-icons-left
                    span.icon.is-small
                      font-awesome-icon(icon="coins")
                    w-input(v-model="level.record.points"
                      type="number"
                      required
                      min="0"
                      max="100"
                      placeholder="Points needed"
                      :debounce="updateLevel"
                      :debounceItem="level.record")
              .column
                .field.has-addons
                  .control.badge-color
                    button.button.light-silver.is-fullwidth(
                      @click="selectColor(level, lightSilver)")
                      a.icon(
                        title="Badge color: light silver"
                        :class="colorClass(level, lightSilver)")
                        font-awesome-icon(icon="star")
                  .control.badge-color
                    button.button.silver.is-fullwidth(
                      @click="selectColor(level, silver)")
                      a.icon(
                        title="Badge color: silver"
                        :class="colorClass(level, silver)")
                        font-awesome-icon(icon="star")
                  .control.badge-color
                    button.button.dark-silver.is-fullwidth(
                      :class="{ 'selected': level.record.color === darkSilver }"
                      @click="selectColor(level, darkSilver)")
                      a.icon(
                        title="Badge color: dark silver"
                        :class="colorClass(level, darkSilver)")
                        font-awesome-icon(icon="star")
                  .control.badge-color
                    button.button.dark-bronze.is-fullwidth(
                      :class="{ 'selected': level.record.color === darkBronze }"
                      @click="selectColor(level, darkBronze)")
                      a.icon(
                        title="Badge color: dark bronze"
                        :class="colorClass(level, darkBronze)")
                        font-awesome-icon(icon="star")
                  .control.badge-color
                    button.button.bronze.is-fullwidth(
                      :class="{ 'selected': level.record.color === bronze }"
                      @click="selectColor(level, bronze)")
                      a.icon(
                        title="Badge color: bronze"
                        :class="colorClass(level, bronze)")
                        font-awesome-icon(icon="star")
                  .control.badge-color
                    button.button.gold.is-fullwidth(
                      :class="{ 'selected': level.record.color === gold }"
                      @click="selectColor(level, gold)")
                      a.icon(
                        title="Badge color: gold"
                        :class="colorClass(level, gold)")
                        font-awesome-icon(icon="star")
                  .control.badge-color
                    button.button.platinum.is-fullwidth(
                      :class="{ 'selected': level.record.color === platinum }"
                      @click="selectColor(level, platinum)")
                      a.icon(
                        title="Badge color: platinum"
                        :class="colorClass(level, platinum)")
                        font-awesome-icon(icon="star")
              .column.is-2
                button.button.is-danger.is-fullwidth(@click="deletingLevel = level")
                  span.icon.is-small
                    font-awesome-icon(icon="trash")
                  span Delete
    w-confirm(
      :accepted="removeLevel"
      :cancelled="cancelLevel"
      title="Delete a level confirmation"
      :item="deletingLevel"
      :name="item => item.record.name")

    section.section
      .container

        w-notification(
          :message="editorNotification"
          :type="editorNotificationType"
          :lifetime="2"
          @closed="editorNotification = null")

        h2.title.is-4.has-help-icon
          | Editors
          |
          a.icon.is-small.has-text-link.is-size-6(:title="editorHelpText")
            font-awesome-icon(icon="question-circle")

        .buttons
          button.button.is-primary(@click="addNewEditor")
            span.icon.is-small
              font-awesome-icon(icon="plus" size="1x")
            span Add editor

        transition(name="expand")
          p.has-text-centered.is-italic(v-if="newEditors.length === 0 && !addingEditor")
            | No editors have been added yet.

        transition-group(name="expand" tag="div")
          .row(v-for="editor in newEditors" :key="editor.id")
            .columns
              .column
                p.title.is-5 {{ editor.record.name }}
              .column.is-2
                button.button.is-danger.is-fullwidth(@click="deletingEditor = editor")
                  span.icon.is-small
                    font-awesome-icon(icon="trash")
                  span Delete

        transition(name="expand")
          .row(v-if="addingEditor" ref="addNewEditor")
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
                      placeholder="Account email")
              .column.is-2
                button.button.is-primary.is-fullwidth(@click="addEditor")
                  span.icon.is-small
                    font-awesome-icon(icon="save")
                  span Save

    w-confirm(
      :accepted="removeEditor"
      :cancelled="cancelEditor"
      title="Remove an editor confirmation"
      :item="deletingEditor"
      :name="item => item.record.name")
</template>

<script>
import animateScrollTo from 'animated-scroll-to'
import TENANT from '@/graphql/tenants/edit.gql'
import UPDATE_TENANT from '@/graphql/tenants/update.gql'
import LEVELS from '@/graphql/levels/list.gql'
import INSERT_LEVEL from '@/graphql/levels/insert.gql'
import UPDATE_LEVEL from '@/graphql/levels/update.gql'
import DELETE_LEVEL from '@/graphql/levels/delete.gql'
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
      tenant: null,
      levels: null,
      newLevels: [],
      addingEditor: false,
      editors: null,
      newEditors: [],
      editorEmail: '',
      nextId: 1,
      record: {
        name: '',
        short_name: '',
        city: '',
        state: '',
        max_points_per_show: '0'
      },
      notificationMessage: null,
      levelSuccessMessage: null,
      editorNotification: null,
      editorNotificationType: null,
      maxPointHelpText: 'The maximum number of points a volunteer can earn per show',
      levelHelpText: 'Awards are accomplishments volunteers reach after a given number of points has been reached',
      editorHelpText: 'Editors are users that have the ability to make changes for this theatre',
      lightSilver: '#a7a9ae',
      silver: '#839696',
      darkSilver: '#71716f',
      darkBronze: '#6b0704',
      bronze: '#a3350c',
      gold: '#e6bf33',
      platinum: '#514e9c',
      deletingLevel: null,
      deletingEditor: null
    }
  },

  computed: {
    tenantId () {
      return parseInt(this.$route.params.id)
    },
    mutation () {
      return UPDATE_TENANT
    },
    newLevelPointValue () {
      const max = this.newLevels.reduce((max, level) => {
        return Math.max(max, level.record.points)
      }, 0)
      return max + 10
    }
  },

  apollo: {
    tenant: {
      query: TENANT,
      skip () {
        return !this.tenantId
      },
      variables () {
        return { id: this.tenantId }
      },
      update (data) {
        const tenant = data.tenants_by_pk
        this.record = {
          id: tenant.id,
          name: tenant.name,
          short_name: tenant.short_name,
          city: tenant.city,
          state: tenant.state,
          max_points_per_show: tenant.max_points_per_show
        }
        return tenant
      }
    },
    levels: {
      query: LEVELS,
      skip () {
        return !this.tenantId
      },
      variables () {
        return { tenant_id: this.tenantId }
      },
      update (data) {
        this.newLevels = []
        data.levels.forEach(level => this.pushLevel(level))
        return data.levels
      }
    },
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
    beforeSave (record) {
      // Assign the owner if inserting
      if (!record.id) {
        record.owner_id = this.$auth.userId
      }
      return record
    },
    onSaved (data) {
    },
    async addLevel () {
      if (this.updating) return
      try {
        this.updating = true
        const result = await this.$apollo.mutate({
          mutation: INSERT_LEVEL,
          variables: this.newLevel()
        })
        const level = result.data.insert_levels.returning[0]
        this.pushLevel(level)
      } catch (error) {
        console.log('There was an error saving this record')
      } finally {
        this.updating = false
      }
    },
    newLevel () {
      return {
        tenant_id: this.tenantId,
        name: 'New Level',
        points: this.newLevelPointValue,
        color: this.lightSilver
      }
    },
    pushLevel (record) {
      this.newLevels.push({
        id: this.nextId,
        record: {
          id: record.id,
          name: record.name,
          points: record.points,
          color: record.color
        }
      })
      this.nextId += 1
    },
    async updateTenant (data) {
      if (this.updating || !data.valid) return
      try {
        this.updating = true
        await this.$apollo.mutate({
          mutation: UPDATE_TENANT,
          variables: this.record
        })
        this.notificationMessage = 'Theatre updated successfully'
        this.updating = false
      } catch (error) {
        console.log('There was an error saving this record')
      }
    },
    async updateLevel (data) {
      if (this.updating || !data.valid) return
      try {
        this.updating = true
        await this.$apollo.mutate({
          mutation: UPDATE_LEVEL,
          variables: data.item
        })
        this.updating = false
        this.levelSuccessMessage = 'Award updated successfully'
      } catch (error) {
        console.log('There was an error saving this record')
      }
    },
    selectColor (level, color) {
      level.record.color = color
      this.updateLevel({
        item: level.record,
        valid: true
      })
    },
    colorClass (level, color) {
      if (level.record.color === color) {
        return 'has-text-white-ter'
      }
      return 'has-text-grey'
    },
    cancelLevel () {
      this.deletingLevel = null
    },
    async removeLevel () {
      if (!this.deletingLevel) return
      const levelId = this.deletingLevel.record.id
      const result = await this.deleteLevel(levelId)
      if (result) {
        this.newLevels = this.newLevels.filter(level => level.record.id !== levelId)
      }
    },
    async deleteLevel (id) {
      if (this.updating) return false
      try {
        this.updating = true
        await this.$apollo.mutate({
          mutation: DELETE_LEVEL,
          variables: { id: id }
        })
        this.updating = false
        return true
      } catch (error) {
        console.log('There was an error deleting this record')
        return false
      }
    },
    addNewEditor () {
      this.addingEditor = true
      this.editorEmail = ''
      setTimeout(() => animateScrollTo(document.body.scrollHeight), 500)
    },
    async addEditor () {
      if (this.updating) return
      this.updating = true
      const user = await this.insertEditor()
      if (user.id) {
        this.editorNotify('success', user.name + ' successfully added')
        this.pushEditor(user)
        this.addingEditor = false
      } else {
        this.editorNotify('danger', 'User could not be found or could not be added')
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
        this.editorNotify('warning', 'An error occurred, so sorry')
        return {}
      }
    },
    editorNotify (type, message) {
      this.editorNotificationType = type
      this.editorNotification = message
    },
    pushEditor (record) {
      this.newEditors.push({
        id: this.nextId,
        record: {
          id: record.id,
          name: record.name
        }
      })
      this.nextId += 1
    },
    cancelEditor () {
      this.deletingEditor = null
    },
    async removeEditor () {
      if (this.updating) return
      this.updating = true
      const editor = this.deletingEditor
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
  max-height: 5em;
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
.badge-color {
  width: 14.5%;
  padding-left: 0;
  padding-right: 0;
}
.light-silver {
  background-color: #a7a9ae;
}
.silver {
  background-color: #839696;
}
.dark-silver {
  background-color: #71716f;
}
.dark-bronze {
  background-color: #6b0704;
}
.bronze {
  background-color: #a3350c;
}
.gold {
  background-color: #e6bf33;
}
.platinum {
  background-color: #514e9c;
}
.selected a {
  color: black;
}
</style>
