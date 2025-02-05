<template>
  <div class="viewfinder-screen">
    <div class="viewfinder-screen__toolbar">
      <VIcon>mdi-camera-metering-center</VIcon>
      <VIcon>mdi-flash-auto</VIcon>
      <VIcon>mdi-high-definition</VIcon>
      <VIcon>mdi-focus-auto</VIcon>
      <VIcon>mdi-cog</VIcon>
    </div>
    <div class="viewfinder-screen__viewfinder">
      <div class="viewfinder-screen__viewfinder__warning">
        Error code: 04400001<br>Camera error
      </div>
    </div>
    <div class="viewfinder-screen__bottombar">
      <VIcon>mdi-orbit-variant</VIcon>
      <div class="viewfinder-screen__captrue-btn">
        <VIcon>mdi-camera-iris</VIcon>
      </div>
      <button
        class="viewfinder-screen__gallery-btn"
        @click="phone.pushPath('gallery')"
      >
        <img :src="game.getAsset(gallery[0]?.assetId)?.content">
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { useMainClue } from '@/store/team/mainClue';
import { gallery } from '../../../../shared/assets/phone/gallery';

const phone = useMainClue();
const game = useGameManager();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.viewfinder-screen {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  height: 100%;
  color: #777;

  &__toolbar {
    display: flex;
    justify-content: space-between;
    height: 30px * $scale;
    padding: 0 10px * $scale;
    align-items: center;
    font-size: 10px * $scale;

    background: linear-gradient(#000, #0f1416);
    border-bottom: 1px * $scale solid #fff2;
  }

  &__viewfinder {
    position: relative;
    height: 0;
    flex: 1;
    background: #000;

    &__warning {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      font-size: 8px * $scale;
      color: #8b1f1f;
    }
  }

  &__bottombar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px * $scale;

    background: linear-gradient(#000, #0f1416);
    border-top: 1px * $scale solid #fff2;
  }

  &__captrue-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  
    background: linear-gradient(#444, #ccc);
    box-shadow:
      -.5px * $scale -.5px * $scale 1px * $scale #0008 inset,
      .5px * $scale .5px * $scale 1px * $scale #fff8 inset,
      0 1px * $scale 2px * $scale #000
    ;
    color: black;

    padding: 3px * $scale;
    border-radius: 50%;

    & > :deep(.v-icon) {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 1px * $scale;
      border-radius: 50%;
      width: 28px * $scale;
      height: 28px * $scale;
      border: 1px * $scale solid #000;
      box-shadow:
        -.3px * $scale -.3px * $scale 1px * $scale #0008,
        .3px * $scale .3px * $scale 1px * $scale #fff8,
        -.3px * $scale -.3px * $scale 1px * $scale #0008 inset,
        .3px * $scale .3px * $scale 1px * $scale #fff8 inset
      ;
      text-shadow:
        -.3px * $scale -.3px * $scale 1px * $scale #0008,
        .3px * $scale .3px * $scale 1px * $scale #fff8;
    }
  }

  &__gallery-btn {
    display: block;

    border: 1px * $scale solid #fff;
    box-shadow: 0 1px * $scale 2px * $scale #000;

    img {
      pointer-events: none;
      display: block;
      width: 22px * $scale;
      height: 22px * $scale;
      object-fit: cover;
    }
  }
}
</style>