<template>
  <Page blank class="front-cover-back">
    <img
      :src="game.getAsset('diary/Stiches.webp')?.content"
      class="front-cover-back__image"
    />
    <StickyNote class="front-cover-back__sticky" entryId="burn-the-diary">
      Wenn das jemand findet nachdem ich tot bin,
      <Strike behind :thickness="30" color="#ff56dd22">
        VERBRENNT ES!
      </Strike>
    </StickyNote>
  </Page>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import Page from '../Page.vue';
import StickyNote from '../StickyNote.vue';
import Strike from '../Strike.vue';

defineProps<{
  pageNumber: number,
}>();

const game = useGameManager()
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.front-cover-back {
  position: relative;
  background:
    linear-gradient(-90deg, #0002, transparent 40%),
    linear-gradient(#212424, #131518);
  box-shadow:
    0 -1rem 1.5em -1rem #476c7e94 inset,
    0 1rem .5rem -1rem #476c7e94 inset,
    0 0 1rem #000 inset;

  transform: scale(1.01);
  transform-origin: right center;

  border-radius: 2rem .5rem .5rem 2rem !important;

  &__sticky {
    position: absolute;
    top: 40%;
    left: 45%;
    transform: translate(-50%, -50%)rotate(-5deg);
  }

  &__image {
    transform: scaleX(-1);
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>