<template>
  <Page>
    <template #date>
      07.01.2013
    </template>
    <template #text>
      <br>
      <Collectable entry-id="diary-hugo-distanter">
        Ich wollte Montague ansprechen, aber er ist irgendwie distanter als sonst.
      </Collectable>
      <br>
      Der Kerl hat sowieso schon keine Lust auf den Unterricht, aber jetzt ist es irgendwie viel schlimmer.
      <br>
        Er schiebt mir immer so komische Blicke.
      <br>
      <br>
      Wobei, als Phoebe mit ihm reden wollte, ist er auch einfach weggegangen.
    </template>
  </Page>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import Page from '../Page.vue';
</script>
