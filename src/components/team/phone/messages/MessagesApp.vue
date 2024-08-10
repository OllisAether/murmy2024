<template>
  <div class="messages-app">
    <VFadeTransition>
      <ChatsScreen v-if="phone.isPath()" />
    </VFadeTransition>
    <VSlideYReverseTransition>
      <ChatScreen v-if="phone.isPathLoose() && !phone.isPath()" />
    </VSlideYReverseTransition>
  </div>
</template>

<script setup lang="ts">
import { useMainClue } from '@/store/team/mainClue';
import ChatsScreen from './ChatsScreen.vue';
import ChatScreen from './ChatScreen.vue';

const phone = useMainClue()
</script>

<style lang="scss" scoped>
.messages-app {
  background: black;
}
</style>