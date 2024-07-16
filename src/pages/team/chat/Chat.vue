<template>
  <VThemeProvider theme="light">
    <VLayout class="chat-room" v-if="chat">
      <VToolbar
        color="white"
        class="chat-room__toolbar px-2"
        border="b"
      >
        <VBtn :rounded="true" class="pa-1" height="auto" @click="router.push({ name: 'chat', params: { space: 'phone' } })">
          <VIcon size="24" class="mr-2">mdi-arrow-left</VIcon>

          <VAvatar
            color="grey-lighten-2"
            size="38"
          >
            <VIcon size="24" color="white">mdi-account</VIcon>
          </VAvatar>
        </VBtn>
        <VToolbarTitle class="chat-page__title ml-2" >
          {{ game.getChatName(chat) }}
        </VToolbarTitle>
        <VBtn icon disabled>
          <VIcon>mdi-phone</VIcon>
        </VBtn>
        <VBtn icon disabled>
          <VIcon>mdi-video</VIcon>
        </VBtn>
      </VToolbar>

      <VMain class="chat-room__content">
        <div>
          <template
            v-for="(message, i) in chat.messages"
            :key="i"
          >
            <div v-if="message.date.join('') !== chat.messages[i - 1]?.date.join('')" class="text-center my-4">
              <VChip>
                {{ getDate(message.date) }}
              </VChip>
            </div>
            
            <VRow
              :justify="message.sender === game.currentChatUser ? 'end' : 'start'"
              class="ma-4"
            >
              <VCard
                :color="message.sender === game.currentChatUser ? 'green-darken-1' : 'grey-lighten-2'"
                class="chat-room__message"
                flat
              >
                <span class="chat-room__message__content">
                  {{ message.content }}
                </span>
                <span class="chat-room__message__time">
                  {{ getTime(message.time) }}
                </span>
              </VCard>
            </VRow>
          </template>
        </div>

        <VToolbar
          color="white"
          class="chat-room__chatbar"
          border="t"
        >
          <div class="chat-room__chatbar__input text-grey-darken-1 mr-4">
            Nachricht schreiben
          </div>
          <VIcon size="24" class="text-grey">mdi-send</VIcon>
        </VToolbar>
      </VMain>
    </VLayout>
  </VThemeProvider>
</template>

<script setup lang="ts">
import router from '@/router';
import { useGameManager } from '@/store/gameManager';
import { computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const game = useGameManager();

const chat = computed(() => game.getChat(route.params.chat as string));

onBeforeMount(() => {
  if (!chat.value?.id || (chat.value?.id && !game.hasPermissionForChat(chat.value.id))) {
    router.push({ name: 'chat' });
  }
});

function getDate(date: [number, number]) {
  return `${date[0]}. ${[
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
  ][date[1]]}`;
}

function getTime (time: [number, number]) {
  return `${time[0]}:${time[1]}`;
}
</script>

<style scoped lang="scss">
@use '@/scss/vars' as *;

.chat-room {
  height: 100%;
  font-family: $fontPhoneText, sans-serif;
  position: relative;

  &__toolbar {
    z-index: 1;
    position: absolute;
    top: 0;
    padding-top: 4rem;
  }

  &__chatbar {
    z-index: 1;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 0 1.5rem 1rem;

    &__input {
      border-radius: 1.5rem;
      background: #eee;
      color: black;
      padding: .5rem 1rem;
      font-size: 1rem;
      width: 100%;
    }
  }

  &__content {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-flow: column-reverse nowrap;

    > div {
      padding-top: 8rem;
      padding-bottom: 5rem;
    }
  }

  &__message {
    border-radius: .75rem;
    max-width: 80%;
    padding: .3rem 1rem .4rem;
    line-height: 1.25;

    &__content {
      font-size: 1rem;
    }

    &__time {
      float: right;
      font-size: 0.8rem;
      padding: .5rem .4rem 0;
      opacity: 0.7;
    }
  }
}
</style>