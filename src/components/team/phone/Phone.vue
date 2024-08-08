<template>
  <div class="phone">
    <div class="phone__screen" :style="{
      '--screen-door-opacity': Math.min(0.8, (zoomScale - 1) / 4),
    }">
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
            <CallsApp v-if="phone.currentApp === 'calls'" />
            <InternetApp v-else-if="phone.currentApp === 'internet'" />
            <CameraApp v-else-if="phone.currentApp === 'camera'" />
          </Transition>
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
import InternetApp from './internet/InternetApp.vue';
import CameraApp from './camera/CameraApp.vue';

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
$scale: 5;

.phone {
  position: relative;
  width: 213px * $scale;
  height: 418px * $scale;

  font-size: 12px;
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
    width: 180.5px;
    height: 320.5px;
    background: black;

    transform-origin: 0 0;
    transform: scale($scale);

    display: flex;
    flex-direction: column;
    will-change: transform;

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
    height: 12px;
    background: linear-gradient(#242424, #000000);
    font-size: 8px;
    color: white;

    & > div {
      display: flex;
      align-items: center;

      gap: 3px;
      padding: 0 3px;

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
    height: 20px;
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
        background-size: 80px 80px;
        background-position: center;
        background-repeat: no-repeat;
      }

      &--menu {
        pointer-events: none;
      }
    }

    &-enter-active, &-leave-active {
      transition: opacity 0.3s;
    }

    &-enter-to, &-leave-to {
      opacity: 0;
    }
  }
}
</style>