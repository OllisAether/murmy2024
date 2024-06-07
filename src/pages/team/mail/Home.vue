<template>
  <AppTabPage
    accent="red"
    :pages="{
      inbox: {
        title: 'Posteingang',
        component: Inbox,
        icon: 'mdi-inbox',
      },
    }"
  />
</template>

<script setup lang="ts">
import AppTabPage from '@/components/game/AppTabPage.vue';
import Inbox from './Inbox.vue';
</script>