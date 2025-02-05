<template>
  <ScreenWrapper>
    <div :class="['vote-screen', {
      'vote-screen--next-tiebreaker': nextTiebreaker,
      'vote-screen--has-voted': game.voted,
      'vote-screen--private': isPrivate
    }]">
      <span class="vote-screen__elite-text">
        ELITE
      </span>

      <span class="vote-screen__views-text">
        Viewsrunde
        <HelpBtn>
          <template #header>
            Viewsrunde
          </template>

          <p class="mb-2">
            In Viewsrunden entscheidet ihr, welches Video- oder Audioview ihr sehen wollt.
          </p>
          <p>
            Wählt euren Favoriten aus, indem ihr auf das Bild klickt.
          </p>
        </HelpBtn>
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
            v-for="(candidate, i) in candidates"
            :key="candidate.id"
            :class="['vote-screen__candidate', {
              'vote-screen__candidate--has-image': candidate.image,
              'vote-screen__candidate--voted': game.voted === candidate.id,
              'vote-screen__candidate--not-voted': game.voted && game.voted !== candidate.id,
              'vote-screen__candidate--placeImageOverBox': candidate.placeImageOverBox
            }]"
            :style="{
              '--candidate-color-rgb': Color(candidate.color).rgb().array().slice(0, 3).join(', '),
              animationDelay: `${i * 0.1 + 0.3}s`
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
import { computed, ref, watch } from 'vue';
import { VoteOption } from '../../shared/vote';
import Color from 'color';
import HelpBtn from '@/components/team/HelpBtn.vue';

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

const isPrivate = ref(game.phase.meta?.private)
watch(() => game.phase.meta?.private, (val) => {
  setTimeout(() => {
    isPrivate.value = val
  }, 1000)
})

const isTiebreaker = computed(() => {
  return game.vote.session?.isTiebreaker && !isPrivate.value
})
const nextTiebreaker = computed(() => {
  return game.vote.session?.voteResults?.next === 'tiebreaker' && !isTiebreaker.value && !isPrivate.value
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
  return game.vote.session?.isRandom && !isPrivate.value
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

  &__views-text {
    position: absolute;
    top: 4vh;
    left: 4vh;
    line-height: 1;
    font-size: 3vh;

    font-family: $fontDisplay;
    color: #fff4;
  }

  &__timer {
    position: absolute;
    font-size: 8vw;
    font-weight: 300;
    top: 2vw;
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

    padding: 5vw 10vw;
    display: flex;
    justify-content: center;

    .vote-screen--private & {
      justify-content: space-around;
    }

    transition:
      filter 1s cubic-bezier(0.19, 1, 0.22, 1),
      transform 1s cubic-bezier(0.19, 1, 0.22, 1);

    .vote-screen--next-tiebreaker & {
      transform: translate(-50%, -50%)scale(0.8);
      filter: brightness(0.4)saturate(0.3);
    }

    // .vote-screen--has-voted & {
    //   transform: translate(-50%, -50%)scale(0.8);
    // }
  }

  &__candidate {
    z-index: 1;
    position: relative;
    width: 35vh;

    margin: 0 2vw;

    transition:
      transform 1s cubic-bezier(0.19, 1, 0.22, 1),
      filter 1s cubic-bezier(0.19, 1, 0.22, 1);

    animation: enter 1s cubic-bezier(0.19, 1, 0.22, 1) backwards;

    @keyframes enter {
      from {
        transform: translateY(10vw);
        opacity: 0;
      }
    }

    & > :deep(.skew-box) {
      aspect-ratio: 5 / 9;
    }

    &--voted {
      transform: scale(1.1);
      z-index: 2;
      filter: drop-shadow(0 0 5vw rgba(var(--candidate-color-rgb), 0.3));
    }

    &--not-voted {
      filter: saturate(0);
      opacity: 0.5;
    }

    &--placeImageOverBox {
      & > :deep(.skew-box) {
        aspect-ratio: 5 / 6.75;
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
      filter: drop-shadow(0 0 3vw #000);
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
      margin-left: math.div(-35vh, 2);
      margin-right: math.div(-35vh, 2);
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
      transition: 3s cubic-bezier(0.19, 1, 0.22, 1);
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