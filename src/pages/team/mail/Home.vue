<template>
  <div class="email">
    <AppTabPage
      v-if="account"
      accent="deep-purple-accent-2"
      :pages="{
        inbox: {
          title: 'Posteingang',
          component: Inbox,
          icon: 'mdi-inbox',
        },
      }"
    />

    <!-- Login -->
    <EMailLogin v-else />
  </div>
</template>

<script setup lang="ts">
import AppTabPage from '@/components/game/AppTabPage.vue';
import Inbox from './Inbox.vue';
import EMailLogin from './EMailLogin.vue';
import { useGameManager } from '@/store/gameManager';
import { computed } from 'vue';

const game = useGameManager();

const account = computed(() => game.currentEmailUser
  ? game.getEmailAccount(game.currentEmailUser)
  : undefined);
</script>

<style scoped lang="scss">
.email {
  height: 100%;
  :deep(.app-layout) {
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  }
}
</style>