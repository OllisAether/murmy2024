<template>
  <VList>
    <template
      v-for="mail in game.visibleEmails"
      :key="mail.id"
    >
      <VListItem class="py-4">
        <template #prepend>
          <VAvatar color="grey-lighten-2">
            <VIcon size="24" color="white">mdi-email</VIcon>
          </VAvatar>
        </template>

        <VListItemTitle>
          <b>
            {{ mail.id }}
          </b>
        </VListItemTitle>
        <VListItemSubtitle>
          {{ mail.subject }}
        </VListItemSubtitle>
      </VListItem>
    </template>

    <VBtn
      class="mt-4"
      block
      color="primary"
      @click="game.logoutEmail"
    >
      Logout
    </VBtn>
  </VList>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';

const game = useGameManager();
</script>