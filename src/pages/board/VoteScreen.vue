<template>
  <ScreenWrapper>
    <div :class="['vote-screen', {
      'vote-screen--next-tiebreaker': nextTiebreaker && !game.phase.meta?.private,
      'vote-screen--private': game.phase.meta?.private
    }]">
      <div class="vote-screen__elite-text">
        ELITE
      </div>

      <!-- <pre>{{ game.vote.session }}</pre> -->

      <div class="vote-screen__timer">
        <VFadeTransition>
          <Timer v-if="!nextTiebreaker && !showWinner" />
        </VFadeTransition>
      </div>

      <template v-if="!game.phase.meta?.private">
        <div class="vote-screen__candidates">
          <TransitionGroup name="vote-screen__candidate">
            <div
              v-for="(candidate, i) in candidates"
              :key="candidate.id"
              :class="['vote-screen__candidate', {
                'vote-screen__candidate--has-image': candidate.image
              }]"
              :style="{
                animationDelay: `${i * 0.1 + 0.3}s`
              }"
            >
              <SkewBox
                :img="candidate.image && game.getAsset(candidate.image)?.content"
                :img-height-scale="0.75"
                :progress-scale="0.75"

                :rounded-corners="10"
                :shadow-stroke-width="6"
                :stroke-width="6"
                :displace-distance="12"
                :padding="15"

                :progress="showWinner
                  ? (showWinner.id === candidate.id ? 1 : 0)
                  : (nextTiebreaker ? 1 : candidate.votes.length / (game.vote.session!.totalPossibleVotes ?? 1))
                "
                :progress-color="candidate.color ?? '#ffffff'"
              />

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
      </template>
    </div>
  </ScreenWrapper>
</template>

<script setup lang="ts">
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import SkewBox from '@/components/SkewBox.vue';
import Timer from '@/components/Timer.vue';
import { useGameManager } from '@/store/gameManager';
import { computed, watch } from 'vue';
import { VoteOption } from '../../../shared/vote';

const game = useGameManager()

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

watch(showWinner, (value) => {
  if (value) {
    setTimeout(() => {
      game.triggerBoardSkip()
    }, 3000)
  }
}, { immediate: true })

watch(nextTiebreaker, (value) => {
  if (value) {
    setTimeout(() => {
      game.triggerBoardSkip()
    }, 3000)
  }
}, { immediate: true })

// watch(isRandom, (value) => {
//   if (value) {
//     setTimeout(() => {
//       game.triggerBoardSkip()
//     }, 3000)
//   }
// }, { immediate: true })
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

  &__timer {
    position: absolute;
    font-size: 10vw;
    font-weight: 300;
    top: 2vh;
    left: 50%;

    transform: translateX(-50%);

    .vote-screen--private & {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 15vw;
    }
  }

  &__candidates {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;

    padding: 15vw 10vw;
    display: flex;
    justify-content: center;
    gap: 3vw;

    transition:
      filter 1s cubic-bezier(0.19, 1, 0.22, 1),
      transform 1s cubic-bezier(0.19, 1, 0.22, 1);

    .vote-screen--next-tiebreaker & {
      transform: translate(-50%, -50%)scale(0.8);
      filter: brightness(0.4)saturate(0.3);
    }

    animation: enter 1s cubic-bezier(0.19, 1, 0.22, 1) backwards;

    @keyframes enter {
      from {
        transform: translateY(10vw);
        opacity: 0;
      }
    }
  }

  &__candidate {
    z-index: 1;
    position: relative;
    width: 35vh;

    & > :deep(.skew-box) {
      aspect-ratio: 5 / 9;
    }

    &__title {
      position: absolute;
      line-height: 1;
      font-family: $fontHeading;
      top: 100%;
      width: 100%;
      transform: translateX(-10%);
      // text-align: center;
      padding: 2vw 0;
      font-size: 2vw;
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