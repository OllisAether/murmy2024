<template>
  <VBtn icon variant="text" :class="['help-btn', {
    'help-btn--highlight': tutorial.state.highlightOracle
  }]">
    <VIcon size="small">mdi-crystal-ball</VIcon>

    <VOverlay
      v-model="help"
      activator="parent"
      target="parent"
      :location="location ?? 'bottom center'"
      location-strategy="connected"
      :max-width="maxWidth ?? 500"
      :scrim="false"
      transition="dialog-transition"
      close-on-back
      close-on-content-click
      scroll-strategy="close"
      offset="8"
    >
      <div class="help-btn__tooltip">
        <div class="help-btn__tooltip__content">
          <div class="help-btn__tooltip__content__header">
            <VIcon class="help-btn__tooltip__content__header__icon">mdi-crystal-ball</VIcon>
            <div class="help-btn__tooltip__content__header__title">
              Orakel der Behilflichkeit
            </div>

            <div class="help-btn__tooltip__content__header__slot">
              <slot name="header" />
            </div>
          </div>

          <slot />
        </div>

        <VIcon class="help-btn__icon help-btn__icon--shimmer">mdi-shimmer</VIcon>
        <VIcon class="help-btn__icon help-btn__icon--star">mdi-creation</VIcon>
        <VBtn
          class="help-btn__close"
          @click="help = false"
          flat
          icon
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </div>
    </VOverlay>
  </VBtn>
</template>

<script setup lang="ts">
import { useTutorial } from '@/store/team/tutorial';
import { ref } from 'vue';

declare const block: readonly ["top", "bottom"];
declare const inline: readonly ["start", "end", "left", "right"];
type Tblock = typeof block[number];
type Tinline = typeof inline[number];
type Anchor = Tblock | Tinline | 'center' | 'center center' | `${Tblock} ${Tinline | 'center'}` | `${Tinline} ${Tblock | 'center'}`;

defineProps<{
  maxWidth?: number;
  location?: Anchor;
}>();

const help = ref(false);

const tutorial = useTutorial()
</script>

<style scoped lang="scss">
@use '@/scss/vars' as *;

.help-btn {
  position: relative;
  color: #c184ff99;
  text-shadow: 0 0 1rem #9123ff;
  width: 2rem;
  height: 2rem;

  &--highlight{
    color: #eddaff;
    text-shadow: 0 0 1rem #c184ff99, 0 0 1rem #c184ff99, 0 0 2rem #9123ff;

    &::before {
      content: '';
      position: absolute;
      inset: 0rem;
      border-radius: 50%;
      border: 1px solid #fff;
      box-shadow:
        0 0 1rem #c184ff99,
        0 0 2rem #9123ff,
        0 0 .2rem #c184ff99 inset,
        0 0 .5rem #9123ff inset;

      animation: pulse2 1.3s infinite cubic-bezier(0.445, 0.05, 0.55, 0.95) both;

      @keyframes pulse2 {
        0%, 100% {
          transform: scale(1.3);
        }
        50% {
          transform: scale(1);
        }
      }
    }
  }

  &__tooltip {
    position: relative;
    border-radius: 0.5rem;
    box-shadow:
      0 0 5rem #9123ff55,
      0 0 2rem #c184ff99,
      0 0 1rem #d8b1ff77 inset,
      0 0 5rem #9123ff55 inset,
      0 0 8rem 3rem #000a,
    ;

    -webkit-backdrop-filter: blur(1rem);
    backdrop-filter: blur(1rem);

    background-color: #2b183ed5;
    border: 1px solid #d8b1ff;

    &__content {
      position: relative;
      z-index: 1;
      padding: 1.5rem;
      // font-size: 1.2rem;
      line-height: 1.5;

      &__header {
        margin-bottom: 1rem;
        display: grid;
        grid-template-columns: auto 1fr;

        gap: 0 .5rem;
        align-items: center;
        color: #d8b1ff;
        text-shadow: 0 0 1rem #c184ff99, 0 0 2rem #9123ff;

        &__icon {
          font-size: 3.5rem;
          grid-row: 1 / span 2;
        }

        &__title {
          font-size: 1rem;
          line-height: 1;
          opacity: .6;
          font-family: $fontDisplayCursive;
        }

        &__slot {
          font-size: 2rem;
          line-height: 1;
          margin-top: .2rem;
          font-family: $fontHeading;
          letter-spacing: -.05em;
        }
      }

      :deep(.help-color) {
        color: #d8b1ff;
        text-shadow: 0 0 .5rem #9123ff;
      }
    }
  }

  &__icon {
    position: absolute;
    font-size: 3rem;
    color: #d8b1ff;

    text-shadow: 0 0 1rem #c184ff99, 0 0 2rem #9123ff;
    animation: wiggle 2s infinite cubic-bezier(0.645, 0.045, 0.355, 1) both;

    @keyframes wiggle {
      0% {
        transform: rotate(-5deg);
      }
      50% {
        transform: rotate(5deg);
      }
      100% {
        transform: rotate(-5deg);
      }
    }

    &--shimmer {
      top: -1.2rem;
      left: -1.8rem;
    }

    &--star {
      bottom: -1.2rem;
      right: -1.8rem;
      animation-delay: 0.5s;
    }
  }

  &__close {
    position: absolute;
    width: 2.5rem;
    height: 2.5rem;
    top: -1.25rem;
    right: -1.25rem;
    color: #d8b1ff;
    background-color: #2b183ed5;
    border: 1px solid #d8b1ff;
    border-radius: 50%;
    -webkit-backdrop-filter: blur(.1rem);
    backdrop-filter: blur(.1rem);
    box-shadow: 0 0 1rem #c184ff99, 0 0 2rem #9123ff, 0 0 .5rem #c184ff99 inset, 0 0 1rem #9123ff inset;
  }
}
</style>