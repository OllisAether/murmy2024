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
          <template #main-clue-type>
            <Phone />
          </template>
        </ClueImageViewer>

        <div class="main-clue-type-card__clue-display__actions">
          <Btn
            @click="showClue = false"
            color="#A23946"
          >
            Schließen
          </Btn>
        </div>
      </div>
    </VOverlay>
  </div>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import ClueImageViewer from './ClueImageViewer.vue';
import { ref } from 'vue';
import Phone from './phone/Phone.vue';
import Btn from '../Btn.vue';

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
      display: flex;
      justify-content: center;
    }
  }
}
</style>