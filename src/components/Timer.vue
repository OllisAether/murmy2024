<template>
  <span :class="['timer', {
    'timer--paused': game.timer.state === 'paused',
    'timer--warning': warning && remaining <= warningThreshold,
    'timer--fixed-width': fixedWidth
  }]">
    <span class="timer__minutes">
      <span :class="['timer__digit', {
        'timer__digit--change': change[0]
      }]">{{ delayedTimeString[0][0] }}</span>
      <span :class="['timer__digit', {
        'timer__digit--change': change[1]
      }]">{{ delayedTimeString[0][1] }}</span>
    </span>
    <span class="timer__separator">:</span>
    <span class="timer__seconds">
      <span :class="['timer__digit', {
        'timer__digit--change': change[2]
      }]">{{ delayedTimeString[1][0] }}</span>
      <span :class="['timer__digit', {
        'timer__digit--change': change[3]
      }]">{{ delayedTimeString[1][1] }}</span>
    </span>
    <span class="timer__pause-indicator" v-if="game.timer.state === 'paused'">
      PAUSIERT
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameManager } from '@/store/gameManager'

withDefaults(defineProps<{
  fixedWidth?: boolean
  warning?: boolean
  warningThreshold?: number
}>(), {
  fixedWidth: false,
  warning: false,
  warningThreshold: 10
})

const game = useGameManager()

const remaining = computed(() => (game.timer.duration - game.timer.currentTime) / 1000)
const timeString = computed(() => {
  if (game.timer.state === 'stopped') return ['00', '00']

  const minutes = Math.floor(remaining.value / 60);
  const seconds = Math.floor(remaining.value % 60);

  return [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ]
})

const delayedTimeString = ref(timeString.value)

watch(timeString, (val) => {
  setTimeout(() => delayedTimeString.value = val, changeBackDelay / 2)
})

const change = ref([
  false, false, false, false
])
const changeBackDelay = 500
watch(timeString, (val, old) => {
  if (val[0][0] !== old[0][0]) {
    change.value[0] = true
    setTimeout(() => change.value[0] = false, changeBackDelay)
  }
  if (val[0][1] !== old[0][1]) {
    change.value[1] = true
    setTimeout(() => change.value[1] = false, changeBackDelay)
  }
  if (val[1][0] !== old[1][0]) {
    change.value[2] = true
    setTimeout(() => change.value[2] = false, changeBackDelay)
  }
  if (val[1][1] !== old[1][1]) {
    change.value[3] = true
    setTimeout(() => change.value[3] = false, changeBackDelay)
  }
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.timer {
  white-space: nowrap;
  font-family: $fontDisplay;
  text-align: center;
  position: relative;

  &--paused > :not(.timer__pause-indicator) {
    animation: pausedBlink 2s infinite;

    @keyframes pausedBlink {
      0%, 100% {
        opacity: .4;
      }
      50% {
        opacity: .1;
      }
    }
  }

  &__pause-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 0.5em;
    font-weight: bold;
    transform: translate(-50%, -50%);
  }

  &__minutes,
  &__seconds {
    display: inline-block;
    line-height: 1;

    .timer--fixed-width & {
      width: 1.5em;
    }
    clip-path: inset(0);
  }

  &__digit {
    display: inline-block;
    width: .9em;

    &--change {
      animation: changeDigit (.5s) infinite;

      @keyframes changeDigit {
        0% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0.95, 0.05, 0.795, 0.035);
        }
        50% {
          transform: translateY(-1em);
        }
        50.0000001% {
          transform: translateY(1em);
          animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }
        100% {
          transform: translateY(0);
        }
      }
    }
  }
}
</style>