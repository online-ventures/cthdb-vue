export default {
  mounted () {
    // Always start at the top.  Starting at bottom breaks this component!
    window.scrollTo(0, 0)
    // Add scroll listener
    window.onscroll = this.getScrollPosition
  },

  data () {
    return {
      infiniteDebug: false,
      page: 1,
      leeway: 200,
      rowsPerPage: 10,
      hasMore: false,
      infiniteIdKey: 'id',
      nearBottom: false
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

  watch: {
    nearBottom (value) {
      if (value) {
        this.fetchMore()
      }
    }
  },

  methods: {
    fetchMore () {
      this.$nextTick(() => {
        this.getScrollPosition()
        if (this.hasMore && this.nearBottom) {
          this.hasMore = false
          this.page += 1
          if (this.infiniteDebug) console.log('Onto page: ' + this.page)
        }
      })
    },
    getScrollPosition () {
      const position = Math.max(window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop)
      const outerPosition = position + window.innerHeight
      const height = document.documentElement.offsetHeight
      this.nearBottom = outerPosition >= height - this.leeway
      if (this.infiniteDebug) console.log('Scroll position: ' + outerPosition + '/' + height)
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
      this.fetchMore()
      return newRecords
    }
  }
}
