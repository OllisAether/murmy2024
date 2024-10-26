<template>
  <Page>
    <template #date>
      29.12.2012
    </template>
    <template #text>
      <Collectable entry-id="diary-phoebe-reden">
        Es kommt immer was dazwischen und ich konnte noch nicht richtig mit Phoebe reden.
      </Collectable>
      <br>
      Jetzt in den Ferien dachte ich, dass ich die Zeit hätte, aber Phoebe ist die ganzen Ferien bei ihrer Schülerakademie.
      <br>
      <br>
      Verdammte Streberin. Vermeidet sie mich?
    </template>
  </Page>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import Page from '../Page.vue';
</script>
