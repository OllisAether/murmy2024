<template>
  <Page blank class="back-cover-back">
    <img
      :src="game.getAsset('diary/Stiches.webp')?.content"
      class="back-cover-back__image"
    />
  </Page>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import Page from '../Page.vue';

defineProps<{
  pageNumber: number,
}>();

const game = useGameManager()
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.back-cover-back {
  position: relative;
  background:
    linear-gradient(-90deg, #0002, transparent 40%),
    linear-gradient(#212424, #131518);
  box-shadow:
    0 -1rem 1.5em -1rem #476c7e94 inset,
    0 1rem .5rem -1rem #476c7e94 inset,
    0 0 1rem #000 inset;

  transform: scale(1.01);

  border-radius: .5rem 2rem 2rem .5rem !important;

  &__sticky {
    position: absolute;
    top: 40%;
    left: 45%;
    transform: translate(-50%, -50%)rotate(-5deg);
  }

  &__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>