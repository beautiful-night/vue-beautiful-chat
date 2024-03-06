<template>
  <div
    ref="scrollList"
    :class="{
      'sc-message-list': true,
      'sc-message-list-no-header': !showHeader,
      'message-list-empty': !(messages.length > 0) && !loading
    }"
    :style="{backgroundColor: colors.messageList.bg}"
    @scroll="handleScroll"
  >
    <Message
      v-for="(message, idx) in messages"
      :key="idx"
      :message="message"
      :user="profile(message.author)"
      :colors="colors"
      :message-styling="messageStyling"
      @remove="$emit('remove', message)"
    >
      <template v-slot:text-message-body="scopedProps">
        <slot
          name="text-message-body"
          :message="scopedProps.message"
          :messageText="scopedProps.messageText"
          :messageColors="scopedProps.messageColors"
          :me="scopedProps.me"
        >
        </slot>
      </template>
      <template v-slot:system-message-body="scopedProps">
        <slot name="system-message-body" :message="scopedProps.message"> </slot>
      </template>
    </Message>
    <div v-if="loading" class="loading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
import Message from './Message.vue'
import chatIcon from './assets/chat-icon.svg'
import {mapState} from './store/'

export default {
  components: {
    Message
  },
  props: {
    participants: {
      type: Array,
      required: true
    },
    messages: {
      type: Array,
      required: true
    },
    showTypingIndicator: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    alwaysScrollToBottom: {
      type: Boolean,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    },
    showHeader: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    defaultChatIcon() {
      return chatIcon
    }
  },
  mounted() {
    this.$nextTick(this._scrollDown())
  },
  updated() {
    if (this.shouldScrollToBottom()) this.$nextTick(this._scrollDown())
  },
  methods: {
    _scrollDown() {
      this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight
    },
    handleScroll(e) {
      if (e.target.scrollTop === 0) {
        this.$emit('scrollToTop')
      }
    },
    shouldScrollToBottom() {
      const scrollTop = this.$refs.scrollList.scrollTop
      const scrollable = scrollTop > this.$refs.scrollList.scrollHeight - 600
      return this.alwaysScrollToBottom || scrollable
    },
    profile(author) {
      const profile = this.participants.find((profile) => profile.id === author)

      // A profile may not be found for system messages or messages by 'me'
      return profile || {imageUrl: '', name: ''}
    }
  }
}
</script>

<style scoped>
.sc-message-list {
  height: 80%;
  overflow-y: auto;
  background-size: 100%;
  padding: 40px 20px;
}
.sc-message-list-no-header {
  height: calc(80% + 40px);
  padding: 12px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.message-list-empty {
  padding: 0 12px;
}

.loading {
  width: 50px;
  height: 16px;
  margin: 0 auto;
}
.loading span {
  display: inline-block;
  width: 6px;
  height: 16px;
  margin-right: 4px;
  border-radius: 4px;
  -webkit-animation: load 0.7s ease infinite;
}
@keyframes load {
  0%,
  100% {
    height: 12px;
    margin-bottom: -2px;
    background: rgb(0, 23, 81);
  }
  50% {
    height: 16px;
    margin-bottom: -4px;
    background: rgb(0, 23, 81);
  }
}
.loading span:nth-child(2) {
  -webkit-animation-delay: 0.14s;
}
.loading span:nth-child(3) {
  -webkit-animation-delay: 0.28s;
}
.loading span:nth-child(4) {
  -webkit-animation-delay: 0.42s;
}
.loading span:nth-child(5) {
  -webkit-animation-delay: 0.56s;
}
</style>
