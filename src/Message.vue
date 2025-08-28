<template>
  <div
    :id="message.id"
    :class="{
      'sc-message': true,
      'sc-message--received': message.author !== 'me' && message.type !== 'system',
      'sc-message--send': message.author === 'me'
    }"
  >
    <div
      class="sc-message--content"
      :class="{
        send: message.author === 'me',
        received: message.author !== 'me' && message.type !== 'system',
        system: message.type === 'system'
      }"
    >
      <TextMessage
        v-if="message.type === 'text'"
        :message="message"
        :message-colors="messageColors"
        :message-styling="messageStyling"
        :isFullscreen="isFullscreen"
        @remove="$emit('remove')"
      >
        <template v-slot:default="scopedProps">
          <slot
            name="text-message-body"
            :message="scopedProps.message"
            :messageText="scopedProps.messageText"
            :messageColors="scopedProps.messageColors"
            :me="scopedProps.me"
          >
          </slot>
        </template>
      </TextMessage>
    </div>
  </div>
</template>

<script>
import TextMessage from './messages/TextMessage.vue'
import SystemMessage from './messages/SystemMessage.vue'
import chatIcon from './assets/chat-icon.svg'

export default {
  components: {
    TextMessage,
    SystemMessage
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    messageStyling: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    isFullscreen: {
      type: Boolean
    }
  },
  computed: {
    authorName() {
      return this.user && this.user.name
    },
    chatImageUrl() {
      return (this.user && this.user.imageUrl) || chatIcon
    },
    messageColors() {
      return this.message.author === 'me' ? this.sendColorsStyle : this.receivedColorsStyle
    },
    receivedColorsStyle() {
      return {
        color: this.colors.receivedMessage.text,
        backgroundColor: this.colors.receivedMessage.bg
      }
    },
    sendColorsStyle() {
      return {
        color: this.colors.sentMessage.text,
        backgroundColor: this.colors.sentMessage.bg
      }
    }
  }
}
</script>

<style lang="scss">
/* TODO: re-org and scope this style block */

.sc-message {
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  .sc-message--edited {
    opacity: 0.7;
    word-wrap: normal;
    font-size: xx-small;
    text-align: center;
  }
}

.sc-message--received {
  justify-content: left;
}

.sc-message--send {
  justify-content: flex-end;
}

.sc-message--content {
  width: 100%;
  display: flex;
}

.sc-message--content.received {
  .sc-message--text :not([class]) {
    all: revert;
    display: revert;
  }
  .sc-message--text :not([class]) {
    h3 {
      margin: 8px 0;
    }
    p {
      margin: 6px 0;
    }
  }
}

.sc-message--content.send {
  max-width: 75%;
  justify-content: flex-end;
}

.sc-message--content.system {
  justify-content: center;
}

.sc-message--content.send .sc-message--avatar {
  display: none;
}

.sc-message--avatar {
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
  align-self: center;
  margin-right: 15px;
}

.sc-message--meta {
  font-size: xx-small;
  margin-bottom: 0px;
  color: white;
  text-align: center;
}

.tooltip {
  display: block !important;
  z-index: 10000;
  .tooltip-inner {
    background: black;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }
  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
  }
  &[x-placement^='top'] {
    margin-bottom: 5px;
    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  &[x-placement^='bottom'] {
    margin-top: 5px;
    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  &[x-placement^='right'] {
    margin-left: 5px;
    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }
  &[x-placement^='left'] {
    margin-right: 5px;
    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }
  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }
  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
  &.info {
    $color: rgba(#004499, 0.9);
    .tooltip-inner {
      background: $color;
      color: white;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }
    .tooltip-arrow {
      border-color: $color;
    }
  }
  &.popover {
    $color: #f9f9f9;
    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }
    .popover-arrow {
      border-color: $color;
    }
  }
}
</style>
