<template>
  <div
    class="sc-chat-window"
    :class="{'opened': isOpen, 'closed': !isOpen, 'sc-chat-window-no-fixed': noFixed}"
    :style="`width: ${width}px; height: ${height || 'calc(100% - 260px)'}`"
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
      @close="$emit('close')"
      @userList="handleUserListToggle"
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
      showUserList: false
    }
  },
  computed: {
    messages() {
      let messages = this.messageList

      return messages
    }
  },
  methods: {
    handleUserListToggle(showUserList) {
      this.showUserList = showUserList
    },
    getSuggestions() {
      return this.messages.length > 0 ? this.messages[this.messages.length - 1].suggestions : []
    }
  }
}
</script>

<style scoped>
.sc-chat-window {
  /* height: calc(100% - 120px); */
  /* max-height: 680px; */
  position: fixed;
  right: 0px;
  bottom: 0px;
  box-sizing: border-box;
  box-shadow: 0px 4px 8px 2px rgba(120, 124, 165, 0.5);
  background: #faf8f8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  animation: fadeIn;
  animation-duration: 0.3s;
  animation-timing-function: ease-in-out;
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
  bottom: 0px;
  right: -400px;
}

@keyframes fadeIn {
  0% {
    display: none;
    right: -400px;
  }

  100% {
    display: flex;
    right: 0px;
  }
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

@media (max-width: 450px) {
  .sc-chat-window {
    width: 100%;
    height: 100%;
    max-height: 100%;
    right: 0px;
    bottom: 0px;
    border-radius: 0px;
  }
  .sc-chat-window {
    transition: 0.1s ease-in-out;
  }
  .sc-chat-window.closed {
    bottom: 0px;
  }
}
</style>
