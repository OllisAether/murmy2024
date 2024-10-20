<template>
  <div
    v-if="clue || transcript"
    :class="['clue-card', {
      'clue-card--unlocked': isUnlocked,
      'clue-card--affordable': isAffordable,
      'clue-card--confirmation': showBuyConfirmation,
      'clue-card--open': showClue,
      'clue-card--highlight': highlight,
      'clue-card--transcript': transcript
    }]"
  >
    <button
      class="clue-card__content"
      @click="openClue"
      :style="{
        zIndex: delayedShowBuyConfirmation ? 10 : 0
      }"
    >
      <VIcon v-if="highlight && !showBuyConfirmation" class="clue-card--highlight__icon">mdi-gesture-tap</VIcon>
      <SkewBox color="#ffffff18" :corner-cut="12" :img="transcript ? game.getAsset(transcript.thumbnailAssetId)?.content : null" />

      <template v-if="isUnlocked">
        <img
          v-if="!transcript"
          class="clue-card__thumbnail"
          :src="game.getAsset(clue?.thumbnailAssetId)?.content"
        >
      </template>
      <template v-else-if="clue">
        <NewBadge class="clue-card__new" v-if="game.clues.new.includes(clue?.id)" />
        <span class="clue-card__lock">
          <VIcon>mdi-lock</VIcon>
        </span>
        <span class="clue-card__cost">
          <VIcon size="1rem">mdi-star-four-points-circle</VIcon>
          {{ clue.cost }}
        </span>
      </template>
    </button>

    <div
      class="clue-card__title"
      :style="{
        zIndex: delayedShowBuyConfirmation ? 10 : 0
      }"
    >
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
      :z-index="9"
      absolute
    >
      <div class="clue-card__confirmation-overlay">
        <Btn
          :color="isAffordable ? '#24AA6A' : '#fff2'"
          @click="unlockClue"
          :disabled="!isAffordable"
          class="mr-3 clue-card__confirmation-overlay-confirm"
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
          class="clue-card__confirmation-overlay-cancel"
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
      :close-on-back="false"
      persistent
      no-click-animation
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
            <template v-if="clue.type === 'images' || clue.type === 'book'">
              <ClueImageViewer
                :assetIds="clue.images?.assetIds"
                :entries="clue.images?.entries"
                :book="clue.type === 'book'"
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
          <TextContentRenderer :text-content="clue.description" />
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
                Halten, um Hinweise zu markieren
              </span>
              <HelpBtn style="margin-top: -.5rem; margin-bottom: -.5rem;">
                <template #header>
                  Hinweise markieren
                </template>

                <p class="mb-2">
                  Halte den Finger auf einem Hinweis, um ihn zu markieren. Markierte Hinweise werden zur <b class="help-color">Datenbank</b> hinzugefügt.
                </p>
              </HelpBtn>
            </div>
          </div>
          <Btn
            v-if="closable"
            @click="showClue = false"
            color="#A23946"
            :style="{
              pointerEvents: tutorial.state.action === undefined ? undefined : 'none'
            }"
          >
            Schließen
            <VIcon size="1em" class="ml-2">mdi-close</VIcon>
          </Btn>
        </div>
      </div>
    </VOverlay>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import SkewBox from '../SkewBox.vue';
import { clues } from '../../../shared/assets/clues/index';
import { computed, ref, useModel, watch } from 'vue';
import Btn from '../Btn.vue';
import ClueImageViewer from './ClueViewer.vue';
import { Transcript } from '../../../shared/transcript';
import TranscriptDisplay from './TranscriptDisplay.vue';
import { useTutorial } from '@/store/team/tutorial';
import NewBadge from '../NewBadge.vue';
import HelpBtn from './HelpBtn.vue';
import TextContentRenderer from '../TextContentRenderer.vue';

const tutorial = useTutorial()
const game = useGameManager()

const props = defineProps<{
  showClue?: boolean;
  showBuyConfirmation?: boolean;
  clueId?: string;
  transcript?: Transcript,
  highlight?: boolean,
  closable?: boolean
}>();

const emit = defineEmits<{
  'update:showClue': [boolean];
  'update:showBuyConfirmation': [boolean];
}>();

const clue = clues.find((c) => c.id === props.clueId);
const isUnlocked = computed(() => props.transcript ? true : game.clues.unlocked?.includes(props.clueId ?? ''));
const isAffordable = computed(() => (game.clues.investigationCoins ?? Infinity) >= (clue?.cost ?? 0));

const showBuyConfirmation = useModel(props, 'showBuyConfirmation');
const delayedShowBuyConfirmation = ref(false);

watch(showBuyConfirmation, (val, _, onCleanup) => {
  if (val) {
    delayedShowBuyConfirmation.value = true;
  } else {
    const timeout = setTimeout(() => {
      delayedShowBuyConfirmation.value = false;
    }, 300);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  }
});

async function unlockClue() {
  if (!props.clueId) return;

  const res = await game.unlockClue(props.clueId);

  if (res.success) {
    showBuyConfirmation.value = false;
    delayedShowBuyConfirmation.value = false;
    showClue.value = true;
  }
}

const showClue = useModel(props, 'showClue');

function openClue() {
  if (isUnlocked.value) {
    showClue.value = true;
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;
@use 'sass:math';

.clue-card {
  min-width: 8rem;
  max-width: 10rem;
  height: fit-content;
  text-align: center;

  &--highlight {
    &__icon {
      z-index: 2;
      position: absolute;
      left: calc(100% - 1rem);
      top: calc(100% + 1rem);
      transform: rotate(-10deg);
      font-size: 5rem;
      animation: bounce 1.3s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
      text-shadow: 
        0 0 1rem #fff8,
        -.5rem 0 2rem rgba($neon1, 0.6),
        .5rem 0 2rem rgba($neon2, 0.6),
        0 0 4rem black;

      @keyframes bounce {
        0%, 100% {
          transform: rotate(-10deg)translateY(0);
        }
        50% {
          transform: rotate(-10deg)translateY(-.5rem);
        }
      }
    }

    &.clue-card--confirmation .clue-card__content::after {
      content: none;
    }

    .clue-card__content::after, .clue-card__confirmation-overlay-confirm::after {
      content: '';
      position: absolute;
      inset: -1rem -1.2rem -1.2rem -1rem;
      pointer-events: none;
      z-index: 1;
      border-radius: 1rem;
      border: 2px solid #fff;
      box-shadow: 
        inset 0 0 .5rem #fff,
        
        // inset .2rem 0 .25rem $neon1,
        // inset -.2rem 0 .25rem $neon2,
        
        inset 1rem 0 2rem -.5rem rgba($neon1, 0.3),
        inset -1rem 0 2rem -.5rem rgba($neon2, 0.3),
        
        0 0 1.5rem #fff,
        -.5rem 0 3rem rgba($neon1, 0.4),
        .5rem 0 3rem rgba($neon2, 0.4);
      animation: pulse 1.3s infinite;

      @keyframes pulse {
        0% {
          transform: scale(1.2);
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    }

    .clue-card__content::after {
      inset: -2rem -3rem -4rem -2.4rem;
      border-radius: 2rem;
    }
  }

  &__content {
    aspect-ratio: math.div(5, 8 * .8);
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
      z-index: -1;
    }

    .clue-card--transcript & {
      aspect-ratio: 5 / 8;
    }
  }
  
  &__title {
    position: relative;
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
    padding: 1rem 0 5rem;
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

  &__new {
    position: absolute;
    top: -.5rem;
    right: -2rem;
  }

  &__cost {
    position: absolute;
    bottom: .5rem;
    right: -1rem;
    display: flex;
    align-items: center;
    padding: .1rem .5rem;
    font-size: 1.25rem;
    font-family: $fontDisplay;

    border: 1px solid #ff7f7f88;
    background: #ff7f7f44;
    border-radius: .5rem;
    
    color: #ff7f7f;
    -webkit-backdrop-filter: blur(.2rem);
    backdrop-filter: blur(.2rem);
    
    .clue-card--affordable & {
      background: #393c3fa1;
      border-color: #fff2;
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