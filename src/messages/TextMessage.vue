<template>
  <div class="sc-message--text">
    <slot :message="message" :messageText="messageText" :messageColors="messageColors" :me="me">
      <div class="sc-message--text-content" v-html="messageText"></div>
    </slot>
  </div>
</template>

<script>
import {mapState} from '../store/'
import IconBase from './../components/IconBase.vue'
import IconEdit from './../components/icons/IconEdit.vue'
import IconCross from './../components/icons/IconCross.vue'
import escapeGoat from 'escape-goat'
import Autolinker from 'autolinker'
import store from '../store/'

const fmt = require('msgdown')

export default {
  components: {
    IconBase,
    IconCross,
    IconEdit
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    messageText() {
      const escaped = escapeGoat.escape(this.message.data.text)

      return Autolinker.link(this.messageStyling ? fmt(escaped) : escaped, {
        className: 'chatLink',
        truncate: {length: 50, location: 'smart'}
      })
    },
    me() {
      return this.message.author === 'me'
    },
    isEditing() {
      return (store.state.editMessage && store.state.editMessage.id) === this.message.id
    },
    ...mapState(['showDeletion', 'showEdition'])
  },
  methods: {
    edit() {
      store.setState('editMessage', this.message)
    }
  }
}
</script>

<style scoped lang="scss">
.sc-message--text {
  padding: 12px;
  border-radius: 4px;
  font-weight: 300;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  -webkit-font-smoothing: subpixel-antialiased;
  background-color: #f1f6ff;
  .sc-message--text-content {
    white-space: pre-wrap;
    padding: 8px 0;
  }
  &:hover .sc-message--toolbox {
    left: -20px;
    opacity: 1;
  }
  .sc-message--toolbox {
    transition: left 0.2s ease-out 0s;
    white-space: normal;
    opacity: 0;
    position: absolute;
    left: 0px;
    width: 25px;
    top: 0;
    button {
      background: none;
      border: none;
      padding: 0px;
      margin: 0px;
      outline: none;
      width: 100%;
      text-align: center;
      cursor: pointer;
      &:focus {
        outline: none;
      }
    }
    & /deep/ svg {
      margin-left: 5px;
    }
  }
  code {
    font-family: 'Courier New', Courier, monospace !important;
  }
}

.sc-message--content.sent .sc-message--text {
  max-width: calc(100% - 40px);
  word-wrap: break-word;
}

.sc-message--content.received .sc-message--text {
  width: 100%;
  color: #263238;
  background-color: #fff;
  margin-right: 0px;
  border: 1px solid #e9e9e9;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

a.chatLink {
  color: inherit !important;
}
</style>
