<template>
  <VThemeProvider theme="light">
    <VLayout class="chat-room">
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
          Chats
        </VToolbarTitle>
        <VBtn icon>
          <VIcon>mdi-phone</VIcon>
        </VBtn>
        <VBtn icon>
          <VIcon>mdi-video</VIcon>
        </VBtn>
      </VToolbar>

      <VMain class="chat-room__content">
        <div>
          <template
            v-for="(message, i) in messages"
            :key="i"
          >
            <div v-if="message.date" class="text-center my-4">
              <VChip>
                {{ message.date }}
              </VChip>
            </div>
            
            <VRow
              v-else
              :justify="message.sender === 'me' ? 'end' : 'start'"
              class="ma-4"
            >
              <VCard
                :color="message.sender === 'me' ? 'green-darken-1' : 'grey-lighten-2'"
                class="chat-room__message"
                flat
              >
                <span class="chat-room__message__content">
                  {{ message.content }}
                </span>
                <span class="chat-room__message__time">
                  {{ message.time }}
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
import { ref } from 'vue';

const messages = ref([
  { date: '20. Mai' },
  {
    sender: 'me',
    content: 'Hey, how are you?',
    time: '12:00',
    read: 'read'
  },
  {
    sender: 'other',
    content: 'I am fine, thank you!',
    time: '12:01',
    read: 'read'
  },
  {
    sender: 'me',
    content: 'What are you doing?',
    time: '12:02',
    read: 'read'
  },
  {
    sender: 'other',
    content: 'I am working on a new project.',
    time: '12:03',
    read: 'read'
  },
  {
    sender: 'me',
    content: 'That sounds interesting!',
    time: '12:04',
    read: 'read'
  },
  {
    sender: 'other',
    content: 'Yes, it is.',
    time: '12:05',
    read: 'read'
  },
  { date: '21. Mai' },
  {
    sender: 'me',
    content: 'Can you tell me more about it?',
    time: '12:06',
    read: 'read'
  },
  {
    sender: 'other',
    content: 'Sure, I will send you the details later.',
    time: '12:07',
    read: 'read'
  },
  {
    sender: 'me',
    content: 'Thank you!',
    time: '12:08',
    read: 'delivered'
  },
  {
    sender: 'other',
    content: 'You are welcome!',
    time: '12:09',
    read: 'sent'
  },
  {
    sender: 'me',
    content: 'Bye!',
    time: '12:10',
    read: 'sent'
  },
  {
    sender: 'other',
    content: 'Bye!',
    time: '12:11',
    read: 'read'
  },
  { date: '22. Mai' },
  {
    sender: 'me',
    content: 'Hey, how are you?',
    time: '12:00',
    read: 'read'
  },
  {
    sender: 'other',
    content: 'I am fine, thank you!',
    time: '12:01',
    read: 'read'
  },
  {
    sender: 'me',
    content: 'What are you doing?',
    time: '12:02',
    read: 'read'
  },
  {
    sender: 'other',
    content: 'I am working on a new project.',
    time: '12:03',
    read: 'read'
  },
  {
    sender: 'me',
    content: 'That sounds interesting!',
    time: '12:04',
    read: 'read'
  },
  {
    sender: 'other',
    content: 'Yes, it is.',
    time: '12:05',
    read: 'read'
  },
  { date: '23. Mai' },
  {
    sender: 'me',
    content: 'Can you tell me more about it?',
    time: '12:06',
    read: 'read'
  },
  {
    sender: 'other',
    content: 'Sure, I will send you the details later.',
    time: '12:07',
    read: 'read'
  },
  {
    sender: 'me',
    content: 'Thank you!',
    time: '12:08',
    read: 'delivered'
  },
  {
    sender: 'other',
    content: 'You are welcome!',
    time: '12:09',
    read: 'sent'
  },
  {
    sender: 'me',
    content: 'Bye!',
    time: '12:10',
    read: 'sent'
  },
  {
    sender: 'other',
    content: 'Bye!',
    time: '12:11',
    read: 'read'
  }
]);
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