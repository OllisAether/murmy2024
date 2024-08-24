<template>
  <div :class="['home-screen', {
    'home-screen--menu-open': phone.isPath('menu'),
  }]">
    <img
      :src="game.getAsset('phone/background.png')?.content"
      class="home-screen__background"
    >

    <Transition name="home-screen__appdrawer">
      <div class="home-screen__appdrawer" v-if="phone.isPath('menu')">
        <div class="home-screen__appdrawer__title">
          Apps
        </div>

        <div class="home-screen__appgrid">
          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Gallery.webp')?.content"
            name="Galerie"
            app="camera"
            :path="['gallery']"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Internet.webp')?.content"
            name="Internet"
            app="internet"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Camera.webp')?.content"
            name="Kamera"
            app="camera"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Contacts.webp')?.content"
            name="Kontakte"
            app="calls"
            :path="['contacts']"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Notes.webp')?.content"
            name="Memo"
            app="notes"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Minecraft.webp')?.content"
            name="Minecraft: Pocket Edition"
            crash
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_SMS.webp')?.content"
            name="Nachrichten"
            app="sms"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Pinterest.webp')?.content"
            name="Pinterest"
            app="pinterest"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_PlayStore.webp')?.content"
            name="Play Store"
            app="playstore"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Calculator.webp')?.content"
            name="Taschenrechner"
            app="calculator"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Phone.webp')?.content"
            name="Telefon"
            app="calls"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Clock.webp')?.content"
            name="Uhr"
            app="clock"
          />
        </div>
      </div>
    </Transition>

    <Transition name="home-screen__home">
      <div class="home-screen__home" v-if="!phone.isPath('menu')">
        <div class="home-screen__appgrid">
          <ClockWidget style="grid-column: 1 / span 4; grid-row: 2 / span 2"/>
          <GoogleWidget style="grid-column: 1 / span 4; grid-row: 1"/>
        </div>

        <div class="home-screen__appbar">
          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Phone.webp')?.content"
            app="calls"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Internet.webp')?.content"
            app="internet"
          />

          <button
            @click="phone.setPath('menu')"
            class="home-screen__appbar__menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 88 88"
            >
              <circle cx="44" cy="44" r="41.5" stroke="currentColor" stroke-width="5"/>
              <path fill="currentColor" d="M21 31h8v8h-8zm19 0h8v8h-8zm19 0h8v8h-8zM21 51h8v8h-8zm19 0h8v8h-8zm19 0h8v8h-8z"/>
            </svg>
          </button>

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_SMS.webp')?.content"
            app="sms"
          />

          <AppIcon
            :iconSrc="game.getAsset('phone/Icon_Camera.webp')?.content"
            app="camera"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { useMainClue } from '@/store/team/mainClue';
import AppIcon from './AppIcon.vue';
import ClockWidget from './ClockWidget.vue';
import GoogleWidget from './GoogleWidget.vue';

const phone = useMainClue();
const game = useGameManager();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.home-screen {
  &__background {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__home {
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;

    &-enter-active, &-leave-active {
      transition: opacity 0.3s;
    }

    &-enter-from, &-leave-to {
      opacity: 0;
    }
  }

  &__appdrawer {
    position: absolute;
    inset: 0;
    background: linear-gradient(#000e, #000d);

    display: flex;
    flex-direction: column;

    &__title {
      padding: 8px * $scale;
      border-bottom: 1px * $scale solid #4dccff;
      background: linear-gradient(#fff0, #a8e6ff11);
    }

    &-enter-active, &-leave-active {
      transition: opacity 0.3s, transform 0.3s;
    }

    &-enter-from, &-leave-to {
      opacity: 0;
      transform: translateY(10%);
    }
  }

  &__appgrid {
    flex: 1;
    display: grid;
    gap: 5px * $scale;
    padding: 5px * $scale;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
  }

  &__appbar {
    display: flex;
    align-items: center;
    padding: 8px * $scale 5px * $scale;
    gap: 5px * $scale;
    box-shadow: 0 1px * $scale 2px * $scale 2px * $scale #000,
                0 3px * $scale 1px * $scale -1px * $scale #fff4 inset;
    background: linear-gradient(#000a, #888);

    & > * {
      flex: 1;
    }

    &__menu {
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        display: block;
        width: 22px * $scale;
        height: 22px * $scale;
        color: #ddd;
        filter: drop-shadow(0 1px * $scale 1px * $scale #0009)drop-shadow(0 0 1px * $scale #0006);
      }
    }
  }
}
</style>