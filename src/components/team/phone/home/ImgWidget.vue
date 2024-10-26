<template>
  <button class="img-widget" @click="phone.openApp('camera', ['gallery', '2'])">
    <Collectable entry-id="phone-burn-it">
      <img :src="game.getAsset('phone/burn-it.webp')?.content">
    </Collectable>
  </button>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import { useGameManager } from '@/store/gameManager';
import { useMainClue } from '@/store/team/mainClue';

const phone = useMainClue();
const game = useGameManager()
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.img-widget {
  display: block;
  height: 100%;
  background: #000a;
  border-radius: 5px * $scale;
  box-shadow: 0 1px * $scale 2px * $scale #000;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>