<template>
  <span :class="['timer', {
    'timer--paused': game.timer.state === 'paused',
    'timer--warning': warning && remaining <= warningThreshold,
    'timer--fixed-width': fixedWidth
  }]">
    <span class="timer__hours">
      {{ timeString[0] }}
    </span>
    <span class="timer__separator">:</span>
    <span class="timer__minutes">
      {{ timeString[1] }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameManager } from '@/store/gameManager'

withDefaults(defineProps<{
  fixedWidth?: boolean
  warning: boolean
  warningThreshold: number
}>(), {
  fixedWidth: false,
  warning: false,
  warningThreshold: 10
})

const game = useGameManager()

const remaining = computed(() => (game.timer.duration - game.timer.currentTime) / 1000)
const timeString = computed(() => {
  const minutes = Math.floor(remaining.value / 60);
  const seconds = Math.floor(remaining.value % 60);

  return [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ]
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.timer {
  white-space: nowrap;

  &__hours,
  &__minutes {
    display: inline-block;

    .timer--fixed-width & {
      width: 1.5em;
    }
  }

  &__hours {
    text-align: right;
  }

  &__minutes {
    text-align: left;
  }
}
</style>