<template>
  <div :class="['home-screen', {
    'home-screen--menu-open': phone.isPath('menu'),
  }]">
    <img
      :src="game.getAsset('phone/background.png')?.content"
      class="home-screen__background"
    >

    <div class="home-screen__content">
      <div class="home-screen__appgrid">
        <ClockWidget style="grid-column: 1 / span 5; grid-row: 1 / span 2;"/>
        <AppIcon
          :iconSrc="game.getAsset('phone/Icon_Phone.webp')?.content"
          name="Lock"
          @click="phone.locked = true"
        />
        <AppIcon
          :iconSrc="game.getAsset('phone/Icon_Notes.webp')?.content"
          name="Memo"
          app="notes"
        />
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

        <!-- <svg
          class="home-screen__appbar__menu"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 88 88"
        >
          <circle cx="44" cy="44" r="41.5" stroke="currentColor" stroke-width="5"/>
          <path fill="currentColor" d="M21 31h8v8h-8zm19 0h8v8h-8zm19 0h8v8h-8zM21 51h8v8h-8zm19 0h8v8h-8zm19 0h8v8h-8z"/>
        </svg> -->

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
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { useMainClue } from '@/store/team/mainClue';
import AppIcon from './AppIcon.vue';
import ClockWidget from './ClockWidget.vue';

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

  &__content {
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
  }

  &__appgrid {
    flex: 1;
    display: grid;
    gap: 5px * $scale;
    padding: 5px * $scale;
    grid-template-columns: repeat(5, 1fr);
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
      color: #ddd;
      filter: drop-shadow(0 1px * $scale 1px * $scale #0009)drop-shadow(0 0 1px * $scale #0006);
    }
  }
}
</style>