<template>
  <div class="chats-screen">
    <div class="chats-screen__title">
      <img :src="game.getAsset('phone/icons/Icon_SMS.webp')?.content" />
      Nachrichten
    </div>

    <ScrollView class="chats-screen__content">
      <div class="chats-screen__list">
        <button
          class="chats-screen__list__item"
          v-for="(chat, i) in computedChats"
          :key="i"
          @click="phone.pushPath(i.toString())"
        >
          <div class="chats-screen__list__item__avatar">
            <img
              v-if="chat.avatar"
              :src="chat.avatar"
            />
            <VIcon v-else>{{
              chat.type === 'group'
                ? 'mdi-account-multiple'
                : 'mdi-account'
            }}</VIcon>
          </div>
          <div class="chats-screen__list__item__info">
            <div class="chats-screen__list__item__name">
              {{ chat.type === 'group'
                ? chat.name
                : (chat.contact?.name ?? chat.number) }}
            </div>
            <div v-if="chat.lastMessage" class="chats-screen__list__item__last-message">
              {{
                chat.lastMessage.type === 'info'
                ? null
                : chat.lastMessage.sender === 'me'
                  ? 'Du: '
                  : (chat.lastMessageContact?.name ?? chat.lastMessage.sender) + ': '
              }}
              <template v-if="chat.lastMessage.type === 'image'">
                <VIcon>mdi-image</VIcon>
                Bild
              </template>
              <template v-else>
                {{ getRawText(chat.lastMessage.content) }}
              </template>
            </div>
          </div>
        </button>
      </div>
    </ScrollView>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { contacts } from '../../../../../shared/assets/phone/contacts';
import ScrollView from '../ScrollView.vue';
import { useMainClue } from '@/store/team/mainClue';
import { chats } from '../../../../../shared/assets/phone/chats';
import { getRawText } from '../../../../../shared/textContent';
import { ChatImage, ChatInfo, ChatMessage, ChatTimestamp } from '../../../../../shared/phone/chat';

const game = useGameManager();
const phone = useMainClue();

const computedChats = chats.map((chat) => {
  const lastMessage = chat.messages.filter(m => !((m as ChatTimestamp).timestamp)).pop() as ChatMessage | ChatImage | ChatInfo | undefined;
  const lastMessageContact = lastMessage?.type === 'info'
    ? null
    : (lastMessage?.sender === 'me'
      ? null
      : contacts.find((c) => c.number === lastMessage?.sender));

  if (chat.type === 'group') {
    return {
      ...chat,
      avatar: game.getAsset(chat.iconAssetId)?.content,
      lastMessage,
      lastMessageContact
    };
  } else {
    const contact = contacts.find((c) => c.number === chat.number);

    return {
      ...chat,
      avatar: game.getAsset(contact?.avatarAssetId)?.content,
      contact,
      lastMessage,
      lastMessageContact
    };
  }
});
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.chats-screen {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__title {
    display: flex;
    align-items: center;
    padding: 0 10px * $scale;
    height: 30px * $scale;
    font-size: 12px * $scale;
    background: linear-gradient(#555d51, #262826);
    border-bottom: 1px * $scale solid #fff1;

    img {
      width: 18px * $scale;
      height: 18px * $scale;
      margin-right: 10px * $scale;
      filter: drop-shadow(0 1px * $scale 2px * $scale #000600);
    }
  }

  &__content {
    flex: 1;
    background: linear-gradient(#000, #181818);
  }

  &__list {
    display: flex;
    flex-direction: column;
    padding-bottom: 50%;

    &__item {
      display: flex;
      text-align: left;
      align-items: center;
      padding: 5px * $scale 5px * $scale 5px * $scale 10px * $scale;
      border-bottom: 1px * $scale solid #fff2;
      line-height: 1;

      &__info {
        flex: 1;
        width: 0;
      }

      &__name {
        font-size: 10px * $scale;
      }

      &__last-message {
        font-size: 8px * $scale;
        color: #777;
        padding: 2px * $scale 0;

        white-space: nowrap;
        overflow: hidden;
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
    }
  }
}
</style>