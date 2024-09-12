<template>
  <Page :class="['back-cover', {
    'back-cover--locked': diary.locked,
  }]" blank>
    <img
      :src="game.getAsset('diary/Stiches.webp')?.content"
      class="back-cover__image"
    />

    <div class="back-cover__strap"></div>
  </Page>
</template>

<script setup lang="ts">
import Page from '../Page.vue';
import { useMainClue } from '@/store/team/mainClue';
import { useGameManager } from '@/store/gameManager';

const game = useGameManager()
const diary = useMainClue()
</script>

<style lang="scss" scoped>
.back-cover {
  background: #151517;
  background: linear-gradient(#212424, #131518);
  box-shadow:
    0 -1rem 1rem -1rem #476c7e94 inset,
    0 1rem 1rem -1rem #476c7e94 inset,
    0 0 1rem #000 inset,
  ;

  transform: scale(1.01)translateZ(4rem);

  border-radius: 2rem .5rem .5rem 2rem !important;
  
  &--locked {
    transform-style: preserve-3d;

    &::after {
      content: '';
      position: absolute;
      top: 1rem;
      left: 1rem;
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

  &__image {
    transform: scaleX(-1);
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__strap {
    position: absolute;
    top: 50%;
    left: -.5rem;
    height: 7rem;
    bottom: -.5rem;
    width: 15rem;
    transform: translateY(-50%);
    
    border-radius: .5rem 2rem 2rem .5rem;
    background: linear-gradient(90deg, #1e181a, #070808);
    box-shadow:
      -3px 0 5px -2px #b8d7ec inset,
      0 0 10px #000,
      0 0 10px #000 inset
    ;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: .3rem;
      bottom: .3rem;
      right: .3rem;

      border: #808080 dashed .1rem;
      border-radius: 0 1.7rem 1.7rem 0;
      border-left: none;
      filter: drop-shadow(-1px -1px 1px #000)drop-shadow(1px 1px 1px #fff3);
    }

    // &::after {
    //   content: '';
    //   position: absolute;
    //   left: -.5rem;
    //   top: -.05rem;
    //   bottom: -.05rem;
    //   width: 5rem;
    //   background: linear-gradient(#919a9b, #353c40);
    //   border-radius: .5rem;
    //   box-shadow: 
    //     0 2px 1px -1px #bdf7e9 inset,
    //     0 -2px 1px -1px #b8d7ec inset,
    //     2px 0 1px -1px #000 inset,
    //     -2px 0 1px -1px #000 inset,
    //     0 0 8px #000,
    //   ;
    // }
  }
}
</style>