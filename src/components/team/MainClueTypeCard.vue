<template>
  <div class="main-clue-type-card">
    <VBtn @click="showClue = true">
      {{ game.clues.mainClueType }}
    </VBtn>

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
      <div class="main-clue-type-card__clue-display">
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

        <div class="main-clue-type-card__clue-display__actions">
          <div class="main-clue-type-card__clue-display__tooltip">
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

const Phone = defineAsyncComponent(() => import('./phone/Phone.vue'));
const Diary = defineAsyncComponent(() => import('./diary/Diary.vue'));

const game = useGameManager();
const showClue = ref(false);
</script>

<style lang="scss" scoped>
@import '@/scss/vars';

.main-clue-type-card {
  display: flex;
  justify-content: center;
  align-items: center;

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