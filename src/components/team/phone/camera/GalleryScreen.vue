<template>
  <div v-if="phone.isPath('gallery')" class="gallery-screen">
    <div class="gallery-screen__toolbar">
      <button @click="phone.popPath()" class="gallery-screen__back-btn">
        <VIcon>mdi-arrow-left</VIcon>
      </button>

      <div class="gallery-screen__title">
        Gallerie
      </div>
    </div>
    <ScrollView class="gallery-screen__content">
      <div class="gallery-screen__grid">
        <button
          class="gallery-screen__grid__item"
          v-for="(item, i) in gallery"
          :key="i"
          @click="phone.pushPath(i.toString())"
        >
          <img :src="game.getAsset(item.assetId)?.content" />
        </button>
      </div>
    </ScrollView>
  </div>
  <ImageScreen v-else />
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { useMainClue } from '@/store/team/mainClue';
import { gallery } from '../../../../../shared/assets/phone/gallery';
import ScrollView from '../ScrollView.vue';
import ImageScreen from './ImageScreen.vue';

const phone = useMainClue();
const game = useGameManager();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.gallery-screen {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  height: 100%;
  color: #777;

  &__toolbar {
    display: flex;
    align-items: center;
    // gap: 10px * $scale;
    height: 30px * $scale;

    background: linear-gradient(#000, #0f1416);
    border-bottom: 1px * $scale solid #fff2;
  }

  &__back-btn {
    font-size: 8px * $scale;
    width: 30px * $scale;
    height: 100%;
  }

  &__title {
    font-size: 10px * $scale;
  }

  &__content {
    height: 0;
    flex: 1;
  }

  &__grid {
    background: #000;

    display: grid;
    grid-template-columns: repeat(5, 1fr);

    &__item {
      position: relative;
      aspect-ratio: 1;

      img {
        pointer-events: none;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>