<template>
  <Page>
    <template #date>
      18.01.2013
    </template>
    <template #text>
      <br>
      <Collectable entry-id="diary-justin-mobbing">
      Justins Fresse macht mich so aggressiv aber ich muss mich gedulden.
      <br>
      Geduld ist eine Tugend oder was auch immer Phoebe immer gesagt hat.
      <br>
      Wenn ich könnte, würd ich ihn am liebsten in tausend Stücke zerhacken und seiner Familie zu essen geben.
      </Collectable>
      <br>
      <Collectable entry-id="diary-justin-dvd">
        Ich konnte zum Glück eine Konfrontation mit Justin aus dem Weg gehen, indem ich ihm eine Shrek DVD angeboten habe.
      </Collectable>
    </template>
  </Page>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import Page from '../Page.vue';
</script>
