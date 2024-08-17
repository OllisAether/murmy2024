<template>
  <ScreenWrapper>
    <div :class="['vote-screen', {
      'vote-screen--next-tiebreaker': nextTiebreaker,
      'vote-screen--has-voted': game.voted
    }]">
      <span class="vote-screen__elite-text">
        ELITE
      </span>

      <!-- <pre>{{ game.vote.session }}</pre> -->

      <div class="vote-screen__timer">
        <VFadeTransition>
          <Timer v-if="!nextTiebreaker && !showWinner" />
        </VFadeTransition>
      </div>

      <div class="vote-screen__candidates">
        <TransitionGroup name="vote-screen__candidate">
          <div
            v-for="candidate in candidates"
            :key="candidate.id"
            :class="['vote-screen__candidate', {
              'vote-screen__candidate--has-image': candidate.image,
              'vote-screen__candidate--voted': game.voted === candidate.id,
              'vote-screen__candidate--not-voted': game.voted && game.voted !== candidate.id,
              'vote-screen__candidate--placeImageOverBox': candidate.placeImageOverBox
            }]"
            :style="{
              '--candidate-color-rgb': Color(candidate.color).rgb().array().slice(0, 3).join(', ')
            }"
            @click="vote(candidate.id)"
          >
            <SkewBox
              :img="candidate.image && !candidate.placeImageOverBox && game.getAsset(candidate.image)?.content"
              :img-height-scale="0.75"
              :progress-scale="0.75"

              :rounded-corners="10"
              :shadow-stroke-width="6"
              :stroke-width="6"
              :displace-distance="12"
              :padding="15"

              :progress="showWinner
                ? (showWinner.id === candidate.id ? 1 : 0)
                : (nextTiebreaker
                  ? 1
                  : (game.voted === candidate.id ? 1 : 0))
              "
              :progress-color="candidate.color ?? '#ffffff'"
            />

            <img v-if="candidate.image && candidate.placeImageOverBox" :src="game.getAsset(candidate.image)?.content" class="vote-screen__candidate__image" />

            <div class="vote-screen__candidate__title">
              {{ candidate.title }}
            </div>
          </div>
        </TransitionGroup>
      </div>
      <Transition name="vote-screen__tiebreaker">
        <div
          v-if="nextTiebreaker"
          class="vote-screen__tiebreaker"
        >
          Tiebreaker
        </div>
      </Transition>
    </div>
  </ScreenWrapper>
</template>

<script setup lang="ts">
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import SkewBox from '@/components/SkewBox.vue';
import Timer from '@/components/Timer.vue';
import { useGameManager } from '@/store/gameManager';
import { computed } from 'vue';
import { VoteOption } from '../../../shared/vote';
import Color from 'color';

const game = useGameManager()

function vote (candidateId: string) {
  game.addVote(candidateId)
}

const showWinner = computed(() => {
  if (isRandom.value) {
    return game.candidates.find(c => c.id === game.vote.session?.winner) ?? null
  }

  return isTiebreaker.value
    ? game.vote.session?.tiebreakerResults?.finalWinner ?? null
    : game.vote.session?.voteResults?.finalWinner ?? null
})

const isTiebreaker = computed(() => {
  return game.vote.session?.isTiebreaker
})
const nextTiebreaker = computed(() => {
  return game.vote.session?.voteResults?.next === 'tiebreaker' && !isTiebreaker.value
})

const candidates = computed(() => {
  if (showWinner.value) {
    return [{
      ...showWinner.value,
      votes: []
    }]
  }

  return (nextTiebreaker.value || isTiebreaker.value)
    ? (game.vote.session?.tiebreakerCandidates?.map(id => ({
      ...game.candidates.find(c => c.id === id),
      votes: game.vote.session?.tiebreakerResults?.votes[id] ?? []
    })).filter(c => c) ?? []) as (VoteOption & { votes: string[] })[]
    : game.candidates
})

const isRandom = computed(() => {
  return game.vote.session?.isRandom
})
</script>

<style lang="scss" scoped>
@use 'sass:math';
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

  &__timer {
    position: absolute;
    font-size: 10vh;
    font-weight: 300;
    top: 2vh;
    left: 50%;

    transform: translateX(-50%);
  }

  &__candidates {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;

    padding: 15vh 20vh;
    display: flex;
    justify-content: space-around;

    transition:
      filter 1s cubic-bezier(0.19, 1, 0.22, 1),
      transform 1s cubic-bezier(0.19, 1, 0.22, 1);

    .vote-screen--next-tiebreaker & {
      transform: translate(-50%, -50%)scale(0.8);
      filter: brightness(0.4)saturate(0.3);
    }

    .vote-screen--has-voted & {
      transform: translate(-50%, -50%)scale(0.8);
    }
  }

  &__candidate {
    z-index: 1;
    position: relative;
    width: 28vh;

    transition:
      transform 1s cubic-bezier(0.19, 1, 0.22, 1),
      filter 1s cubic-bezier(0.19, 1, 0.22, 1);

    & > :deep(.skew-box) {
      aspect-ratio: 5 / 9;
    }

    &--voted {
      transform: scale(math.div(1, 0.8));
      z-index: 2;
      filter: drop-shadow(0 0 5vh rgba(var(--candidate-color-rgb), 0.3));
    }

    &--not-voted {
      filter: saturate(0);
      opacity: 0.5;
    }

    &--placeImageOverBox {
      & > :deep(.skew-box) {
        aspect-ratio: 5 / (9 * .75);
      }
    }

    &__image {
      position: absolute;
      top: 0;
      left: 0;
      width: 90%;
      height: 90%;
      object-fit: contain;
      z-index: 1;
      filter: drop-shadow(0 0 3vh #000);
    }

    &__title {
      position: absolute;
      top: 100%;
      width: 100%;
      transform: translateX(-12%);
      text-align: center;
      padding: 3vh;
      font-size: 2.5vh;
    }

    &-enter-active, &-leave-active {
      z-index: 0;
      transition:
        margin 1s cubic-bezier(0.19, 1, 0.22, 1),
        opacity 1s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &-enter-from, &-leave-to {
      margin-left: -20vh;
      margin-right: -20vh;
      opacity: 0;
    }
  }

  &__tiebreaker {
    z-index: 2;
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 10vh;

    font-family: $fontDisplay;

    will-change: transform, opacity, filter;

    &-enter-active {
      transition: 1s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &-enter-from {
      transform: translate(-50%, -50%)scale(.5)translateY(50vh);
      opacity: 0;
    }

    &-leave-active {
      transition: 1s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &-leave-to {
      transform: translate(-50%, -50%)scale(2);
      filter: blur(1vh);
      opacity: 0;
    }
  }
}
</style>