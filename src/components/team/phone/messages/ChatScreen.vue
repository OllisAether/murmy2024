<template>
  <div class="chat-screen">
    <div class="chat-screen__title">
      <div class="chat-screen__avatar">
        <img
          v-if="computedChat.avatar"
          :src="computedChat.avatar"
        />
        <VIcon v-else>{{
          chat.type === 'group'
            ? 'mdi-account-multiple'
            : 'mdi-account'
        }}</VIcon>
      </div>
      <div class="chat-screen__name-participants">
        <div class="chat-screen__name">
          {{ computedChat.type === 'group' ? computedChat.name : (computedChat.contact?.name ?? computedChat.number) }}
        </div>
        <div class="chat-screen__participants">
          {{ computedChat.type === 'group' ? computedChat.participants.join(', ') : computedChat.contact?.number }}
        </div>
      </div>
    </div>

    <ScrollView class="chat-screen__content" bottom>
      <template
        v-for="(message, i) in computedChat.messages"
        :key="i"
      >
        <div
          v-if="message.type === 'message' || message.type === 'image'"
          :class="['chat-screen__message', {
            'chat-screen__message--me': message.rawSender === 'me'
          }]"
        >
          <div
            class="chat-screen__message__sender"
            v-if="
              computedChat.type === 'group' &&
              message.rawSender !== 'me' &&
              (computedChat.messages[i - 1]?.type === 'message'
                ? (computedChat.messages[i - 1] as any).rawSender !== message.rawSender
                : true)
            "
          >
            {{ message.sender }}
          </div>
          <div class="chat-screen__message__content">
            <div v-if="message.type === 'message'" class="chat-screen__message__text">
              <TextContentRenderer :textContent="message.content" />
            </div>
            <div v-else class="chat-screen__message__image">
              <img :src="game.getAsset(message.imageAssetId)?.content">
              <Collectable
                disappear
                class="chat-screen__message__image-entry"
                v-for="(entry, i) in message.entries"
                :key="i"
                :entry="entry.entry"
                :style="{
                  top: `${entry.rect.x * 100}%`,
                  left: `${entry.rect.y * 100}%`,
                  width: `${entry.rect.width * 100}%`,
                  height: `${entry.rect.height * 100}%`
                }"
              />
            </div>
          </div>
        </div>
        <div v-if="message.type === 'timestamp'" class="chat-screen__timestamp">
          <span></span>
          <span>
            {{ message.timestamp.format('DD. MMM, YYYY, HH:mm') }}
          </span>
          <span></span>
        </div>
      </template>
    </ScrollView>

    <div class="chat-screen__input">
      <div class="chat-screen__input__field">
        <VIcon>mdi-image-outline</VIcon>
        <VIcon>mdi-emoticon-outline</VIcon>
        Nachricht schreiben...
      </div>
      <div class="chat-screen__input__send">
        <VIcon>mdi-send</VIcon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { contacts } from '../../../../../shared/assets/phone/contacts';
import ScrollView from '../ScrollView.vue';
import { useMainClue } from '@/store/team/mainClue';
import { chats } from '../../../../../shared/assets/phone/chats';
import { computed } from 'vue';
import Collectable from '../../Collectable.vue';
import { GroupChat, PrivateChat } from '../../../../../shared/phone/chat';
import TextContentRenderer from '../../TextContentRenderer.vue';

const game = useGameManager();
const phone = useMainClue();

const chatIndex = computed(() => +phone.currentPath[phone.currentPath.length - 1]);
const chat = computed(() => chats[chatIndex.value]);

const computedChat = computed(() => {
  const messages = chat.value.messages.map((message) => {
    if (message.type === 'message' || message.type === 'image') {
      return {
        ...message,
        rawSender: message.sender,
        senderAvatar: game.getAsset(contacts.find((c) => c.number === message.sender)?.avatarAssetId)?.content,
        sender: message.sender === 'me' ? 'Du' : contacts.find((c) => c.number === message.sender)?.name ?? message.sender
      };
    } else {
      return message
    }
  });

  if (chat.value.type === 'group') {
    const participants = (chat.value as GroupChat).participants
      .map((p) => contacts.find((c) => c.number === p) ?? { number: p })

    return {
      ...chat.value,
      messages,
      avatar: game.getAsset((chat.value as GroupChat).iconAssetId)?.content,
      participants: ['Du', ...participants.map((c) => c.name ?? c.number)]
    };
  } else {
    const contact = contacts.find((c) => c.number === (chat.value as PrivateChat).number);

    return {
      ...chat.value,
      messages,
      avatar: game.getAsset(contact?.avatarAssetId)?.content,
      contact
    };
  }
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.chat-screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(#000, #181818);

  &__title {
    display: flex;
    align-items: center;
    padding: 0 10px * $scale;
    height: 30px * $scale;
    font-size: 10px * $scale;
    background: linear-gradient(#555d51, #262826);
    border-bottom: 1px * $scale solid #fff1;
  }

  &__name-participants {
    flex: 1;
    line-height: 1;
    width: 0;
  }

  &__name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__participants {
    width: 100%;
    font-size: 8px * $scale;
    color: #777;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__avatar {
    width: 20px * $scale;
    height: 20px * $scale;
    border-radius: 50%;
    background: #6a6a6a;
    overflow: hidden;
    margin-right: 5px * $scale;

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px * $scale;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__content {
    flex: 1;
  }

  &__input {
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 5px * $scale;
    gap: 5px * $scale;
    border-top: 1px * $scale solid #fff1;

    box-shadow: 0 0 4px * $scale 1px * $scale #000;

    &__field {
      flex: 1;
      display: flex;
      align-items: center;
      color: #777;
      font-size: 10px * $scale;
      gap: 5px * $scale;

      .v-icon {
        font-size: 12px * $scale;
      }
    }

    &__send {
      color: #bbb;
      filter: drop-shadow(0 1px * $scale 2px * $scale #000600);
      mask-image: linear-gradient(#fff6, #fff 49%, #fff8 51%, #fff4);
    }
  }

  &__message {
    padding: 0 5px * $scale;
    margin: 5px * $scale 0;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &--me {
      align-items: flex-end;
    }

    &__avatar {
      width: 20px * $scale;
      height: 20px * $scale;
      border-radius: 50%;
      background: #6a6a6a;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &__content {
      flex: 1;

      background: linear-gradient(#7b7b7b, #000, #181818);
      background-position: -1px * $scale -1px * $scale;
      background-size: calc(100% + 2px * $scale) calc(100% + 2px * $scale);
      border: 1px * $scale solid #fff1;
      border-radius: 5px * $scale;
      line-height: 1.2;
      width: fit-content;
      max-width: 70%;

      box-shadow: 0 2px * $scale 4px * $scale 1px * $scale #000;

      .chat-screen__message--me & {
        background-image: linear-gradient(#7ab566, #0d2a05, rgb(23, 62, 22));
      }
    }

    &__sender {
      font-size: 8px * $scale;
      color: #777;
    }

    &__text {
      padding: 3px * $scale 6px * $scale;
      font-size: 10px * $scale;
    }

    &__image {
      position: relative;
      padding: 5px * $scale;

      img {
        pointer-events: none;
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    &__image-entry {
      position: absolute;
    }
  }

  &__timestamp {
    display: flex;
    align-items: center;

    padding: 5px * $scale;
    font-size: 8px * $scale;
    color: #777;
    text-align: center;

    span:nth-child(1), span:nth-child(3) {
      flex: 1;
      border-top: 1px * $scale solid #fff1;
    }

    span:nth-child(2) {
      width: fit-content;
      padding: 0 5px * $scale;
    }
  }
}
</style>