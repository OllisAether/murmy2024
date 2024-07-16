<template>
  <VChipGroup class="px-4" v-model="category" mandatory>
    <VChip value="all" color="green-darken-1"><b>Alle</b></VChip>
    <VChip value="unread" color="green-darken-1"><b>Ungelesen</b></VChip>
    <VChip value="groups" color="green-darken-1"><b>Gruppen</b></VChip>
  </VChipGroup>

  <template v-if="category === 'unread'">
    <!-- No unread chats -->

    <VContainer>
      <VRow justify="center" class="mt-16">
        <VIcon size="64" color="grey-lighten-2">mdi-chat-alert</VIcon>
      </VRow>
      <VRow justify="center" class="mt-4">
        <VCol cols="12" class="text-center">
          <p>
            <b>Keine ungelesenen Chats</b>
          </p>

          <p class="text-grey-darken-1">
            Du bist auf dem neuesten Stand!
          </p>

          <VChip color="green-darken-1" class="mt-8" @click="category = 'all'">
            <b>
              Alle Chats anzeigen
            </b>
          </VChip>
        </VCol>
      </VRow>
    </VContainer>
  </template>

  <VList v-else class="pa-0">
    <template
      v-for="chat in game.visibleChats"
      :key="chat.name"
    >
      <VListItem
        class="py-4"
        :to="{ name: 'chatRoom', params: { chat: chat.id } }"
      >
        <template #prepend>
          <VAvatar color="grey-lighten-2">
            <VIcon size="24" color="white">mdi-account</VIcon>
          </VAvatar>
        </template>

        <VListItemTitle>
          <b>
            {{ game.getChatName(chat as Chat) }}
          </b>
        </VListItemTitle>
        <VListItemSubtitle>
          {{ chat.messages[chat.messages.length - 1].content }}
        </VListItemSubtitle>
      </VListItem>
    </template>
  </VList>
</template>

<script setup lang="ts">
import { Chat } from '@/model/chat/chat';
import { useGameManager } from '@/store/gameManager';
import { ref } from 'vue';

const game = useGameManager();

const category = ref<'all' | 'unread' | 'groups'>('all');
</script>
