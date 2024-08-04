<template>
  <div
    class="phone-lock-screen"
    ref="root"
    @click="showNumpad = true"
  >
    <img
      class="phone-lock-screen__background"
      :src="game.getAsset('dokumente/Hawthornes Bild.jpg')?.content"
    >

    <VFadeTransition>
      <div v-if="showNumpad" class="phone-lock-screen__content">
        <div class="phone-lock-screen__wrong-pin">
          <div v-if="phone.pinTimeoutSeconds > 0">
            Du hast zu oft den falschen Pin eingegeben. Bitte warte noch
            {{ phone.pinTimeoutSeconds }} {{ phone.pinTimeoutSeconds === 1 ? 'Sekunde' : 'Sekunden' }}.
          </div>
          <div v-else-if="wrongPin">
            Falscher Pin.

            <div v-if="phone.pinTries > 0">
              Du hast noch {{ 3 - phone.pinTries }} {{ 3 - phone.pinTries === 1 ? 'Versuch' : 'Versuche' }}.
            </div>
          </div>
        </div>

        <div class="phone-lock-screen__pin">
          <div class="phone-lock-screen__pin__dots">
            <template
              v-for="(digit, i) in pin"
            >
              <template v-if="i >= dots">
                {{ digit }}
              </template>
              <template v-else>
                •
              </template>
            </template>
          </div>

          <button
            class="phone-lock-screen__pin__back"
            @click="back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" fill="none" viewBox="0 0 18 12">
              <path fill="currentColor" fill-rule="evenodd" d="m0 6 3.5-3.5H16v7H3.5L0 6Zm6.688-1.61L8.7 6 6.688 7.61l.624.78L9.5 6.64l2.188 1.75.624-.78L10.3 6l2.012-1.61-.624-.78L9.5 5.36 7.312 3.61l-.624.78Z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

        <div :class="['phone-lock-screen__numberpad', {
          'phone-lock-screen__numberpad--disabled': phone.pinTimeoutSeconds > 0
        }]">
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('1')">
            <span>1</span>
            <span>abc</span>
          </button>
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('2')">
            <span>2</span>
            <span>def</span>
          </button>
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('3')">
            <span>3</span>
            <span>ghi</span>
          </button>
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('4')">
            <span>4</span>
            <span>jkl</span>
          </button>
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('5')">
            <span>5</span>
            <span>mno</span>
          </button>
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('6')">
            <span>6</span>
            <span>pqrs</span>
          </button>
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('7')">
            <span>7</span>
            <span>tuv</span>
          </button>
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('8')">
            <span>8</span>
            <span>wxyz</span>
          </button>
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('9')">
            <span>9</span>
            <span>+</span>
          </button>
          <div />
          <button class="phone-lock-screen__numberpad__button" @click="handlePin('0')">
            <span>0</span>
          </button>
          <button class="phone-lock-screen__numberpad__button" @click="unlock">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" fill="none" viewBox="0 0 18 12">
              <path stroke="currentColor" d="M5.5 2.5 2 6l3.5 3.5"/>
              <path stroke="currentColor" d="M2 6h13.5V2"/>
            </svg>
          </button>
        </div>
      </div>
      <div v-else class="phone-lock-screen__swipeup">
        <div class="phone-lock-screen__swipeup__clock">
          <span class="phone-lock-screen__swipeup__clock__time">
            {{ clock }}
          </span>
          <span class="phone-lock-screen__swipeup__clock__date">
            {{ date }}
          </span>
        </div>

        <div class="phone-lock-screen__swipeup__icon">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="12"
            fill="none"
            viewBox="0 0 18 12"
            :style="{
              transform: `translateY(-${swipeProgress * 50}px)`
            }"
          >
            <path stroke="currentColor" d="M9 1.5V10"/>
            <path stroke="currentColor" d="M5 5l4-4 4 4"/>
          </svg>

          <span
            :style="{
              transform: `translateY(-${swipeProgress * 20}px)`
            }"
          >Nach oben wischen</span>
        </div>
      </div>
    </VFadeTransition>
  </div>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import { usePhone } from '@/store/team/phone';
import { useSwipe } from '@vueuse/core';
import { computed, onBeforeUnmount, ref } from 'vue';

defineProps<{
  clock: string;
}>()

const game = useGameManager();
const phone = usePhone();

const root = ref<HTMLElement | null>(null)

const date = (() => {
  const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

  const date = new Date()
  date.setFullYear(2013)
  const day = date.getDate().toString().padStart(2, '0')
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const weekday = weekdays[date.getDay()]

  return `${weekday}, ${day}. ${month} ${year}`
})()

const dots = ref(0);
const pin = ref('');
const showNumpad = ref(false)

const swipeProgress = computed(() => {
  if (swipe.isSwiping.value) {
    return Math.min(1, swipe.lengthY.value / 400)
  }

  return 0
})

const swipe = useSwipe(root, {
  threshold: 10,
  onSwipeEnd: () => {
    if (swipe.direction.value === 'up') {
      showNumpad.value = true
    }
  }
})

let dotTimeout: number | undefined
onBeforeUnmount(() => {
  clearTimeout(dotTimeout)
})

function handlePin (number: string) {
  if (pin.value.length >= 10) return

  dotTimeout && clearTimeout(dotTimeout)
  dots.value = pin.value.length

  pin.value += number

  dotTimeout = setTimeout(() => {
    dots.value = pin.value.length
  }, 500) as any;
}

function back () {
  pin.value = pin.value.slice(0, -1)
  dots.value = pin.value.length
}

const wrongPin = ref<boolean | number>(false)
function unlock () {
  wrongPin.value = !phone.unlockPhone(pin.value)

  if (wrongPin.value) {
    pin.value = ''
    dots.value = 0
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.phone-lock-screen {
  height: 100%;

  &__background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__content {
    background: linear-gradient(#000d, #000a 15%, #000a 50%, black);
    height: 100%;
    position: absolute;
    inset: 0;
  }

  &__swipeup {
    background: linear-gradient(#000, #0000 30%, #0000 70%, #000);
    height: 100%;
    position: absolute;
    inset: 0;

    &__clock {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      line-height: 1;

      display: flex;
      flex-direction: column;
      align-items: center;
      
      &__time {
        font-size: 48px;
        font-weight: light;
        letter-spacing: -.05em; 
      }

      &__date {
        font-size: 10px;
        color: #fff;
        text-align: center;
      }
    }

    &__icon {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;

      flex-direction: column;
      align-items: center;
      gap: 5px;
      font-size: 10px;
    }
  }

  &__wrong-pin {
    position: absolute;
    top: 90px;
    left: 10px;
    right: 10px;
    font-size: 8px;
    text-align: center;
    transform: translateY(-100%);

    color: white;
  }

  &__pin {
    position: absolute;
    top: 90px;
    left: 10px;
    right: 10px;
    height: 25px;

    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid white;

    &__dots {
      flex: 1;
      color: white;
      text-align: center;
    }
  }

  &__numberpad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    padding: 10px;

    &--disabled {
      pointer-events: none;
      opacity: 0.5;
    }
  
    &__button {
      display: flex;
      flex-direction: row;
      justify-content: center;
    
      align-items: center;
      color: white;
      font-size: 12px;
      padding: 8px 0;
      cursor: pointer;

      &:active {
        background-color: #fff2;
      }

      span:nth-child(2) {
        margin-left: 5px;
        font-size: 8px;
        color: #888;
      }
    }
  }
}
</style>