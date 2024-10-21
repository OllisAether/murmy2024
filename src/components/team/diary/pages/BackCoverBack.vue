<template>
  <Page blank class="back-cover-back">
    <img
      :src="game.getAsset('diary/Stiches.webp')?.content"
      class="back-cover-back__image"
    />

    <Collectable
      :entry-id="'phineas-kindheitsfoto'"
      class="back-cover-back__polaroid"
    >
      <img :src="game.getAsset('Kindheitsfoto.webp')?.content" />
    </Collectable>
    <div class="back-cover-back__tape"></div>
  </Page>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import Page from '../Page.vue';
import Collectable from '@/components/Collectable.vue';

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
  transform-origin: left center;

  border-radius: .5rem 2rem 2rem .5rem !important;

  &__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__tape {
    position: absolute;
    top: 18rem;
    left: 22rem;
    transform: rotate(1deg);
    width: 15rem;
    height: 5rem;
    
    background: linear-gradient(#fff9, #fff2);
    box-shadow: 0 0 1rem #0003;
  }

  &__polaroid {
    position: absolute;
    top: 20rem;
    left: 8rem;
    transform: rotate(3deg);
    width: 40rem;

    img {
      display: block;
      width: 100%;
      box-shadow: 0 3rem 2rem #0003;
    }
  }
}
</style>