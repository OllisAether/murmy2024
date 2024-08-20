<template>
  <div class="numpad-screen">
    <div :class="['numpad-screen__warning', {
      'numpad-screen__warning--blink': simWarning
    }]">
      Keine SIM-Karte eingelegt
    </div>
    <div class="numpad-screen__phone-number">
      <div class="numpad-screen__phone-number__field">
        {{ phoneNumber }}
      </div>
    </div>

    <div class="numpad-screen__numpad">
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('1')"
      >
        <span class="numpad-screen__numpad__button__primary">1</span>
        <span class="numpad-screen__numpad__button__secondary">
          <VIcon>mdi-voicemail</VIcon>
        </span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('2')"
      >
        <span class="numpad-screen__numpad__button__primary">2</span>
        <span class="numpad-screen__numpad__button__secondary">abc</span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('3')"
      >
        <span class="numpad-screen__numpad__button__primary">3</span>
        <span class="numpad-screen__numpad__button__secondary">def</span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('4')"
      >
        <span class="numpad-screen__numpad__button__primary">4</span>
        <span class="numpad-screen__numpad__button__secondary">ghi</span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('5')"
      >
        <span class="numpad-screen__numpad__button__primary">5</span>
        <span class="numpad-screen__numpad__button__secondary">jkl</span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('6')"
      >
        <span class="numpad-screen__numpad__button__primary">6</span>
        <span class="numpad-screen__numpad__button__secondary">mno</span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('7')"
      >
        <span class="numpad-screen__numpad__button__primary">7</span>
        <span class="numpad-screen__numpad__button__secondary">pqrs</span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('8')"
      >
        <span class="numpad-screen__numpad__button__primary">8</span>
        <span class="numpad-screen__numpad__button__secondary">tuv</span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('9')"
      >
        <span class="numpad-screen__numpad__button__primary">9</span>
        <span class="numpad-screen__numpad__button__secondary">wxyz</span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('*')"
      >
        <span class="numpad-screen__numpad__button__primary">*</span>
        <span class="numpad-screen__numpad__button__secondary"></span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('0')"
      >
        <span class="numpad-screen__numpad__button__primary">0</span>
        <span class="numpad-screen__numpad__button__secondary">+</span>
      </button>
      <button
        class="numpad-screen__numpad__button"
        @click="handleButtonClick('#')"
      >
        <span class="numpad-screen__numpad__button__primary">#</span>
        <span class="numpad-screen__numpad__button__secondary"></span>
      </button>
    </div>
    <div class="numpad-screen__bottom-bar">
      <div></div>
      <button @click="call">
        <VIcon>mdi-phone</VIcon>
      </button>
      <button @click="backspace" v-if="phoneNumber.length > 0">
        <BackspaceSvg />
      </button>
      <div v-else></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BackspaceSvg from '@/assets/phone/backspace.svg';

const phoneNumber = ref('');

function handleButtonClick(digit: string) {
  if (phoneNumber.value.length >= 15) {
    return;
  }

  phoneNumber.value += digit;
}

function backspace () {
  phoneNumber.value = phoneNumber.value.slice(0, -1);
}

const simWarning = ref(false);
function call () {
  phoneNumber.value = '';

  if (!simWarning.value) {
    simWarning.value = true;

    setTimeout(() => {
      simWarning.value = false;
    }, 2000);

    return;
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.numpad-screen {
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 1px * $scale;

  &__warning {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 8px * $scale;
    margin-top: 10px * $scale;

    &--blink {
      animation: blink .5s infinite;

      @keyframes blink {
        0%, 100% {
          color: white;
        }
        50% {
          color: #ff5849;
        }
      }
    }
  }

  &__phone-number {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 5px * $scale;

    &__field {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px * $scale;
      color: #4dccff;
      line-height: 1;
      word-break: break-all;
      text-align: center;
    }
  }

  &__numpad {
    position: inherit;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px * $scale;
    padding-bottom: 5px * $scale;

    &__button {
      display: flex;
      flex-direction: row;

      justify-content: center;
      align-items: center;
      gap: 4px * $scale;

      &__primary {
        font-size: 18px * $scale;
        color: #4dccff;
      }

      &__secondary {
        font-size: 8px * $scale;
        color: #aaa;
        border-bottom: 1px * $scale solid #4dccff;
      }

      &:active {
        background: #4dccff;

        .numpad-screen__numpad__button__primary {
          color: #000;
        }

        .numpad-screen__numpad__button__secondary {
          color: #000;
          border-color: #000;
        }
      }
    }
  }

  &__bottom-bar {
    display: flex;
    justify-content: center;
    border-top: 1px * $scale solid #4dccff;

    & > * {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px * $scale 0;
  
      & > svg {
        width: 18px * $scale;
        display: block;
      }
    }

    & > button:active {
      background: #4dccff;
      color: #000;
    }
  }

}
</style>