<template>
  <Page>
    <template #date>
      02.01.2013
    </template>
    <template #text>
      <br>
      Ok, jetzt wird's <i>creepy</i>.
      <br>
      <Collectable entry-id="diary-wohnung" inline>
        Sie hat mir Bilder von meiner Wohnung geschickt.
      </Collectable>
      <br>
      Ich glaub, ich muss ausziehen. Da vermisst man glatt Justins gehirnlose „Beleidigungen“.
    </template>
  </Page>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import Page from '../Page.vue';
</script>
