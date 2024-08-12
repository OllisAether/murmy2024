<template>
  <div :class="['main-clue-card', {
    'main-clue-card--phone': game.clues.mainClueType === 'phone',
    'main-clue-card--diary': game.clues.mainClueType === 'diary',
  }]">
    <button @click="showClue = true" class="main-clue-card__content">
      <SkewBox color="#fff2" :corner-cut="12" class="main-clue-card__content__box" />

      <template v-if="game.clues.mainClueType === 'phone'">
        <img :src="game.getAsset('phone/PhoneThumbnail.webp')?.content">
      </template>
      <template v-else-if="game.clues.mainClueType === 'diary'">
        <img :src="game.getAsset('diary/DiaryThumbnail.webp')?.content">
      </template>

      <div class="main-clue-card__content__text">
        <div class="main-clue-card__content__text__title">
          {{ game.clues.mainClueType === 'phone' ? 'Handy vom Opfer' : 'Tagebuch vom Opfer' }}
        </div>
        <div class="main-clue-card__content__text__description">
          Dieses {{ game.clues.mainClueType === 'phone' ? 'Handy' : 'Tagebuch' }} enthält einen tiefen Einblick in das Leben des Opfers.
        </div>
      </div>
    </button>

    <VOverlay
      v-model="showClue"
      attach="parent"
      :z-index="9"
      absolute
      :close-on-content-click="false"
      :close-on-back="true"
      height="100%"
      width="100%"
      transition="fade-transition"
    >
      <div class="main-clue-card__clue-display">
        <ClueImageViewer :mainClueType="game.clues.mainClueType">
          <template #main-clue-type="{ zoomScale, currentPage, pageTransitionProgress }">
            <Phone
              v-if="game.clues.mainClueType === 'phone'"
              :zoomScale="zoomScale"
            />
            <Diary
              v-else-if="game.clues.mainClueType === 'diary'"
              :zoomScale="zoomScale"
              :currentPage="currentPage"
              :pageTransitionProgress="pageTransitionProgress"
            />
          </template>
        </ClueImageViewer>

        <div class="main-clue-card__clue-display__actions">
          <div class="main-clue-card__clue-display__tooltip">
            <div>
              <VIcon size="1.25rem">mdi-gesture-spread</VIcon>
              <span>
                Zoomen
              </span>
            </div>
            <div>
              <VIcon size="1.25rem">mdi-gesture-tap-hold</VIcon>
              <span>
                Halten, um Hinweis zu markieren
              </span>
            </div>
          </div>
          <Btn
            @click="showClue = false"
            color="#A23946"
          >
            Schließen
            <VIcon size="1em" class="ml-2">mdi-arrow-right</VIcon>
          </Btn>
        </div>
      </div>
    </VOverlay>
  </div>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import ClueImageViewer from './ClueImageViewer.vue';
import { defineAsyncComponent, ref } from 'vue';
import Btn from '../Btn.vue';
import SkewBox from '../SkewBox.vue';

const Phone = defineAsyncComponent(() => import('./phone/Phone.vue'));
const Diary = defineAsyncComponent(() => import('./diary/Diary.vue'));

const game = useGameManager();
const showClue = ref(false);
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.main-clue-card {
  height: 15rem;

  &__content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 1rem 3rem;
    text-align: left;

    display: flex;
    align-items: stretch;
    gap: 2rem;

    img {
      position: relative;
      pointer-events: none;
      width: auto;
      height: 100%;
      filter: drop-shadow(0 0 1rem #0007);

      .main-clue-card--phone & {
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: red;
        }
      }
    }

    &__box {
      position: absolute;
      top: 4rem;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: .5;
      z-index: -1;
    }

    &__text {
      padding-top: 3rem;
    
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      gap: 0.5rem;

      &__title {
        font-size: 2rem;
      }

      &__description {
        color: #fff8;
      }
    }
  }

  &__clue-display {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
    padding-bottom: 3rem;

    padding-top: 1rem;

    &__actions {
      padding: 0 4rem;
      display: flex;
      justify-content: center;
    }

    &__tooltip {
      flex: 1;
      font-size: 0.8rem;
      line-height: 1.25;

      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      text-align: left;
      opacity: 0.5;

      div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }
  }
}
</style>