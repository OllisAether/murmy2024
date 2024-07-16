<template>
  <VThemeProvider theme="light" >
    <VLayout class="chat-page">
      <VToolbar color="white" class="chat-page__toolbar">
        <VToolbarTitle class="chat-title" style="font-size: 2rem;">
          <b>Chats</b>
        </VToolbarTitle>
      </VToolbar>

      
      <VMain class="chat-page__content">
        <VChipGroup class="px-4" v-model="category">
          <VChip value="all" color="green-darken-1">Alle</VChip>
          <VChip value="unread" color="green-darken-1">Ungelesen</VChip>
          <VChip value="groups" color="green-darken-1">Gruppen</VChip>
        </VChipGroup>

        <VList class="pa-0">
          <template
            v-for="chat in chats"
            :key="chat.name"
          >
            <VListItem @click="" class="py-4">
              <template #prepend>
                <VAvatar color="grey-lighten-2">
                  <VIcon size="24" color="white">mdi-account</VIcon>
                </VAvatar>
              </template>

              <VListItemTitle>
                {{ chat.name }}
              </VListItemTitle>
              <VListItemSubtitle>
                {{ chat.lastMessage }}
              </VListItemSubtitle>
            </VListItem>
          </template>
        </VList>
      </VMain>

      <VBottomNavigation
        :height="16 * 6"
        bg-color="grey-lighten-4"
        class="chat-page__bottom-nav pb-5"
        grow
        elevation="0"
        border="t"
      >
        <VBtn color="green-darken-1" variant="plain" :to="{
          name: 'chats'
        }">
          <VIcon size="24">mdi-chat</VIcon>
          Chats
        </VBtn>

        <VBtn color="green-darken-1" variant="plain">
          <VIcon size="24">mdi-phone</VIcon>
          Anrufe
        </VBtn>

        <VBtn color="green-darken-1" variant="plain">
          <VAvatar size="24" color="grey-darken-4">
            <VIcon size="16" color="white">mdi-account</VIcon>
          </VAvatar>
          Du
        </VBtn>
      </VBottomNavigation>
    </VLayout>
  </VThemeProvider>
</template>

<style lang="scss" scoped>
.chat-page {
  height: 100%;
  color: black;
  font-family: 'SF Pro Text', sans-serif;

  &__icon {
    vertical-align: -.1em;
  }

  &__toolbar {
    z-index: 1;
    position: absolute;
    top: 0;
    padding-top: 4rem;
  }

  &__content {
    padding: 8rem 0 2rem;
    height: 100%;
    overflow: auto;
  }

  &__bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';

const category = ref<'all' | 'unread' | 'groups'>('all');

const chats = ref([
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
  {
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    unread: 1,
    group: false
  },
]);
</script>