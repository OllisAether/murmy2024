<template>
  <ScreenWrapper class="show-new-clues-screen">
    <div class="show-new-clues-screen__elite-text">Elite</div>

    <div class="show-new-clues-screen__title">
      Neue Clues Verfügbar
    </div>
    <div class="show-new-clues-screen__new-clues">

      <div
        v-for="(clue, i) in newClues"
        class="show-new-clues-screen__new-clues__clue"
        :style="{
          animationDelay: `${i * 0.25 + 0.4}s`
        }"
      >
        <SkewBox
          class="show-new-clues-screen__new-clues__clue__box"
          color="#5a636988"
        />

        <VIcon class="show-new-clues-screen__new-clues__clue__icon">mdi-lock</VIcon>
        <div class="show-new-clues-screen__new-clues__clue__title">
          {{ clue?.title }}
        </div>
        <NewBadge class="show-new-clues-screen__new-clues__clue__new" />
      </div>
    </div>
  </ScreenWrapper>
</template>

<script setup lang="ts">
import NewBadge from '@/components/NewBadge.vue';
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import { useGameManager } from '@/store/gameManager';
import { computed, onMounted } from 'vue';
import { clues } from '../../../shared/assets/clues/index';
import SkewBox from '@/components/SkewBox.vue';
import { useAudio } from '@/store/board/audio';

const game = useGameManager()
const audio = useAudio()

const newClues = computed(() => {
  return game.clues.new.map(clue => clues.find(c => c.id === clue))
})

onMounted(async () => {
  const sounds = newClues.value.map((_, i) => {
    const sound = new Audio(game.getAsset(`sounds/new_clue_${Math.min(i + 1, 4)}.mp3`)?.content)
  
    audio.controlVolume(sound, 'vote')
    return sound
  })

  await new Promise(resolve => setTimeout(resolve, 400))
  for (const sound of sounds) {
    
    sound.play()
    await new Promise(resolve => setTimeout(resolve, 250))
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss/vars' as *;
.show-new-clues-screen {
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

  &__title {
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
