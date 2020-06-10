<template lang="pug">
transition(name="long-fade")
  div.page(v-if="tenant")
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
            w-field(label="Theatre Name" icon="ticket-alt")
              w-input(v-model="record.name"
                required
                maxlength="50"
                :debounce="updateTenant")

          .column
            w-field(label="Abbreviated Name" icon="ticket-alt")
              w-input(v-model="record.short_name"
                required
                maxlength="8"
                :debounce="updateTenant")

        .columns
          .column
            w-field(label="City" icon="map-marker-alt")
              w-input(v-model="record.city"
                required
                maxlength="40"
                :debounce="updateTenant")

          .column
            w-field(label="State" icon="map-marker-alt")
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
            w-field(label="Max Points Per Show" icon="coins" :help="maxPointHelpText")
              w-input(v-model="record.max_points_per_show"
                required
                type="number"
                min="1"
                max="100"
                rangeOverflow="The max points is 100 per show"
                rangeUnderflow="The min points is 1 per show"
                :debounce="updateTenant")

    w-crud(
      title="Award"
      itemName="Level"
      :helpText="levelHelpText"
      :columns="levelColumns"
      :newItem="newLevel"
      :listMutation="levels"
      :listVariables="levelVariables"
      :insertMutation="insertLevel"
      :updateMutation="updateLevel"
      :deleteMutation="deleteLevel"
      :skip="() => !this.tenantId")

    w-crud(
      itemName="Membership"
      :helpText="membershipHelpText"
      :columns="membershipColumns"
      :newItem="newMembership"
      :listMutation="memberships"
      :listVariables="membershipVariables"
      :insertMutation="insertMembership"
      :updateMutation="updateMembership"
      :deleteMutation="deleteMembership"
      :skip="() => !this.tenantId")

    editor-crud
</template>

<script>
// Tenant
import TENANT from '@/graphql/tenants/edit.gql'
import UPDATE_TENANT from '@/graphql/tenants/update.gql'

// Levels
import LEVELS from '@/graphql/levels/list.gql'
import INSERT_LEVEL from '@/graphql/levels/insert.gql'
import UPDATE_LEVEL from '@/graphql/levels/update.gql'
import DELETE_LEVEL from '@/graphql/levels/delete.gql'

// Memberships
import MEMBERSHIPS from '@/graphql/memberships/list.gql'
import INSERT_MEMBERSHIP from '@/graphql/memberships/insert.gql'
import UPDATE_MEMBERSHIP from '@/graphql/memberships/update.gql'
import DELETE_MEMBERSHIP from '@/graphql/memberships/delete.gql'

// Editors
import EditorCrud from '@/components/EditorCrud'

export default {
  mounted () {
    window.scrollTo(0, 0)
  },

  components: {
    EditorCrud
  },

  data () {
    return {
      // Tenant
      updating: false,
      tenant: null,
      record: {
        name: '',
        short_name: '',
        city: '',
        state: '',
        max_points_per_show: '0'
      },
      notificationMessage: null,
      maxPointHelpText: 'The maximum number of points a volunteer can earn per show',
      // Editors
      addingEditor: false,
      editors: null,
      newEditors: [],
      editorEmail: '',
      generatedId: 1,
      editorNotification: null,
      editorNotificationType: null,
      editorHelpText: 'Editors are users that have the ability to make changes for this theatre',
      deletingEditor: null,
      // Memberships
      membershipHelpText: 'Memberships allow you to track enrollment status of the individual members of your organization',
      membershipColumns: [
        {
          header: 'Name',
          field: 'name',
          type: 'text',
          icon: 'money-bill-wave',
          minlength: 2,
          maxlength: 30
        },
        {
          header: 'Covered individuals',
          field: 'max_participants',
          type: 'number',
          icon: 'users',
          min: 1,
          max: 100
        },
        {
          header: 'Renewal',
          field: 'auto_renew',
          type: 'toggle',
          yesText: 'Auto-renew',
          noText: 'One-time'
        }
      ],
      memberships: MEMBERSHIPS,
      insertMembership: INSERT_MEMBERSHIP,
      updateMembership: UPDATE_MEMBERSHIP,
      deleteMembership: DELETE_MEMBERSHIP,
      // Levels
      levelHelpText: 'Awards are accomplishments volunteers reach after a given number of points has been reached',
      levelColumns: [
        {
          header: 'Name',
          field: 'name',
          type: 'text',
          icon: 'star',
          minlength: 2,
          maxlength: 30
        },
        {
          header: 'Points needed',
          field: 'points',
          type: 'number',
          icon: 'coins',
          min: 1,
          max: 100
        },
        {
          header: 'Badge color',
          field: 'color',
          type: 'badge-color'
        }
      ],
      levels: LEVELS,
      insertLevel: INSERT_LEVEL,
      updateLevel: UPDATE_LEVEL,
      deleteLevel: DELETE_LEVEL,
      defaultColor: '#a7a9ae'
    }
  },

  computed: {
    tenantId () {
      return parseInt(this.$route.params.id)
    },
    membershipVariables () {
      return { tenant_id: this.tenantId }
    },
    levelVariables () {
      return { tenant_id: this.tenantId }
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
    }
  },

  methods: {
    // Tenant
    async updateTenant (data) {
      if (this.updating || !data.valid) return
      try {
        this.updating = true
        await this.$apollo.mutate({
          mutation: UPDATE_TENANT,
          variables: this.record
        })
        this.notificationMessage = 'Theatre updated successfully'
      } catch (error) {
        console.log('There was an error saving this record')
      } finally {
        this.updating = false
      }
    },
    newLevel (levels) {
      const maxPoints = levels.reduce((max, level) => {
        return Math.max(max, level.points)
      }, 0)
      return {
        tenant_id: this.tenantId,
        name: 'New Level',
        points: maxPoints + 10,
        color: this.defaultColor
      }
    },
    newMembership () {
      return {
        tenant_id: this.tenantId,
        name: 'Membership name'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  padding-bottom: 5em;
}
</style>
