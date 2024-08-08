<template>
  <Page :class="['back-cover', {
    'back-cover--locked': useMainClue().locked,
  }]" blank>
  </Page>
</template>

<script setup lang="ts">
import Page from '../Page.vue';
import { useMainClue } from '@/store/team/mainClue';
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

  border-radius: 2rem .5rem .5rem 2rem;

  .diary__page-wrapper--odd & {
    border-radius: .5rem 2rem 2rem .5rem;
  }
  
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

}
</style>