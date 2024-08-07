<template>
  <Page :class="['front-cover', {
    'front-cover--locked': useDiary().locked,
  }]" blank>
    <PinLock />

    <VBtn @click="useDiary().locked = !useDiary().locked">
      Lock
    </VBtn>
  </Page>
</template>

<script setup lang="ts">
import Page from '../Page.vue';
import PinLock from '../PinLock.vue';
import { useDiary } from '@/store/team/diary';
</script>

<style lang="scss" scoped>
.front-cover {
  position: relative;
  background: #151517;
  box-shadow: 0 0 1rem #94bbff0b inset;

  transform: scale(1.01);
  
  &--locked {
    transform-style: preserve-3d;

    &::after {
      content: '';
      position: absolute;
      top: .5rem;
      left: calc(100% - .5rem);
      bottom: .5rem;
      width: calc(2rem - 2px);
      transform-origin: 0 0;
      transform: rotateY(90deg)translateX(1px);
      background: linear-gradient(90deg, #EDE0CF, #797063, #EDE0CF);
      background-size: 3px 100%;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;

      background: #151517;
      border-radius: .5rem;
      transform: translateZ(-2rem);
    }
  }

}
</style>