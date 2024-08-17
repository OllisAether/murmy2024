<template>
  <div
    v-if="clue || transcript"
    :class="['clue-card', {
      'clue-card--unlocked': isUnlocked,
      'clue-card--affordable': isAffordable,
      'clue-card--confirmation': showBuyConfirmation
    }]"
  >
    <button class="clue-card__content" @click="openClue">
      <SkewBox color="#fff2" :corner-cut="12"/>
      
      <template v-if="isUnlocked">
        <img
          class="clue-card__thumbnail"
          :src="transcript
            ? game.getAsset(transcript.thumbnailAssetId)?.content
            : game.getAsset(clue?.thumbnailAssetId)?.content"
        >
      </template>
      <template v-else>
        <span class="clue-card__lock">
          <VIcon>mdi-help</VIcon>
        </span>
        <span class="clue-card__cost">
          <VIcon size="1rem">mdi-star-four-points-circle</VIcon>
          {{ clue?.cost }}
        </span>
      </template>
    </button>

    <div class="clue-card__title">
      {{ clue?.title ?? transcript?.title }}
    </div>

    <VOverlay
      v-if="!isUnlocked"
      v-model="showBuyConfirmation"
      activator="parent"
      location-strategy="connected"
      location="bottom center"
      scroll-strategy="close"
      transition="slide-y-transition"
      attach="parent"
      :z-index="-1"
      :offset="16"
    >
      <div class="clue-card__confirmation-overlay">
        <Btn
          :color="isAffordable ? '#24AA6A' : '#fff2'"
          @click="unlockClue"
          :disabled="!isAffordable"
          class="mr-3"
        >
          Bestätigen
          <span class="clue-card__confirmation-overlay-cost">
            <VIcon size="1em">mdi-star-four-points-circle</VIcon>
            {{ clue?.cost }}
          </span>
        </Btn>
        <Btn
          color="#A23946"
          square
        >
          <VIcon>mdi-close</VIcon>
        </Btn>
      </div>
    </VOverlay>
    <VOverlay
      v-else
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
      <div class="clue-card__clue-display">
        <div class="clue-card__clue-display__name">
          {{ clue?.title ?? transcript?.title }}
        </div>
        <div class="clue-card__clue-display__content">
          <template v-if="clue">
            <template v-if="clue.type === 'images'">
              <ClueImageViewer
                :assetIds="clue.images?.assetIds"
                :entries="clue.images?.entries"
              />
            </template>
          </template>
          <template v-else-if="transcript">
            <TranscriptDisplay
              :transcript="transcript"
            />
          </template>
        </div>
        <div v-if="clue?.description" class="clue-card__clue-display__description">
          {{ clue?.description }}
        </div>
        <div class="clue-card__clue-display__actions">
          <div class="clue-card__clue-display__tooltip">
            <div v-if="clue">
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

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import SkewBox from '../SkewBox.vue';
import { clues } from '../../../shared/assets/clues';
import { computed, ref } from 'vue';
import Btn from '../Btn.vue';
import ClueImageViewer from './ClueViewer.vue';
import { Transcript } from '../../../shared/transcript';
import TranscriptDisplay from './TranscriptDisplay.vue';

const game = useGameManager();

const props = defineProps<{
  clueId?: string;
  transcript?: Transcript
}>();

const clue = clues.find((c) => c.id === props.clueId);
const isUnlocked = computed(() => props.transcript ? true : game.clues.unlocked.includes(props.clueId ?? ''));
const isAffordable = computed(() => game.clues.investigationCoins >= (clue?.cost ?? 0));

const showBuyConfirmation = ref(false);

async function unlockClue() {
  if (!props.clueId) return;

  const res = await game.unlockClue(props.clueId);

  console.log(res);
  if (res.success) {
    showBuyConfirmation.value = false;
    showClue.value = true;
  }
}

const showClue = ref(false);

function openClue() {
  if (isUnlocked.value) {
    showClue.value = true;
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.clue-card {
  min-width: 9rem;
  max-width: 10rem;
  height: fit-content;
  text-align: center;

  &--confirmation {
    z-index: 100;
  }

  &__content {
    aspect-ratio: .9;
    width: 100%;
    position: relative;
    transform-origin: bottom center;
    transition: transform .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    .clue-card--confirmation & {
      transform: scale(1.2)translateY(-.5rem);
    }
  
    & > :deep(.skew-box) {
      position: absolute;
      inset: 0;
      opacity: .5;
      z-index: -1;
    }
  }
  
  &__title {
    padding: 1rem .5rem 0 0;
    margin-left: -1rem;
    opacity: 0.5;
    font-family: $fontHeading;

    transition: opacity .3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                transform .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    .clue-card--unlocked & {
      opacity: 1;
    }

    .clue-card--confirmation & {
      opacity: 1;
      transform: scale(1.2)translateY(-.25rem);
    }
  }

  &__confirmation-overlay {
    display: flex;
    align-items: center;
    padding-right: 1rem;
  }

  &__confirmation-overlay-cost {
    display: flex;
    align-items: center;
    transform: scale(1.25);
    margin-left: 1.25rem;

    
    :deep(.v-icon) {
      margin-right: .25rem;
    }
  }

  &__lock {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }

  &__cost {
    position: absolute;
    bottom: .5rem;
    right: -1rem;
    display: flex;
    align-items: center;
    padding: .25rem .5rem;
    font-size: 1.25rem;
    font-family: $fontDisplay;
    background: rgba(0, 0, 0, .25);
    color: #f44;
    -webkit-backdrop-filter: blur(.2rem);
    backdrop-filter: blur(.2rem);

    .clue-card--affordable & {
      color: inherit;
    }

    :deep(.v-icon) {
      margin-right: .5rem;
    }
  }

  &__thumbnail {
    display: block;
    pointer-events: none;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: translate(-.75rem, -.5rem);
    object-fit: contain;
    filter: drop-shadow(0 0 1rem #0007);
  }

  &__clue-display {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    // gap: 1rem;
    height: 100%;
    padding-bottom: 3rem;

    &__name {
      z-index: 2000;
      font-size: 2rem;
      line-height: 2rem;
      padding: 1.5rem 1.5rem 0;
      font-family: $fontDisplay;
      
      font-weight: 300;
    }

    &__content {
      padding-top: 1rem;
      flex-grow: 1;
      height: 0;
    }

    &__description {
      padding: .75rem 2rem;
      max-height: 1.5rem * 4;
      mask-image: linear-gradient(transparent, black .75rem, black calc(100% - .75rem), transparent);
      overflow: auto;
      opacity: .75;
      font-size: 1rem;
      line-height: 1.5rem;
      text-align: center;
    }

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