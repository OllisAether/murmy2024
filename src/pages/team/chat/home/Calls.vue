<template>
  <VList class="pa-0">
    <template
      v-for="call in calls"
      :key="call.name"
    >
      <VListItem @click="" class="py-4">
        <template #prepend>
          <VAvatar color="grey-lighten-2">
            <VIcon size="24" color="white">mdi-account</VIcon>
          </VAvatar>
        </template>

        <VListItemTitle>
          <b>
            {{ call.contactId }}
          </b>
        </VListItemTitle>
        <VListItemSubtitle opacity="1" class="text-grey-darken-1">
          <template v-if="call.status === 'missed'">
            <VIcon color="red" style="rotate: -45deg;">mdi-arrow-up-left</VIcon> Verpasst
          </template>
          <template v-else-if="call.status === 'answered'">
            <VIcon color="green">mdi-arrow-bottom-left</VIcon> Angenommen
          </template>
          <template v-else-if="call.status === 'rejected'">
            <VIcon color="red">mdi-arrow-bottom-left</VIcon> Abgelehnt
          </template>
          <template v-else-if="call.status === 'out-answered'">
            <VIcon color="green">mdi-arrow-top-right</VIcon> Angenommen
          </template>
          <template v-else-if="call.status === 'out-rejected'">
            <VIcon color="red">mdi-arrow-top-right</VIcon> Abgelehnt
          </template>

          - {{ call.datetime }}
        </VListItemSubtitle>

        <template #append>
          <template v-if="call.type === 'audio'">
            <VIcon>mdi-phone-outline</VIcon>
          </template>
          <template v-else-if="call.type === 'video'">
            <VIcon>mdi-video-outline</VIcon>
          </template>
        </template>
      </VListItem>
    </template>
  </VList>
</template>

<script setup lang="ts">
import { Call } from '@/model/chat/call';
import { ref } from 'vue';

const calls = ref<Call[]>([
]);
</script>