<template>
  <ScreenWrapper>
    <div
      :class="['title', {
        'title--countdown': game.timer.state !== 'stopped',
      }]">
      <span>(</span>
      <span>
        Murder Mystery<br>
        <span class="night">
          Night
        </span>
      </span>
      <span>)</span>
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
  font-size: min(10vh, 5vw);
  text-align: center;
  line-height: 1;

  font-family: $fontDisplay;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.1em;

  .night, &>span:nth-child(1), &>span:nth-child(3) {
    font-size: 2.5em;
  }

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
