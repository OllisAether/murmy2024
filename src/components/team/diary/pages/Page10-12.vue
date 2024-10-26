<template>
  <Page>
    <template #date>
      10.12.2012
    </template>

    <template #text>
      <br>
      <br>

      <Collectable entry-id="diary-dvd">
        Die Filme verkaufen sich eigentlich ganz gut, wer hätte gedacht dass die leute hier mehr an meinen selbstgebrannten DVDs interessiert sind als in Hansenberg?
      </Collectable>
      <br>
      Ok, tlw sind die Menschen auch komisch. Diese eine schwarzhaarige verfolgt mich ständig.
      <br>
      <br>
      Ich hoffe ich bild mir das nur ein
    </template>
  </Page>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import Page from '../Page.vue';
</script>
