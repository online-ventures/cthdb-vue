export default {
  mounted () {
    // Always start at the top.  Starting at bottom breaks this component!
    window.scrollTo(0, 0)
    // Add scroll listener
    window.onscroll = () => {
      const position = Math.max(window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop)
      const outerPosition = position + window.innerHeight
      const height = document.documentElement.offsetHeight
      const atBottom = outerPosition >= height - 1
      if (this.infiniteDebug) console.log('Scroll position: ' + outerPosition + '/' + height)
      if (atBottom) this.fetchMore()
    }
  },

  data () {
    return {
      infiniteDebug: false,
      page: 1,
      rowsPerPage: 25,
      hasMore: false,
      infiniteIdKey: 'id'
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
      if (this.page === 1) {
        allRecords.length = 0
      }
      newRecords.forEach(record => {
        const index = allRecords.findIndex(existing => {
          return existing[this.infiniteIdKey] === record[this.infiniteIdKey]
        })
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
