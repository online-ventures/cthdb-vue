<template lang="pug">
div
  section.hero.is-primary
    .hero-body
      .container
        h1.title Select a theatre
        p.subtitle Search and select a theatre below
  transition(name="long-fade")
    section.section(v-if="tenants")
      .container
        .columns
          .column(:class="canAdd ? 'is-10' : 'is-12'")
            form.search-form(@submit.prevent)
              .control.has-icons-left
                input.input(placeholder="search" @input="searchInput")
                span.icon.is-small.is-left
                  font-awesome-icon(icon="search" size="1x")
          .column.has-text-right-tablet(v-if="canAdd")
            button.button.is-primary.is-fullwidth(@click="addTenant")
              span.icon.is-small
                font-awesome-icon(icon="plus" size="1x")
              span Add Theatre

        transition(name="fade")
          div(v-if="!loading")
            list-row(v-for="tenant in allTenants"
              :key="tenant.id"
              :title="tenant.name"
              :subtitle="tenant.created_at | prettyMonth"
              icon="calendar-week"
              :item="tenant"
              v-on:action="setTenant")
</template>

<script>
import ListRow from '@/components/ListRow'
import infiniteScrollingMixin from '@/mixins/infiniteScrollingMixin'
import debounce from 'lodash/debounce'
import TENANT_LIST from '@/graphql/tenants/list.gql'
import TENANT_SEARCH from '@/graphql/tenants/search.gql'

export default {
  components: {
    ListRow
  },

  mixins: [
    infiniteScrollingMixin
  ],

  data () {
    return {
      tenants: null,
      allTenants: [],
      search: '',
      loading: false
    }
  },

  computed: {
    canAdd () {
      const user = this.$auth.user || {}
      return user.tenants && user.tenants.length === 0
    },
    searching () {
      return this.search !== ''
    },
    tenantName () {
      return '%' + this.search + '%'
    },
    query () {
      return this.searching ? TENANT_SEARCH : TENANT_LIST
    },
    queryVariables () {
      const variables = this.infiniteQueryVariables
      if (this.searching) {
        variables.search = this.showName
      } else {
        delete variables.search
      }
      return variables
    }
  },

  apollo: {
    tenants: {
      query () {
        return this.query
      },
      variables () {
        return this.queryVariables
      },
      update ({ tenants }) {
        return this.processFetchedData(tenants, this.allTenants)
      }
    }
  },

  filters: {
    prettyMonth (value) {
      const date = new Date(value)
      const options = { year: 'numeric', month: 'long' }
      return 'Joined ' + date.toLocaleDateString('en-US', options)
    }
  },

  methods: {
    searchInput: debounce(function (event) {
      this.allTenants = []
      this.page = 1
      this.search = event.target.value
    }, 300),
    addTenant () {
      this.$router.push({ name: 'new-theatre' })
    },
    async setTenant (item) {
      this.loading = true
      const tenant = {
        id: item.id,
        short_name: item.short_name,
        name: item.name,
        max_points_per_show: item.max_points_per_show
      }
      await this.$auth.saveTenant(tenant)
      this.loading = false
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
</style>
