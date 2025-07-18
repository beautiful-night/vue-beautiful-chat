<template>
  <div
    ref="chatbox"
    class="sc-chat-window"
    :class="{'opened': isOpen, 'closed': !isOpen, 'sc-chat-window-no-fixed': noFixed}"
    :style="
      isFullscreen
        ? `width: 100vw; height: 100vh;left: 0; top: 0`
        : `width: ${width}px; height: ${height || 'calc(100% - 260px)'};left: ${left}; top: ${top}`
    "
  >
    <div
      v-if="isOpen && !noFixed"
      class="sc-chat-modal sc-chat-modal-top"
      @click="$emit('close')"
    ></div>
    <div
      v-if="isOpen && !noFixed"
      class="sc-chat-modal sc-chat-modal-left"
      @click="$emit('close')"
    ></div>
    <div
      v-if="isOpen && !noFixed"
      class="sc-chat-modal sc-chat-modal-bottom"
      @click="$emit('close')"
    ></div>
    <Header
      v-if="showHeader"
      :title="title"
      :colors="colors"
      :isFullscreen="isFullscreen"
      @close="$emit('close')"
      @userList="handleUserListToggle"
      @dblclick.native="onDbclickFullscreen"
      @onFullscreen="onDbclickFullscreen"
      @mousedown.native="startDrag"
    >
      <template>
        <slot name="header"></slot>
      </template>
    </Header>
    <MessageList
      v-if="!showUserList"
      :messages="messages"
      :participants="participants"
      :show-typing-indicator="showTypingIndicator"
      :colors="colors"
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :show-header="showHeader"
      :message-styling="messageStyling"
      :loading="loading"
      :isFullscreen="isFullscreen"
      @scrollToTop="$emit('scrollToTop')"
      @remove="$emit('remove', $event)"
    >
      <template v-slot:user-avatar="scopedProps">
        <slot name="user-avatar" :user="scopedProps.user" :message="scopedProps.message"> </slot>
      </template>
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
    </MessageList>
    <UserInput
      v-if="showUserInput"
      :show-emoji="showEmoji"
      :on-submit="onUserInputSubmit"
      :suggestions="getSuggestions()"
      :show-file="showFile"
      :placeholder="placeholder"
      :colors="colors"
      :as-second-chat-box="asSecondChatBox"
      :isFullscreen="isFullscreen"
      @onType="$emit('onType')"
      @edit="$emit('edit', $event)"
    />
  </div>
</template>

<script>
import Header from './Header.vue'
import MessageList from './MessageList.vue'
import UserInput from './UserInput.vue'
import UserList from './UserList.vue'

export default {
  components: {
    Header,
    MessageList,
    UserInput,
    UserList
  },
  props: {
    showEmoji: {
      type: Boolean,
      default: false
    },
    showFile: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    participants: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    onUserInputSubmit: {
      type: Function,
      required: true
    },
    messageList: {
      type: Array,
      default: () => []
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
    placeholder: {
      type: String,
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
    asSecondChatBox: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 370
    },
    noFixed: {
      type: Boolean,
      default: false
    },
    showUserInput: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uniqueId: Math.random().toString(36),
      showUserList: false,
      left: `calc(100vw - ${this.width}px)`,
      top: this.height ? `calc(100vh - ${this.height})` : '260px',
      isFullscreen: false
    }
  },
  computed: {
    messages() {
      let messages = this.messageList
      return messages
    }
  },
  mounted() {
    // 添加全局键盘事件监听器
    document.addEventListener('keydown', this.handleEsc, false)
  },
  beforeDestroy() {
    // 组件销毁时移除监听器，避免内存泄露
    document.removeEventListener('keydown', this.handleEsc, false)
  },
  methods: {
    handleUserListToggle(showUserList) {
      this.showUserList = showUserList
    },
    getSuggestions() {
      return this.messages.length > 0 ? this.messages[this.messages.length - 1].suggestions : []
    },
    handleEsc(e) {
      // Safari on iOS 也支持 e.key === 'Escape'
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        if (this.isFullscreen) {
          this.isFullscreen = false
        } else {
          this.$emit('close')
        }
      }
    },
    onDbclickFullscreen() {
      this.isFullscreen = !this.isFullscreen
    },
    startDrag(e) {
      if (this.isFullscreen) return
      const box = this.$refs.chatbox
      const startX = e.clientX
      const startY = e.clientY
      const startLeft = box.offsetLeft
      const startTop = box.offsetTop

      const move = (e) => {
        const deltaX = e.clientX - startX
        const deltaY = e.clientY - startY
        // box.style.left = `${startLeft + deltaX}px`
        // box.style.top = `${startTop + deltaY}px`
        this.left = startLeft + deltaX + 'px'
        this.top = startTop + deltaY + 'px'
      }

      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }
  }
}
</script>

<style scoped>
.sc-chat-window {
  /* height: calc(100% - 120px); */
  /* max-height: 680px; */
  position: fixed;
  box-sizing: border-box;
  box-shadow: 0px 4px 8px 2px rgba(120, 124, 165, 0.5);
  /* background: #faf8f8; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  z-index: 1000;
}

.sc-chat-window-no-fixed {
  position: relative;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.sc-chat-window.closed {
  display: none;
  left: 100vw;
}

.sc-message--me {
  text-align: right;
}
.sc-message--them {
  text-align: left;
}

.sc-chat-modal {
  position: fixed;
  /* left: 0;
  top: 0;
  width: 100vw;
  height: 100vh; */
  z-index: -1;
}

.sc-chat-modal-top {
  width: 100vw;
  height: 154px;
  top: 0;
  left: 0;
}

.sc-chat-modal-left {
  width: 230px;
  height: 100vh;
  top: 0;
  left: 0;
}
.sc-chat-modal-bottom {
  width: 100vw;
  height: 50px;
  bottom: 0;
  left: 0;
}
</style>
