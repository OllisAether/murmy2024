<template>
  <ScreenWrapper class="title-screen">
    <VFadeTransition>
      <img src="@/assets/background.png" class="title-screen__background" v-if="!isShowNewClues">
    </VFadeTransition>

    <div
      v-if="!isShowNewClues"
      :class="['title-screen__title', {
        'title-screen__title--countdown': game.timer.state !== 'stopped',
      }]">
        <div class="title-screen__title__bottom">
          <span>Murder</span>
          <span>Mystery</span>
          <span>Night</span>
        </div>
        <div class="title-screen__title__top">
          <span>Murder</span>
          <span>Mystery</span>
          <span>Night</span>
        </div>
    </div>

    <template v-if="isShowNewClues">
      <div class="title-screen__new-clues-title">
        Neue Clues Verfügbar
      </div>
      <div class="title-screen__new-clues">

        <div
          v-for="(clue, i) in newClues"
          class="title-screen__new-clues__clue"
          :style="{
            animationDelay: `${i * 0.2 + 0.4}s`
          }"
        >
          <SkewBox
            class="title-screen__new-clues__clue__box"
            color="#5a636988"
          />

          <VIcon class="title-screen__new-clues__clue__icon">mdi-lock</VIcon>
          <div class="title-screen__new-clues__clue__title">
            {{ clue?.title }}
          </div>
          <NewBadge class="title-screen__new-clues__clue__new" />
        </div>
      </div>
    </template>

    <Transition name="title-screen__countdown">
      <div :class="['title-screen__countdown title-screen__countdown--blur', {
        'title-screen__countdown--break': isBreak,
      }]" v-if="game.timer.state !== 'stopped' && !isShowNewClues">
        <div class="title-screen__countdown__next" v-if="game.phase.meta.next">
          <template v-if="game.phase.meta.next === 'vote'">
            Nächste Viewsrunde beginnt in
          </template>
        </div>
        <Timer />
        <div v-if="isBreak" class="title-screen__break">
          Päuschen!
        </div>
      </div>
    </Transition>
    <Transition name="title-screen__countdown">
      <div :class="['title-screen__countdown', {
        'title-screen__countdown--break': isBreak,
      }]" v-if="game.timer.state !== 'stopped' && !isShowNewClues">
        <div class="title-screen__countdown__next" v-if="game.phase.meta.next">
          <template v-if="game.phase.meta.next === 'vote'">
            Nächste Viewsrunde beginnt in
          </template>
        </div>
        <Timer />
        <div v-if="isBreak" class="title-screen__break">
          Päuschen!
        </div>
      </div>
    </Transition>

    <VFadeTransition>
      <img src="@/assets/background_overlay.png" class="title-screen__background-overlay" v-if="!isShowNewClues">
    </VFadeTransition>
  </ScreenWrapper>
</template>

<script setup lang="ts">
import NewBadge from '@/components/NewBadge.vue';
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import Timer from '@/components/Timer.vue';
import { useGameManager } from '@/store/gameManager';
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { clues } from '../../shared/assets/clues/index';
import SkewBox from '@/components/SkewBox.vue';
import { useAudio } from '@/store/board/audio';
import { useMounted } from '@vueuse/core';

const game = useGameManager()

const isShowNewClues = computed(() => {
  return game.phase.meta.showNewClues ?? false
})

const isBreak = computed(() => {
  return game.phase.meta.break ?? false
})

const newClues = computed(() => {
  return game.clues.new.map(clue => clues.find(c => c.id === clue))
})

const playMusic = computed(() => {
  return true
  // return !isBreak.value && !isEnd.value && !isInfo.value
})

const audio = useAudio()

onMounted(() => {

  const stop2 = watch(() => game.interacted, () => {
    if (game.interacted && playMusic.value) {
      audio.startBackgroundMusic()
    }
  })

  const stop = watch(playMusic, () => {
    setTimeout(() => {
      if (!useMounted()) return

      if (playMusic.value) {
        audio.startBackgroundMusic()
      } else {
        audio.stopBackgroundMusic()
      }
    })
  }, { immediate: true })

  onBeforeUnmount(() => {
    stop()
    stop2()
    audio.stopBackgroundMusic()
  })
})
</script>

<style lang="scss" scoped>
@use '../../scss/vars' as *;

.title-screen {
  background: $surface;
  display: grid;

  &__background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.75;
  }

  &__background-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.2;
    mix-blend-mode: overlay;
  }

  &__title {
    grid-column: 1;
    grid-row: 1;
    place-self: center;

    white-space: nowrap;
    font-size: 12vw;
    text-align: center;
    line-height: .86;
    font-family: $fontDisplayCursive;
    display: grid;

    @keyframes appear1 {
      0% {
        transform: translate(5vw);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
      }
    }
    @keyframes appear2 {
      0% {
        transform: translate(-5vw);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
      }
    }

    span:nth-child(1) {
      font-size: 1.1em;

      animation: appear1 1s cubic-bezier(0.19, 1, 0.22, 1) both;
    }

    span:nth-child(2) {
      animation: appear2 2s .1s cubic-bezier(0.19, 1, 0.22, 1) both;
    }

    span:nth-child(3) {
      font-size: 1.5em;

      animation: appear1 3s .2s cubic-bezier(0.19, 1, 0.22, 1) both;
    }

    &--countdown .title-screen__title__top, &--countdown .title-screen__title__bottom {
      // transform: translateY(-50vh)scale(0.8)translateY(60%);
      transform: translateY(-1%)scale(1.4285714286);
      filter: blur(1vw);
      opacity: 0;
    }

    &__top, &__bottom {
      grid-column: 1;
      grid-row: 1;

      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translateY(-1%);

      will-change: transform, opacity, filter;
      transition:
        opacity 1.5s cubic-bezier(0.19, 1, 0.22, 1),
        transform 1.5s cubic-bezier(0.19, 1, 0.22, 1),
        filter 1.5s cubic-bezier(0.19, 1, 0.22, 1),
      ;
    }
    
    &__top {
      color: #c5b9c6;
      mix-blend-mode: overlay;
    }

    &__bottom {
      color: #8596a4;
      filter: blur(.5vw);
      mix-blend-mode: color-dodge;
      transform: translateY(-1%);
    }
  }
  
  &__break {
    font-size: 15vw;
    margin-top: 4vw;
    font-family: $fontDisplayCursive;
  }

  &__countdown {
    // background: $surface;

    position: absolute;
    top: 50%;
    left: 50%;
    line-height: 1;
    transform: translate(-50%, -50%);
    width: fit-content;
    // padding: 1vw 2vw;
    text-align: center;
    font-size: 15vw;
    // border-radius: 2vw;
    // border: .2vw solid $stroke;

    mix-blend-mode: overlay;
    color: #c5b9c6;

    &--break {
      font-size: 12vw;
    }

    &-enter-active, &-leave-active {
      transition: 1.5s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &-enter-from, &-leave-to {
      opacity: 0;
      transform: translate(-50%, -50%)scale(0.7);
      filter: blur(1vw);
    }

    &--blur {
      color: #8596a4;
      filter: blur(1vw);
      mix-blend-mode: color-dodge;

      .title-screen__countdown__next {
        color: #8596a4;
      }
    }

    &__next {
      font-size: 2vw;
      color: white;
    }
  }

  &__new-clues {
    display: flex;
    flex-wrap: wrap;
    // gap: 3vw;
    padding: 0 10vw;
    justify-content: center;
    align-items: start;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);

    &__clue {
      flex: 0 0 calc(60vw / 4);
      width: calc(60vw / 4);
      margin: 0 2vw;
      position: relative;
      animation: newClueappear 4s cubic-bezier(0.215, 0.610, 0.355, 1) both;

      @keyframes newClueappear {
        0% {
          transform: translateY(5vw);
          opacity: 0;
        }
        12% {
          transform: translateY(-1vw)scale(1.1);
          opacity: 1;
          animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
          filter:
            drop-shadow(0 0 1rem #fff8)
            drop-shadow(-.5rem 0 3rem rgba($neon3, 0.4))
            drop-shadow(.5rem 0 3rem rgba($neon4, 0.4))
          ;
        }
        30% {
          transform: translateY(0);
        }
        100% {
          filter: none;
        }
      }

      &__icon {
        font-size: 4vw;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &__new {
        position: absolute;
        top: -1rem;
        right: -3rem;
        font-size: 1.5vw;
      }

      &__title {
        font-family: $fontHeading;
        position: absolute;
        top: 100%;
        transform: translateY(1vw);
        font-size: 1.4vw;
      }

      &__box {
        aspect-ratio: 4 / 5;
        border-radius: 1rem;
        z-index: -1;
      }
    }
  }

  &__new-clues-title {
    position: absolute;
    top: 10vh;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 3vw;
    font-family: $fontDisplay;

    animation: titleAppear 2s cubic-bezier(0.19, 1, 0.22, 1) both;

    @keyframes titleAppear {
      0% {
        transform: translateY(5vw);
        opacity: 0;
      }
      15% {
        opacity: 1;
        animation-timing-function: cubic-bezier(0.77, 0, 0.175, 1);
        text-shadow:
          0 0 .5rem #fff,
          -.5rem 0 1rem rgba($neon3, 0.4),
          .5rem 0 1rem rgba($neon4, 0.4),
        ;
      }
      30% {
        filter: none;
      }
      100% {
        transform: translateY(0);
      }
    }
  }
}
</style>
