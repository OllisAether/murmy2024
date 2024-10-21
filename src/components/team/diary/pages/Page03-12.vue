<template>
  <Page>
    <template #date>
      03.12.2012
    </template>
    <template #text>
      <br>
      Neue Schule, neues Glück. so wie Phoebe immer sagt, einfach überleben.
      <br>
      Noch zwei Jahre und dann hab ich es hinter mir.

      <br>
      <br>
      <br>
      <br>
      OC Doodles!

      <br>
      <br>
      Keine Ahnung,<br>wie ich sie nennen<br>soll
      <br>
      <br>
      
      - Android<br>
      - Ein Auge hat<br>Telezoom
    </template>

    <img :src="game.getAsset('diary/Sketch8.webp')?.content">
  </Page>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import Page from '../Page.vue';

const game = useGameManager()
</script>

<style lang="scss" scoped>
img {
  position: absolute;
  height: auto;
  opacity: 0.9;
  object-fit: contain;

  top: 27%;
  right: 13%;
  width: 60%;

  opacity: 0.9;
}
</style>