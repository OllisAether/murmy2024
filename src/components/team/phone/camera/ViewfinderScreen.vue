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
        <img :src="game.getAsset('dokumente/VandalismusPost.jpg')?.content">
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { useMainClue } from '@/store/team/mainClue';

const phone = useMainClue();
const game = useGameManager();
</script>

<style lang="scss" scoped>
.viewfinder-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #777;

  &__toolbar {
    display: flex;
    justify-content: space-between;
    padding: .5rem 1rem;
    font-size: .5rem;

    background: linear-gradient(#000, #0f1416);
    border-bottom: 1px solid #fff2;
  }

  &__viewfinder {
    position: relative;
    flex: 1;
    background: #000;

    &__warning {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      text-align: center;
      font-size: .5rem;
      color: #8b1f1f;
    }
  }

  &__bottombar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .75rem 1rem;

    background: linear-gradient(#000, #0f1416);
    border-top: 1px solid #fff2;
  }

  &__captrue-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  
    background: linear-gradient(#444, #ccc);
    box-shadow:
      -.5px -.5px 1px #0008 inset,
      .5px .5px 1px #fff8 inset,
      0 1px 2px #000
    ;
    color: black;

    padding: .15rem;
    border-radius: 50%;

    & > :deep(.v-icon) {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: .1rem;
      border-radius: 50%;
      width: 1.8rem;
      height: 1.8rem;
      border: 1px solid #000;
      box-shadow:
        -.3px -.3px 1px #0008,
        .3px .3px 1px #fff8,
        -.3px -.3px 1px #0008 inset,
        .3px .3px 1px #fff8 inset
      ;
      text-shadow:
        -.3px -.3px 1px #0008,
        .3px .3px 1px #fff8;
    }
  }

  &__gallery-btn {
    display: block;

    border: 1px solid #fff;
    box-shadow: 0 1px 2px #000;

    img {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      object-fit: cover;
    }
  }
}
</style>