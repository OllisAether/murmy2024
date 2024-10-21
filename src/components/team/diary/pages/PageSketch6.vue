<template>
  <Page>
    <template #text>
      <Strike behind :thickness="30" color="#fff06daa">
        Banana!
      </Strike>

      <br>
      <br>
      Irgendwie war der spontane Gedanke einer Banane senkrecht im bodensteckend ziemlich lustig.

      <div class="marker-destroyed-it">
        Neeiiiin. Der Marker<br>
        <div style="padding-left: 1rem;">
          hat alles verschmiert.
        </div>
      </div>
    </template>

    <img :src="game.getAsset('diary/Sketch9.webp')?.content">
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

  top: 40%;
  left: 10%;
  width: 80%;

  opacity: 0.9;
  filter: saturate(1.7);
}

.marker-destroyed-it {
  position: absolute;
  top: 33rem;
  left: 58%;
}
</style>