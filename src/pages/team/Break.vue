<template>
  <div class="break">
    <div class="break__header">
      Pause
    </div>

    <div class="break__timer">
      <Timer />
    </div>

    <div class="break__text">
      Um {{ moment(resumeTime).format('HH:mm') }} Uhr geht es weiter!
    </div>

    <div class="break__text-small">
      Ihr könnt euch entspannen, auf die Toilette gehen oder etwas zum trinken bei unserem Getränkestand kaufen. Seid pünktlich zurück!
    </div>
  </div>
</template>

<script setup lang="ts">
import Timer from '@/components/Timer.vue';
import { useGameManager } from '@/store/gameManager';
import moment from 'moment';
import { computed } from 'vue';

const game = useGameManager()

const resumeTime = computed(() => {
  const timer = game.timer

  return timer.duration + (timer.startTime ?? Date.now())
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.break {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-55%);
  font-family: $fontPhoneDisplay;
  line-height: 1.2;
  padding: 0 1rem;

  &__timer {
    width: fit-content;
    font-size: min(50vh, 20vw);
    margin: auto;
  }

  &__header {
    font-size: min(10vh, 5vw, 5rem);
    display: block;
    text-align: center;
  }

  &__text {
    font-size: min(10vh, 5vw, 3rem);
    display: block;
    text-align: center;
  }

  &__text-small {
    margin-top: 2em;
    font-size: max(1rem, min(5vh, 2vw, 1.5rem));
    display: block;
    text-align: center;
  }
}
</style>