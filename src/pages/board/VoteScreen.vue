<template>
  <ScreenWrapper>
    <div :class="['vote-screen', {
      'vote-screen--next-tiebreaker': nextTiebreaker && !game.phase.meta?.private,
      'vote-screen--private': game.phase.meta?.private
    }]">
      <div class="vote-screen__views-text">
        Viewsrunde
      </div>
      <div class="vote-screen__elite-text">
        ELITE
      </div>

      <!-- <pre>{{ game.vote.session }}</pre> -->

      <div class="vote-screen__timer">
        <VFadeTransition>
          <Timer v-if="!nextTiebreaker && !showWinner && game.timer.state !== 'stopped'" />
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
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { VoteOption } from '../../../shared/vote';
import { useAudio } from '@/store/board/audio';

const game = useGameManager()

const showWinner = computed(() => {
  if (game.phase.meta?.private) {
    return null
  }

  if (isRandom.value) {
    return game.candidates.find(c => c.id === game.vote.session?.winner) ?? null
  }

  return isTiebreaker.value
    ? game.vote.session?.tiebreakerResults?.finalWinner ?? null
    : game.vote.session?.voteResults?.finalWinner ?? null
})

const isTiebreaker = computed(() => {
  return game.vote.session?.isTiebreaker && !game.phase.meta?.private
})
const nextTiebreaker = computed(() => {
  return game.vote.session?.voteResults?.next === 'tiebreaker' && !isTiebreaker.value && !game.phase.meta?.private
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

const audio = useAudio()

const audioVote = new Audio(game.getAsset('sounds/vote/vote.mp3')?.content ?? '')
const audioVoteEnd = new Audio(game.getAsset('sounds/vote/vote_end.mp3')?.content ?? '')
const audioVoteTiebreaker = new Audio(game.getAsset('sounds/vote/vote_tiebreaker.mp3')?.content ?? '')

watch(nextTiebreaker, (value) => {
  if (value) {
    if (31 - audioVote.currentTime > 0.5) {
      audioVoteTiebreaker.play()
      audioVoteEnd.play()
      audio.fade(audioVote, 500)

      setTimeout(() => {
        game.triggerBoardSkip()
      }, 4000)
    } else {
      setTimeout(() => {
        audioVoteTiebreaker.play()
        
        setTimeout(() => {
          game.triggerBoardSkip()
        }, 4000)
      }, (31 - audioVote.currentTime) * 1000)
    }
  }
}, { immediate: true })

watch(showWinner, (value) => {
  if (value) {
    if (audioVoteTiebreaker.currentTime > 0) {
      if (14 - audioVoteTiebreaker.currentTime > 0.5) {
        audioVoteEnd.play()
        audio.fade(audioVoteTiebreaker, 500)
      }
    } else if (31 - audioVote.currentTime > 0.5) {
      audioVoteEnd.play()
      audio.fade(audioVote, 500)
    }

    setTimeout(() => {
      game.triggerBoardSkip()
    }, 5000)
  }
}, { immediate: true })

onMounted(() => {
  audio.controlVolume(audioVote, 'vote')
  audio.controlVolume(audioVoteEnd, 'vote')
  audio.controlVolume(audioVoteTiebreaker, 'vote')

  if (!showWinner.value && !nextTiebreaker.value && game.timer.state === 'stopped') {
    const off = watch(() => game.timer.state, (value) => {
      if (value === 'running') {
        console.log('asd')
        audioVote.play()
        off()
      }
    })
    game.triggerBoardSkip()
  } else if (game.timer.state !== 'stopped') {
    const offset = (game.timer.startTime ?? Date.now()) + game.timeSync.diff - Date.now() - 800

    if (offset > 0) {
      setTimeout(() => {
        console.log('asd')
        audioVote.play()
      }, offset)
    } else {
      audioVote.currentTime = -offset / 1000
      console.log('asd')
      audioVote.play()
    }
  }
})

onUnmounted(() => {
  if (audioVote.currentTime < 30) {
    audio.fade(audioVote, 1000)
  }
  
  if (audioVoteTiebreaker.currentTime < 14) {
    audio.fade(audioVoteTiebreaker, 1000)
  }

  audio.offControlVolume(audioVote)
  audio.offControlVolume(audioVoteEnd)
  audio.offControlVolume(audioVoteTiebreaker)
})

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
@use 'sass:math';

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
    font-size: 16vh;

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