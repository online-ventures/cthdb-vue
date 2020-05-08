export default {
  mounted () {
    window.onscroll = () => {
      const position = Math.max(window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop)
      const outerPosition = position + window.innerHeight
      const atBottom = outerPosition === document.documentElement.offsetHeight
      if (atBottom) this.fetchMore()
    }
  },

  data () {
    return {
      page: 1,
      rowsPerPage: 25,
      hasMore: false
    }
  },

  computed: {
    offset () {
      return (this.page - 1) * this.rowsPerPage
    },
    infiniteQueryVariables () {
      return {
        offset: this.offset,
        limit: this.rowsPerPage
      }
    }
  },

  methods: {
    fetchMore () {
      if (!this.hasMore) return
      this.hasMore = false
      this.page += 1
    },
    processFetchedData (newRecords, allRecords) {
      newRecords.forEach(record => {
        const index = allRecords.findIndex(existing => existing.id === record.id)
        if (index >= 0) {
          allRecords[index] = record
        } else {
          allRecords.push(record)
        }
      })
      this.hasMore = newRecords.length === this.rowsPerPage
      return newRecords
    }
  }
}
