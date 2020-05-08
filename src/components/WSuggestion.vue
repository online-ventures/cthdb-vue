<template lang="pug">
div.vue-suggestion
  input.input(
    v-model="searchText"
    type="search"
    :placeholder="placeholder"
    :disabled="disabled"
    :maxlength="maxLen"
    @blur="blur"
    @focus="focus"
    @input="inputChange"
    @keydown.enter.prevent="keyEnter"
    @keydown.up.prevent="keyUp"
    @keydown.down.prevent="keyDown")

  slot(v-if="loading" name="loading")
    div.loading Loading...

  transition(name="expand")
    .list(v-if="displayList")
      .list-item(
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'item-active': index === cursor }"
        @click="selectItem(item)"
        @mouseover="cursor = index")

        slot(name="suggestion" :item="item")
          span {{ item.name }}
</template>

<script>
export default {
  name: 'VueSuggestion',
  props: {
    minLen: {
      type: Number,
      default: 2
    },
    maxLen: {
      type: Number,
      default: 100
    },
    value: {
      type: [Object, String, Number],
      default: null
    },
    setLabel: {
      type: Function,
      default: item => item
    },
    items: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      searchText: '',
      showList: false,
      cursor: 0
    }
  },

  computed: {
    displayList () {
      return !this.loading && this.showList
    }
  },

  watch: {
    value: {
      handler (value) {
        if (!value) return
        this.searchText = this.setLabel(value)
      },
      deep: true
    }
  },
  mounted () {
    if (this.value) {
      this.searchText = this.setLabel(this.value)
    }
  },
  methods: {
    updateListVisibility () {
      setTimeout(() => {
        this.showList = this.searchText.length >= this.minLen &&
        this.items && this.items.length > 0
      }, 200)
    },

    inputChange () {
      this.cursor = 0
      const length = this.searchText.length
      const valid = length >= this.minLen && length <= this.maxLen
      const text = valid ? this.searchText : ''
      this.$emit('changed', text)
      this.updateListVisibility()
    },

    focus () {
      this.$emit('focus', this.searchText)
    },

    blur () {
      this.$emit('blur', this.searchText)
      // set timeout for the click event to work
      setTimeout(() => {
        this.showList = false
        // Reset the label to reflect the state of the value
        this.searchText = this.setLabel(this.value)
      }, 200)
    },

    selectItem (item) {
      if (item) {
        this.searchText = this.setLabel(item)
        // Send selected event after value has been changed
        setTimeout(() => {
          this.$emit('selected', item)
        }, 200)
      }
      this.$emit('input', item)
    },

    keyUp () {
      this.$emit('key-up', this.searchText)
      if (this.cursor > 0) {
        this.cursor -= 1
      }
    },

    keyDown () {
      this.$emit('key-down', this.searchText)
      if (this.cursor < this.items.length - 1) {
        this.cursor += 1
      }
    },

    keyEnter () {
      if (this.showList && this.items[this.cursor]) {
        this.selectItem(this.items[this.cursor])
        this.showList = false
      }
      this.$emit('enter', this.items[this.cursor])
    }
  }
}
</script>

<style scoped lang="scss">
.vue-suggestion {
  position: relative;

  .loading {
    position: absolute;
  }
  .list-item {
    cursor: pointer;
    background-color: white;
    border-left: 2px solid hsl(0, 0%, 86%);
    border-right: 2px solid hsl(0, 0%, 86%);
    &:last-child {
      border-bottom: 2px solid hsl(0, 0%, 86%);
    }
  }
  .item-active {
    background-color: #f3f6fa;
  }
  .list {
    z-index: 1000;
    max-height: 15em;
    overflow: auto;
  }
  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.3s;
    overflow: hidden;
  }
  .expand-enter,
  .expand-leave-to {
    max-height: 0;
    opacity: 0;
  }
}
</style>
