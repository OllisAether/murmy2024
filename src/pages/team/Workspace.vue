<template>
  <VLayout class="workspace">
    <SuspectDatabase class="workspace__sus-db" v-model:open="databaseExpanded" />

    <div class="workspace__main">
      <div class="workspace__indicators">
        <div class="workspace__indicators__left">
          <VExpandXTransition style="transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); transition-duration: .75s;">
            <div class="workspace__timer-wrapper" v-if="!databaseExpanded">
              <Timer class="workspace__timer" />
            </div>
          </VExpandXTransition>
          <span class="workspace__ep">
            <VIcon size="1em">
              mdi-star-four-points-circle
            </VIcon> {{ game.clues.investigationCoins }}
          </span>
        </div>
        <div class="workspace__indicators__center">
          <span class="workspace__teamname">
            {{ auth.team?.name }}
          </span>
        </div>
      </div>

      <BlurGradient class="workspace__blur-gradient" />

      <div class="workspace__scroller">
        <div class="workspace__content">
          <!-- {{ game.clues }} -->
        
          <ClueCard
            v-for="clue in game.clues.available"
            :key="clue"
            :clueId="clue"
          />
        </div>
      </div>
    </div>
  </VLayout>
</template>

<script setup lang="ts">
import BlurGradient from '@/components/BlurGradient.vue';
import ClueCard from '@/components/team/ClueCard.vue';
import SuspectDatabase from '@/components/team/SuspectDatabase.vue';
import Timer from '@/components/Timer.vue';
import { useAuthManager } from '@/store/authManager';
import { useGameManager } from '@/store/gameManager';
import { ref } from 'vue';

const databaseExpanded = ref(true);

const game = useGameManager();
const auth = useAuthManager();
</script>

<style lang="scss" scoped>
@import '@/scss/vars';

.workspace {
  height: 100%;
  display: flex;

  &__sus-db {
    z-index: 99;
  }

  &__main {
    flex: 1;
    position: relative;
    // overflow-y: auto;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(120% 100% at top left, #62FFFF, transparent),
                  radial-gradient(120% 100% at bottom right, #7BB0FFDD, transparent);
      opacity: 0.15;
      z-index: -1;
    }
  }

  &__indicators {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5rem;

    &__left {
      z-index: 2000;
      position: absolute;
      inset: 1.5rem auto 1.5rem 1.5rem;
      display: flex;
      line-height: 2rem;
    }

    &__center {
      z-index: 2;
      position: absolute;
      top: 1.5rem;
      left: 50%;
      bottom: 1.5rem;
      transform: translateX(-50%);
      line-height: 2rem;
    }
  }

  &__blur-gradient {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5rem;
  }

  &__timer {
    margin-right: 1.5rem;
    font-size: 2rem;
  }

  &__ep {
    font-size: 1.5rem;
    font-family: $fontDisplay;
  }

  &__scroller {
    flex: 1;
    overflow-y: auto;
    height: 100%;
  }

  &__content {
    max-width: calc(100vw - 25rem);
    margin: 0 auto;
    padding: 6rem 8rem;
    display: grid;
    gap: 3rem;
    grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    justify-content: center;
  }

  &__teamname {
    font-size: 2rem;
    font-family: $fontDisplay;
    font-weight: 300;
  }
}
</style>
