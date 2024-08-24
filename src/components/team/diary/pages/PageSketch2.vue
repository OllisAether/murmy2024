<template>
  <Page>
    <template #text>
      <Strike behind :thickness="30" color="#65ffff33">
        Weekly Sketches!!?
      </Strike>
    </template>
    
    <img :src="game.getAsset('diary/Sketch3.webp')?.content">
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

  top: 0;
  left: 12.5%;
  width: 75%;

  opacity: 0.9;
}
</style>