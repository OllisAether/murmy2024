<template>
  <div class="phone" :style="{
    '--phone-width': 213 + 'px',
    '--phone-height': 418 + 'px',
    // '--screen-door-opacity': Math.min(0.8, (zoomScale - 1) / 4),
  }">
    <div class="phone__screen">
      <div class="phone__statusbar">
        <div>
          <VIcon size="1em">mdi-sim-alert-outline</VIcon>
          <VSpacer />
          <VIcon size="1em">mdi-signal-off</VIcon>
          <VIcon size="1em">mdi-battery-80</VIcon>
          {{ phone.clock }}
        </div>
      </div>

      <div class="phone__content">
        <Transition name="phone__content__lockscreen">
          <PhoneLockScreen class="phone__content__lockscreen" v-if="phone.locked" />
        </Transition>

        <div class="phone__content__main" v-if="!phone.locked">
          <Transition name="phone__content__home">
            <HomeScreen v-if="phone.currentApp === 'home'" />
          </Transition>

          <Transition name="phone__content__app">
            <CallsApp class="phone__content__app" v-if="phone.currentApp === 'calls'" />
            <CameraApp class="phone__content__app" v-else-if="phone.currentApp === 'camera'" />
            <MessagesApp class="phone__content__app" v-else-if="phone.currentApp === 'sms'" />
            <NotesApp class="phone__content__app" v-else-if="phone.currentApp === 'notes'" />

            <InternetApp class="phone__content__app" v-else-if="phone.currentApp === 'internet'" />
            <PinterestApp class="phone__content__app" v-else-if="phone.currentApp === 'pinterest'" />
            <TumblrApp class="phone__content__app" v-else-if="phone.currentApp === 'tumblr'" />
            <PlayStoreApp class="phone__content__app" v-else-if="phone.currentApp === 'playstore'" />
            <ClockApp class="phone__content__app" v-else-if="phone.currentApp === 'clock'" />
            <CalculatorApp class="phone__content__app" v-else-if="phone.currentApp === 'calculator'" />
            <CrashApp class="phone__content__app" v-else-if="phone.currentApp === 'crash'" />
          </Transition>

          <VFadeTransition>
            <div class="phone__alert__scrim" v-if="phone.alert"></div>
          </VFadeTransition>
          <VDialogTransition>
            <div class="phone__alert" v-if="phone.alert">
              <div class="phone__alert__content">
                <div class="phone__alert__title">
                  {{ phone.alert.title }}
                </div>
                <div class="phone__alert__message">
                  {{ phone.alert.message }}
                </div>

                <div class="phone__alert__actions">
                  <button
                    v-for="(action, i) in phone.alert.actions"
                    :key="i"
                    @click="action.callback"
                  >
                    {{ action.text }}
                  </button>
                </div>
              </div>
            </div>
          </VDialogTransition>
        </div>
      </div>

      <div class="phone__navbar">
        <button
          class="phone__navbar__button phone__navbar__button--home"
          @click="phone.backBtn()"
        >
          <BackSvg />
        </button>
        <button
          :style="{
            opacity: phone.locked ? 0 : 1,
          }"
          class="phone__navbar__button phone__navbar__button--home"
          @click="phone.homeBtn()"
        >
          <HomeSvg />
        </button>
        <button
          :style="{
            opacity: phone.locked ? 0 : 1,
          }"
          class="phone__navbar__button phone__navbar__button--menu"
        >
          <MenuSvg />
        </button>
      </div>
    </div>

    <img :src="game.getAsset('phone/Phone.webp')?.content" class="phone__image">
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { useMainClue } from '@/store/team/mainClue';
import moment from 'moment';
import { onBeforeUnmount, onMounted } from 'vue';
import PhoneLockScreen from './PhoneLockScreen.vue';
import HomeScreen from './home/HomeScreen.vue';
import CallsApp from './calls/CallsApp.vue';

import BackSvg from '@/assets/phone/back.svg';
import HomeSvg from '@/assets/phone/home.svg';
import MenuSvg from '@/assets/phone/menu.svg';
import InternetApp from './misc/InternetApp.vue';
import CameraApp from './camera/CameraApp.vue';
import MessagesApp from './messages/MessagesApp.vue';
import NotesApp from './notes/NotesApp.vue';
import PlayStoreApp from './misc/PlayStoreApp.vue';
import ClockApp from './misc/ClockApp.vue';
import CalculatorApp from './misc/CalculatorApp.vue';
import CrashApp from './misc/CrashApp.vue';
import PinterestApp from './misc/PinterestApp.vue';
import TumblrApp from './misc/TumblrApp.vue';

defineProps<{
  zoomScale: number;
}>();

const game = useGameManager();
const phone = useMainClue();

onMounted(() => {
  phone.clock = moment().format('HH:mm');

  const interval = setInterval(() => {
    phone.clock = moment().format('HH:mm');
  }, 1000);

  onBeforeUnmount(() => {
    clearInterval(interval);
  });
});
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.phone {
  position: relative;
  width: 213px * $scale;
  height: 418px * $scale;

  font-size: 12px * $scale;
  font-family: Arial, Helvetica, sans-serif;

  &__image {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__screen {
    pointer-events: all;
    position: absolute;
    top: 53px * $scale;
    left: 16px * $scale;
    width: 180.5px * $scale;
    height: 320.5px * $scale;;
    background: black;

    // transform-origin: 0 0;
    // transform: scale($scale);

    display: flex;
    flex-direction: column;
    // will-change: transform;

    // &::after {
    //   z-index: 9999;
    //   content: '';
    //   position: absolute;
    //   inset: 0;
    //   width: percentage($scale);
    //   height: percentage($scale);
    //   will-change: opacity;

    //   transform-origin: 0 0;
    //   transform: scale(calc(1 / $scale));
    
    //   background:
    //     linear-gradient(black, transparent 25%, transparent 75%, black),
    //     linear-gradient(to right, black, #f00 10%, #f00 20%, #0f0, #00f 80%, #00f 90%, black);
    //   background-size: $scale * 1px $scale * 1px;
    //   pointer-events: none;

    //   mix-blend-mode: color-dodge;
      
    //   opacity: var(--screen-door-opacity, 0);
    // }

    // & > * {
    //   filter: brightness(calc(0.9 - var(--screen-door-opacity, 0) * 0.25))
    // }
  }

  &__statusbar {
    height: 12px * $scale;
    background: linear-gradient(#242424, #000000);
    font-size: 8px * $scale;
    color: white;

    & > div {
      display: flex;
      align-items: center;

      gap: 3px * $scale;
      padding: 0 3px * $scale;

      mask-image: linear-gradient(transparent, white 40%, transparent);
    }
  }

  &__content {
    position: relative;
    flex: 1;
    background: black;
    overflow: hidden;

    &__lockscreen {
      position: absolute;
      inset: 0;

      &-leave-active {
        transition: transform 0.3s ease, opacity 0.3s;
        z-index: 1;
      }

      &-leave-to {
        opacity: 0;
        transform: scale(1.5);
      }
    }

    &__main {
      position: absolute;
      inset: 0;

      & > * {
        position: absolute;
        inset: 0;
      }
    }

    &__home {
      &-leave-active {
        transition: 0.3s;
      }
    }

    &__app {
      &-enter-active {
        transition: transform 0.2s ease, opacity 0.2s;
      }

      &-enter-from {
        opacity: 0;
        transform: scale(.8);
      }

      &-leave-active {
        transition: transform 0.2s ease, opacity 0.2s;
      }

      &-leave-to {
        opacity: 0;
        transform: scale(.8);
      }
    }
  }

  &__navbar {
    display: flex;
    justify-content: space-between;
    height: 20px * $scale;
    background: #000;

    &__button {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      padding: 0;
      height: 100%;
      color: #888;

      &:active {
        background: radial-gradient(#fff3 50%, transparent 50%);
        background-size: 80px * $scale 80px * $scale;
        background-position: center;
        background-repeat: no-repeat;
      }

      &--menu {
        pointer-events: none;
      }

      svg {
        width: 18px * $scale;
        height: 12px * $scale;
      }
    }

    &-enter-active, &-leave-active {
      transition: opacity 0.3s;
    }

    &-enter-to, &-leave-to {
      opacity: 0;
    }
  }

  &__alert {
    position: absolute;
    inset: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    &__scrim {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
    }

    &__content {
      position: relative;
      width: 160px * $scale;
      background: #111;
      overflow: hidden;
      border-radius: 2px * $scale;
      color: white;

      box-shadow:
        0 2px * $scale 5px * $scale #000,
        0 -1px * $scale .5px * $scale -1px * $scale #000a inset;
    }

    &__title {
      font-size: 10px * $scale;
      color: #4dccff;
      line-height: 1;
      border-bottom: .5px * $scale solid #4dccff;
      padding: 8px * $scale;
      background: linear-gradient(#0005, transparent);
    }

    &__message {
      padding: 8px * $scale;
      font-size: 8px * $scale;
    }

    &__actions {
      display: flex;
      align-items: center;
      border-top: .5px * $scale solid #333;

      & > * {
        flex: 1;
        padding: 5px * $scale;
        border-right: 1px * $scale solid #333;
        font-size: 8px * $scale;
        text-align: center;

        &:last-child {
          border-right: none;
        }
      }
    }
  }
}
</style>