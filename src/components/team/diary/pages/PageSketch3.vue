<template>
  <Page>
    <template #date>
      10.12.2012
    </template>
    <template #text>
      Zeit was zu zeichnen!
    </template>
    <img :src="game.getAsset('diary/Sketch4.webp')?.content">
  </Page>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import Page from '../Page.vue';

const game = useGameManager()
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

img {
  position: absolute;
  height: auto;
  opacity: 0.9;
  object-fit: contain;

  top: 10%;
  left: 10%;
  width: 80%;

  opacity: 0.9;
}
</style>