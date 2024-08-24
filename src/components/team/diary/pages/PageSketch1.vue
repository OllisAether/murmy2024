<template>
  <Page>
    <template #text>
      <Strike behind :thickness="30" color="#fff06daa">
        Weekly Sketches :p
      </Strike>
  
      <div class="sketch1__text">
        Das ist meine erste Skizze mit der ich zufrieden bin.
        <br>
        <br>
        Werde ich besser?
      </div>
      <div class="sketch2__text">
        Ok... das ist nicht so gut
        <br>
        <br>
        Heißt ich werde weiter üben müssen.
      </div>
    </template>
    
    <img
      class="sketch1"
      :src="game.getAsset('diary/Sketch1.webp')?.content"
    >

    <img
      class="sketch2"
      :src="game.getAsset('diary/Sketch2.webp')?.content"
    >
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
  object-fit: contain;

  opacity: 0.9;
}

.sketch1 {
  left: 5%;
  top: 16%;
  width: 50%;

  &__text {
    position: absolute;
    top: 12rem;
    right: 5%;
    width: 40%;
  }
}

.sketch2 {
  right: 7%;
  bottom: 5%;
  width: 45%;

  &__text {
    position: absolute;
    top: 39rem;
    left: 2rem;
    width: 46%;
  }
}
</style>