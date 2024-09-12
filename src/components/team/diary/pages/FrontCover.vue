<template>
  <Page :class="['front-cover', {
    'front-cover--locked': diary.locked,
  }]" blank>
    <img
      :src="game.getAsset('diary/FrontCover.webp')?.content"
      class="front-cover__image"
    />
    <img
      :src="game.getAsset('diary/Stiches.webp')?.content"
      class="front-cover__image"
    />

    <div class="front-cover__name-label">
      Tagebuch von:
    </div>

    <PinLock class="front-cover__pin-lock" />
  </Page>
</template>

<script setup lang="ts">
import { useMainClue } from '@/store/team/mainClue';
import { useGameManager } from '@/store/gameManager';
import Page from '../Page.vue';
import PinLock from '../PinLock.vue'

const game = useGameManager();
const diary = useMainClue()
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.front-cover {
  position: relative;
  background: linear-gradient(#212424, #131518);
  box-shadow:
    0 -1rem 1.5em -1rem #476c7e94 inset,
    0 1rem .5rem -1rem #476c7e94 inset,
    0 0 1rem #000 inset,
  ;

  transform: scale(1.01);

  border-radius: .5rem 2rem 2rem .5rem !important;

  &--locked {
    transform-style: preserve-3d;

    &::after {
      content: '';
      position: absolute;
      top: 1rem;
      left: calc(100% - 1rem);
      bottom: 1rem;
      width: calc(4rem - 2px);
      transform-origin: 0 0;
      transform: rotateY(90deg)translateX(1px);
      background:
        linear-gradient(transparent calc(50% - 3.5rem), rgb(44, 46, 47) calc(50% - 3.5rem), rgb(23, 24, 25) calc(50% + 3.5rem), transparent calc(50% + 3.5rem)) 0 0 / 100% 100%,
        linear-gradient(90deg, #EDE0CF, #797063, #EDE0CF) 0 0 / 3px 100%;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;

      background: black;
      border-radius: 2rem;
      transform: translateZ(-4rem);
    }
  }

  &__pin-lock {
    position: absolute;
    top: 50%;
    right: 5rem;
    transform: translateY(-50%);
  }

  &__image {
    pointer-events: none;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__name-label {
    position: absolute;
    top: 14.3rem;
    left: 18.7rem;
    width: 21.2rem;
    height: 3.3rem;
    border-bottom: 2px solid #a98c71;
    font-size: 1rem;
    color: #a98c71;
    font-family: $fontDiarySmall;
  }
}
</style>