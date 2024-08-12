<template>
  <div :class="['pin-lock', {
    'pin-lock--open': !diary.locked,
  }]">
    <button
      class="pin-lock__button"
      @click="unlock"
      ref="unlockButton"
    >
      <VIcon>mdi-chevron-left</VIcon>
    </button>

    <div class="pin-lock__digits">
      <PinLockDigit v-model="firstDigit" />
      <PinLockDigit v-model="secondDigit" />
      <PinLockDigit v-model="thirdDigit" />
      <PinLockDigit v-model="fourthDigit" />
    </div>

    <VSlideXReverseTransition>
      <div class="pin-lock__strap" v-if="diary.locked" />
    </VSlideXReverseTransition>

    <VFadeTransition>
      <div
        class="pin-lock__tooltip"
        v-if="diary.locked && (diary.pinTries > 0 || wrongPin || diary.pinTimeoutSeconds > 0)"
      >
        <div v-if="diary.pinTimeoutSeconds > 0">
          Du hast zu oft den falschen Pin eingegeben.<br>
          Bitte warte noch
          <b>
            {{ diary.pinTimeoutSeconds }} {{ diary.pinTimeoutSeconds === 1 ? 'Sekunde' : 'Sekunden' }}.
          </b>
        </div>
        <template v-else>
          <div v-if="wrongPin">
            Falscher Pin.
          </div>
          <div v-if="diary.pinTries > 0">
            Du hast noch {{ 3 - diary.pinTries }} {{ 3 - diary.pinTries === 1 ? 'Versuch' : 'Versuche' }}.
          </div>
        </template>
      </div>
    </VFadeTransition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import PinLockDigit from './PinLockDigit.vue';
import { useMainClue } from '@/store/team/mainClue';

const diary = useMainClue();

const firstDigit = ref<number>(getPinValue(0));
const secondDigit = ref<number>(getPinValue(1));
const thirdDigit = ref<number>(getPinValue(2));
const fourthDigit = ref<number>(getPinValue(3));

function getPinValue (index: number) {
  const num = parseInt(diary.diaryPinState[index])

  return isNaN(num) ? 0 : num;
}

watch([firstDigit, secondDigit, thirdDigit, fourthDigit], () => {
  diary.diaryPinState = `${firstDigit.value}${secondDigit.value}${thirdDigit.value}${fourthDigit.value}`;
});

const unlockButton = ref<HTMLButtonElement | null>(null);

const wrongPin = ref(false);

watch(() => diary.pinTimeoutSeconds, () => {
  if (diary.pinTimeoutSeconds > 0) {
    wrongPin.value = false;
  }
});

let unlockAnimation: Animation | null = null;
async function unlock () {
  let success = false;
  const wasLocked = diary.locked;

  if (diary.pinTimeoutSeconds > 0) {
    if (!unlockButton.value) return;
    unlockAnimation = unlockButton.value.animate(
      Array(5)
      .fill(0)
      .map((_, i) => ({
        transform: `translateX(${(i % 2 === 0 ? -1 : 1) * (4 - i) / 5 * .5}rem)`,
        offset: i / 6 + 1 / 6,
      })), {
      duration: 1000,
      easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)',
    })

    return;
  } else {
    success = diary.unlock(diary.diaryPinState);
  }

  if (!success) {
    if (diary.locked) {
      wrongPin.value = true;
    }

    if (!unlockButton.value) return;

    unlockAnimation = unlockButton.value.animate([
      {
        transform: 'translateX(-.2rem)',
        offset: .5,
      },
      {
        transform: 'translateX(-.2rem)', 
        offset: .8,
        easing: 'cubic-bezier(0.4, 1.8, 0.755, 1)'
      },
      { transform: 'translateX(0)' }
    ], {
      duration: 500,
      easing: 'cubic-bezier(0.3, 0.5, 0.6, .8)',
    })

    unlockAnimation.addEventListener('finish', () => {
      unlockAnimation = null;
    });
  } else {
    wrongPin.value = false;

    if (!unlockButton.value) return;

    if (unlockAnimation) {
      return
    }

    unlockAnimation = unlockButton.value.animate([
      {
        transform: 'translateX(-.5rem)',
        offset: .5
      },
      {
        transform: 'translateX(-1.5rem)',
        offset: .6
      },
      {
        transform: 'translateX(-1.5rem)',
        offset: .9,
        easing: 'cubic-bezier(0.4, 1.8, 0.755, 1)'
      }, {
        transform: 'translateX(0)',
      }
    ], {
      duration: 1000,
      easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    })


    if (wasLocked) {
      setTimeout(() => {
        if (diary.page === 0) {
          diary.page = 1;
        }
      }, 750);
    }

    await unlockAnimation.finished;
    unlockAnimation = null;
  }
}
</script>

<style lang="scss" scoped>
.pin-lock {
  position: relative;
  color: black;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  padding: 1rem;
  gap: 1rem;
  border-radius: 3rem 1rem 1rem 3rem;

  background: linear-gradient(#919a9b, #353c40);
  box-shadow: 
    0 2px 1px -1px #bdf7e9 inset,
    0 -2px 1px -1px #b8d7ec inset,
    2px 0 1px -1px #000 inset,
    -2px 0 1px -1px #000 inset,
    0 2px 10px #000,
  ;

  &::before {
    content: '';
    width: 3.4rem;
    height: .5rem;
    position: absolute;
    left: 2rem;
    border-radius: .25rem;
    background: linear-gradient(#1b1c1b, #070808);
    box-shadow:
      0 2px 1px -1px #bdf7e9,
      0 -2px 1px -1px #b8d7ec,
      0 0 2px #000,
      0 0 10px #000 inset
    ;
  }

  &::after {
    content: '';
    width: 2rem;
    height: 2rem;
    margin-left: 1rem;
    border-radius: 50%;
    background: linear-gradient(#1b1c1b, #070808);
    box-shadow:
      0 2px 1px -1px #bdf7e9,
      0 -2px 1px -1px #b8d7ec,
      0 0 2px #000,
      0 0 10px #000 inset
    ;
  }

  &__button {
    z-index: 1;
    display: block;
    width: 5rem;
    height: 4rem;
    border-radius: 2rem .5rem .5rem 2rem;
    font-size: 1.5rem;

    background: linear-gradient(#afbec0, #353c40);
    box-shadow:
      0 2px 1px -1px #bdf7e9 inset,
      0 -2px 1px -1px #b8d7ec inset,
      2px 0 1px -1px #000 inset,
      -2px 0 1px -1px #000 inset,
      0 0 8px #000,
    ;
    text-shadow:
      0 0 2px #000,
      0 1px 1px #fffa,
      0 -1px 1px #fffa;
    ;
  }

  &__digits {
    display: flex;
    gap: .5rem;
  }

  &__tooltip {
    position: absolute;
    top: calc(100% - .5rem);
    left: 4rem;
    z-index: 1;
    background: #1e181a;
    color: #ff8f8f;
    border: 1px solid #ff8f8f;
    padding: .5rem;
    border-radius: 0 .5rem .5rem .5rem;
    width: max-content;
  }

  &__strap {
    position: absolute;
    top: -.5rem;
    left: calc(100% - 3.5rem);
    bottom: -.5rem;
    width: 9rem;
    
    border-radius: 0 .5rem .5rem 0;
    background: linear-gradient(90deg, #1e181a, #070808);
    box-shadow:
      -3px 0 5px -2px #b8d7ec inset,
      0 0 2px #000,
      0 0 10px #000 inset
    ;

    &::before {
      content: '';
      position: absolute;
      left: -.5rem;
      top: -.05rem;
      bottom: -.05rem;
      width: 5rem;
      background: linear-gradient(#919a9b, #353c40);
      border-radius: .5rem;
      box-shadow: 
        0 2px 1px -1px #bdf7e9 inset,
        0 -2px 1px -1px #b8d7ec inset,
        2px 0 1px -1px #000 inset,
        -2px 0 1px -1px #000 inset,
        0 0 8px #000,
      ;
    }
  }
}
</style>