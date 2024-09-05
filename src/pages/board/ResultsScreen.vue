<template>
  <ScreenWrapper class="results-screen">
    <div class="results-screen__elite-text">
      ELITE
    </div>

    <div class="results-screen__table">
      <div class="results-screen__table__row results-screen__table__row--header">
        <div class="results-screen__table__cell">
        </div>
        <div class="results-screen__table__cell">
          Team
        </div>
        <div class="results-screen__table__cell text-right">
          Punkte
        </div>
        <div class="results-screen__table__cell text-right">
          Markierte Hinweise
        </div>
      </div>

      <div
        class="results-screen__table__row"
        v-for="(result, i) in results"
        :key="result.team.id"
      >
        <div class="results-screen__table__cell text-right">
          {{ i + 1 }}.
        </div>

        <div class="results-screen__table__cell">
          {{ result.team.name }}
        </div>

        <div class="results-screen__table__cell text-right">
          {{ result.score }}
        </div>

        <div class="results-screen__table__cell text-right">
          {{ result.entries }}
        </div>
      </div>
    </div>

  </ScreenWrapper>
</template>

<script setup lang="ts">
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import { useGameManager } from '@/store/gameManager';
import { computed } from 'vue';

const game = useGameManager()

const results = computed(() => {
  return game.results.sort((a, b) => {
    if (a.score === b.score) {
      return a.entries - b.entries
    }

    return b.score - a.score
  })
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.results-screen {
  background: $surface;
  display: grid;

  &__elite-text {
    position: absolute;
    bottom: 2vh;
    right: 2vh;
    line-height: 1;
    font-size: 50vh;

    font-family: $fontDisplay;
    font-weight: 300;
    opacity: 0.05;
    mask-image: linear-gradient(black, transparent)
  }

  &__table {
    position: absolute;
    top: 50%;
    left: 50%;

    width: 60vw;
    height: fit-content;
    max-height: 100vh;
    padding: 10vh 0;
    overflow-y: auto;
    
    transform: translate(-50%, -50%);

    &__row {
      display: grid;
      grid-template-columns: 2vw 1fr 10vw 12vw;

      border: 1px solid #fff2;
      background: #393c3fa1;
      border-radius: 1vw;

      -webkit-backdrop-filter: blur(2rem);
      backdrop-filter: blur(2rem);

      padding: .5vw 1vw;
      margin-bottom: .5vw;
      font-size: 1.5vw;

      &--header {
        background: none;
        border: none;

        -webkit-backdrop-filter: none;
        backdrop-filter: none;

        padding: 0 1vw;

        font-weight: 700;
        font-size: 1vw;
      }
    }

    &__cell {
      padding: 0 1vw;
    }
  }
}
</style>