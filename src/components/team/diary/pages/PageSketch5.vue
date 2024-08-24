<template>
  <Page>
    <template #text>
      <Strike behind :thickness="30" color="#5cf78533">
        Personen...
      </Strike>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span style="text-align: right; font-size: .6em; font-weight: bold;">
        (ich weiß, ich bin nicht gut darin...)
      </span>
    </template>

    <img class="sketch1" :src="game.getAsset('diary/Sketch6.webp')?.content">
    <img class="sketch2" :src="game.getAsset('diary/Sketch7.webp')?.content">
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

  opacity: 0.9;
}

.sketch1 {
  top: 33%;
  right: 0;
  width: 50%;
}

.sketch2 {
  top: 20%;
  left: 5%;
  width: 50%;
}
</style>