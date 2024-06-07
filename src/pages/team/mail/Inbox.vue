<template>
  <VList>
    <template
      v-for="mail in mails"
      :key="mail.from"
    >
      <VListItem class="py-4">
        <template #prepend>
          <VAvatar color="grey-lighten-2">
            <VIcon size="24" color="white">mdi-email</VIcon>
          </VAvatar>
        </template>

        <VListItemTitle>
          <b>
            {{ mail.from }}
          </b>
        </VListItemTitle>
        <VListItemSubtitle>
          {{ mail.subject }}
        </VListItemSubtitle>
      </VListItem>
    </template>
  </VList>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const mails = ref([
  {
    from: 'John Doe',
    subject: 'Hello',
    date: '2021-10-01',
    content: 'Hello, how are you?',
  },
  {
    from: 'Jane Doe',
    subject: 'Re: Hello',
    date: '2021-10-02',
    content: 'I am fine, thank you!',
  },
]);
</script>