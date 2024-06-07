<template>
  <AppTabPage
    v-if="account"
    :pages="{
      chats: {
        title: 'Chats',
        component: Chats,
        icon: 'mdi-chat',
      },
      calls: {
        title: 'Anrufe',
        component: Calls,
        icon: 'mdi-phone',
      },
      profile: {
        title: 'Du',
        component: Profile,
        avatar: true,
        noToolbar: true,
      }
    }"
  />
  <!-- Login -->
  <ChatLogin theme="light" v-else />
</template>

<script setup lang="ts">
import AppTabPage from '@/components/game/AppTabPage.vue';
import Chats from './home/Chats.vue';
import Calls from './home/Calls.vue';
import Profile from './home/Profile.vue';
import { useGameManager } from '@/store/gameManager';
import ChatLogin from './ChatLogin.vue';
import { computed } from 'vue';

const game = useGameManager();

const account = computed(() => game.currentChatUser
  ? game.getChatAccount(game.currentChatUser)
  : undefined);
</script>