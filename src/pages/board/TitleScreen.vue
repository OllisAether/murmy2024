<template>
  <ScreenWrapper>
    <div
      :class="['title', {
        'title--countdown': game.timer.state !== 'stopped',
      }]">
        <span>Murder</span>
        <span>Mystery</span>
        <span>Night</span>
    </div>

    <Transition name="countdown">
      <div class="countdown" v-if="game.timer.state !== 'stopped'">
        <Timer />
      </div>
    </Transition>
  </ScreenWrapper>
</template>

<script setup lang="ts">
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import Timer from '@/components/Timer.vue';
import { useGameManager } from '@/store/gameManager';

const game = useGameManager()

</script>

<style lang="scss" scoped>
@use '../../scss/vars' as *;

.title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  white-space: nowrap;
  font-size: 9vw;
  text-align: center;
  line-height: 1;
  font-family: $fontDisplay;
  mask-image: linear-gradient(black, #0004);

  display: flex;
  flex-direction: column;
  align-items: center;

  transition: 1.5s cubic-bezier(0.19, 1, 0.22, 1);

  &--countdown {
    top: 0;
    transform: translate(-50%, 20%) scale(0.8);
  }
}

.countdown {
  font-family: $fontDisplay;
  position: absolute;
  top: 40%;
  left: 50%;
  font-size: min(30vh, 50vw);
  transform: translate(-50%, 0);

  &-enter-active, &-leave-active {
    transition: 1.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &-enter-from, &-leave-to {
    opacity: 0;
    transform: translate(-50%, 50%)scale(0.6);
  }
}
</style>
