<template>
  <div
    :class="['phone-lock-screen', {
      'phone-lock-screen--numpad': showNumpad,
    }]"
    @pointerdown="pointerdown"
    @touchstart="touchstart"
  >
    <img
      class="phone-lock-screen__background"
      :src="game.getAsset('dokumente/Hawthornes Bild.jpg')?.content"
    >

    <div class="phone-lock-screen__content">
      <VFadeTransition>
        <div v-if="showNumpad" class="phone-lock-screen__pin-screen">
          <div class="phone-lock-screen__wrong-pin">
            <div v-if="phone.pinTimeoutSeconds > 0">
              Du hast zu oft den falschen Pin eingegeben. Bitte warte noch
              {{ phone.pinTimeoutSeconds }} {{ phone.pinTimeoutSeconds === 1 ? 'Sekunde' : 'Sekunden' }}.
            </div>
            <template v-else>
              <div v-if="wrongPin">
                Falscher Pin.
              </div>
              <div v-if="phone.pinTries > 0">
                Du hast noch {{ 3 - phone.pinTries }} {{ 3 - phone.pinTries === 1 ? 'Versuch' : 'Versuche' }}.
              </div>
            </template>
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
              <BackspaceSvg />
            </button>
          </div>

          <div :class="['phone-lock-screen__numberpad', {
            'phone-lock-screen__numberpad--disabled': phone.pinTimeoutSeconds > 0
          }]">
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('1')">
              <span>1</span>
            </button>
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('2')">
              <span>2</span>
              <span>abc</span>
            </button>
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('3')">
              <span>3</span>
              <span>def</span>
            </button>
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('4')">
              <span>4</span>
              <span>ghi</span>
            </button>
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('5')">
              <span>5</span>
              <span>jkl</span>
            </button>
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('6')">
              <span>6</span>
              <span>mno</span>
            </button>
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('7')">
              <span>7</span>
              <span>pqrs</span>
            </button>
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('8')">
              <span>8</span>
              <span>tuv</span>
            </button>
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('9')">
              <span>9</span>
              <span>wxyz</span>
            </button>
            <div />
            <button class="phone-lock-screen__numberpad__button" @click="handlePin('0')">
              <span>0</span>
            </button>
            <button class="phone-lock-screen__numberpad__button" @click="unlock">
              <EnterSvg />
            </button>
          </div>
        </div>
        <div v-else class="phone-lock-screen__swipeup" data-no-pan>
          <div class="phone-lock-screen__swipeup__clock">
            <span class="phone-lock-screen__swipeup__clock__time">
              {{ phone.clock }}
            </span>
            <span class="phone-lock-screen__swipeup__clock__date">
              {{ phone.date }}
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
                transition: !isSwiping ? 'transform 0.2s' : 'none',
                transform: `translateY(-${swipeProgress * 50}px)`
              }"
            >
              <path stroke="currentColor" d="M9 1.5V10"/>
              <path stroke="currentColor" d="M5 5l4-4 4 4"/>
            </svg>
  
            <span
              :style="{
                transition: !isSwiping ? 'transform 0.2s' : 'none',
                transform: `translateY(-${swipeProgress * 20}px)`
              }"
            >Nach oben wischen</span>
          </div>
        </div>
      </VFadeTransition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import { useMainClue } from '@/store/team/mainClue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import BackspaceSvg from '@/assets/phone/backspace.svg';
import EnterSvg from '@/assets/phone/enter.svg';

const game = useGameManager();
const phone = useMainClue();

const dots = ref(0);
const pin = ref('');
const showNumpad = ref(false)

const swipeProgress = ref(0)
const isSwiping = ref(false)

function pointerdown (e: PointerEvent) {
  if (e.pointerType === 'touch') return
  if (showNumpad.value) return

  isSwiping.value = true

  const startY = e.clientY

  let velocity = 0

  var lastY = startY
  var lastTime = Date.now()
  function pointermove (e: PointerEvent) {
    swipeProgress.value = Math.min(1, Math.max(0, (startY - e.clientY) / 400))

    const now = Date.now()
    const timeDiff = now - lastTime
    const yDiff = e.clientY - lastY
    
    velocity = -yDiff / timeDiff

    if (swipeProgress.value >= 1) {
      pointerup()
    }
  }


  function pointerup () {
    if (swipeProgress.value > 0.5 || velocity > 2) {
      showNumpad.value = true
    }

    swipeProgress.value = 0
    isSwiping.value = false

    window.removeEventListener('pointermove', pointermove)
    window.removeEventListener('pointerup', pointerup)
  }

  window.addEventListener('pointermove', pointermove)
  window.addEventListener('pointerup', pointerup)
}

function touchstart (e: TouchEvent) {
  if (showNumpad.value) return
  if (e.touches.length > 1) return

  isSwiping.value = true

  const startY = e.touches[0].clientY

  let velocity = 0

  var lastY = startY
  var lastTime = Date.now()
  function touchmove (e: TouchEvent) {
    if (e.touches.length > 1) {
      touchend()
      return
    }

    swipeProgress.value = Math.min(1, Math.max(0, (startY - e.touches[0].clientY) / 400))

    const now = Date.now()
    const timeDiff = now - lastTime
    const yDiff = e.touches[0].clientY - lastY
    
    velocity = -yDiff / timeDiff

    if (swipeProgress.value >= 1) {
      touchend()
    }
  }


  function touchend () {
    if (swipeProgress.value > 0.5 || velocity > 2) {
      showNumpad.value = true
    }

    swipeProgress.value = 0
    isSwiping.value = false

    window.removeEventListener('touchmove', touchmove)
    window.removeEventListener('touchend', touchend)
  }

  window.addEventListener('touchmove', touchmove)
  window.addEventListener('touchend', touchend)
}

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
  wrongPin.value = !phone.unlock(pin.value)

  if (pin.value.length < 4) {
    return
  }

  if (wrongPin.value) {
    pin.value = ''
    dots.value = 0
  }
}

onMounted(() => {
  const off = phone.onBackBtn(() => {
    if (showNumpad.value) {
      showNumpad.value = false
    }
  })

  onBeforeUnmount(() => {
    off()
  })
})
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
    background: linear-gradient(#000, #0000 30%, #0000 70%, #000);
    height: 100%;
    position: absolute;
    inset: 0;
  }

  &__pin-screen {
    position: absolute;
    inset: 0;
    background: #000a;
  }

  &__swipeup {
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
    bottom: 20px;
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
      padding: 4px 0;
      margin: 2px;
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