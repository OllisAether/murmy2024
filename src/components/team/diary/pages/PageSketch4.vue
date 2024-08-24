<template>
  <Page>
    <template #text>
      <Strike behind :thickness="30" color="#ac5aff34">
        Wieder BOCK auf Zeichnen!!
      </Strike>
      
      <div class="text">
        Kein Bock mehr auf Zeichnen...
      </div>
    </template>

    <img :src="game.getAsset('diary/Sketch5.webp')?.content">
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

  top: 20%;
  left: 10%;
  width: 35%;

  opacity: 0.9;
}

.text {
  position: absolute;
  top: 12rem;
  right: 12%;
  width: 40%;
}
</style>