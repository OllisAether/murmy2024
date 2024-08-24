<template>
  <Page>
    <template #text>
      <Strike behind :thickness="30" color="#fff06daa">
        OC Sketches
      </Strike>
    </template>

    <img :src="game.getAsset('diary/Sketch8.webp')?.content">
  </Page>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import Page from '../Page.vue';
import Strike from '../Strike.vue';

const game = useGameManager()
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

img {
  position: absolute;
  height: auto;
  opacity: 0.9;
  object-fit: contain;

  top: 5%;
  left: 15%;
  width: 70%;

  opacity: 0.9;
}
</style>