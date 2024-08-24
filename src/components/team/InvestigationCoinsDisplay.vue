<template>
  <div class="investigation-coins-display">
    <VIcon size="1em">
      mdi-star-four-points-circle
    </VIcon> {{ investigationCoins }}

    <Transition name="investigation-coins-display__change">
      <div
        v-if="change !== null"
        :class="['investigation-coins-display__change', {
          'investigation-coins-display__change--positive': (change ?? 0) > 0,
          'investigation-coins-display__change--negative': (change ?? 0) < 0
        }]"
      >
        {{ change !== null ? `${change > 0 ? '+' : ''}${change}` : '' }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const game = useGameManager()

const investigationCoins = ref(game.delayedInvestigationCoins)
watch(() => game.delayedInvestigationCoins, () => {
  animateInvestigationCoins(game.delayedInvestigationCoins ?? game.clues.investigationCoins)
})

const change = ref<number | null>(null)
function animateInvestigationCoins (to: number) {
  const from = investigationCoins.value

  change.value = to - from
  setTimeout(() => { change.value = null }, 1000)

  if (from === to) return

  const duration = 1000

  const start = Date.now()
  const end = start + duration

  function step () {
    const now = Date.now()
    const progress = Math.min((now - start) / duration, 1)
    investigationCoins.value = Math.round(from + (to - from) * progress)

    if (now < end) {
      requestAnimationFrame(step)
    }
  }

  step()
}

onMounted(() => {
  game.startInvestigationCoinsDelay()
})

onBeforeUnmount(() => {
  game.stopInvestigationCoinsDelay()
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.investigation-coins-display {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-family: $fontDisplay;

  &__change {
    position: absolute;
    top: 100%;
    left: 2rem;
    line-height: 1rem;
    font-size: 1rem;

    &--positive {
      color: #6aed7f;
    }

    &--negative {
      color: #df507b;
    }

    &-enter-active, &-leave-active {
      transition:
        transform 1s cubic-bezier(0.19, 1, 0.22, 1),
        opacity 1s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &-enter-from {
      transform: translateY(100%);
      opacity: 0;
    }
    &-leave-to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }
}
</style>