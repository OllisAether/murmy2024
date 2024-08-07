<template>
  <Page :pageNumber="pageNumber">
    <template #date>
      01.01.2021
    </template>
    <template #text>
      Hier ist der Text für die Seite

      <Strike>Dieser Text sist durchgestrichen</Strike>
      <Strike :height="85">Dieser Text ist unterstrichen</Strike>
      <br>
      <br>
      <br>
      <br>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, id reprehenderit blanditiis ex magnam voluptatem quo at, numquam perspiciatis laborum maxime, reiciendis in quod harum saepe. Expedita cum nemo dignissimos.
    </template>
  </Page>
</template>

<script setup lang="ts">
import Page from '../Page.vue';
import Strike from '../Strike.vue';

defineProps<{
  pageNumber: number,
}>();
</script>