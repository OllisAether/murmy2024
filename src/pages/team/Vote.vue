<template>
  <ScreenWrapper>
    <div class="vote-screen">
      <span class="vote-screen__elite-text">
        ELITE
      </span>

      <div class="vote-screen__candidates">
        <button
          v-for="candidate in game.candidates"
          :key="candidate.id"
          :class="['vote-screen__candidate', {
            'vote-screen__candidate--has-image': candidate.image
          }]"
          @click="vote(candidate.id)"
        >
          <SkewBox
            :img="candidate.image && game.getAsset(candidate.image)?.content"
            :img-height-scale="0.75"
            :progress-scale="0.75"

            :rounded-corners="10"
            :shadow-stroke-width="5"
            :stroke-width="3"
            :displace-distance="10"
            :padding="12"

            :progress="
              game.voted
                ? (game.voted === candidate.id ? 1 : 0)
                : candidate.votes?.length / (game.vote.session?.totalPossibleVotes ?? 1)"
            progress-color="#4F38DE"
          />

          <div class="vote-screen__candidate__title">
            {{ candidate.title }}
          </div>

          <div class="vote-screen__candidate__votes">
            {{ candidate.votes?.length }} / {{ game.vote.session?.totalPossibleVotes }}
          </div>
        </button>
      </div>
    </div>
  </ScreenWrapper>
</template>

<script setup lang="ts">
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import SkewBox from '@/components/SkewBox.vue';
import { useGameManager } from '@/store/gameManager';

const game = useGameManager()

function vote (option: string) {
  game.addVote(option)
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.vote-screen {
  height: 100%;
  background: $surface;

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

  &__candidates {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;

    padding: 20%;
    display: flex;
    gap: 2vh;
  }

  &__candidate {
    flex: 1;
    position: relative;

    & > :deep(.skew-box) {
      aspect-ratio: 5 / 9;
    }

    &__title {
      padding: 1rem;
      font-size: 1.5rem;
    }

    &__votes {
      text-align: center;
      padding: 1rem;
    }
  }
}
</style>