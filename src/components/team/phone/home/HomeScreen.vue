<template>
  <div :class="['home-screen', {
    'home-screen--menu-open': phone.isPath('menu'),
  }]">
    <img
      :src="game.getAsset('dokumente/autopsiebericht.png')?.content"
      class="home-screen__background"
    >

    <div class="home-screen__content">
      <VBtn
        class="home-screen__button"
        @click="phone.locked = true"
      >
        <span>Lock</span>
      </VBtn>

      Apps
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { usePhone } from '@/store/team/phone';

const phone = usePhone();
const game = useGameManager();
</script>

<style lang="scss" scoped>
.home-screen {
  &__background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__content {
    position: absolute;
    inset: 0;
  }
}
</style>