<template>
  <button :class="['database-entry', {
    'database-entry--has-image': !!entry.image
  }]" ref="root">
    <div class="database-entry__content">
      <div class="database-entry__title">
        {{ entry.title }}
      </div>
      <div v-if="entry.description" class="database-entry__description">
        {{ entry.description }}
      </div>
    </div>

    <div
      v-if="entry.image"
      class="database-entry__image"
      :style="{
        aspectRatio: entry.image.imageCrop ? `${
          (entry.image.imageCrop.width * game.getAsset(entry.image.imageAssetId)?.metadata.width) /
          (entry.image.imageCrop.height * game.getAsset(entry.image.imageAssetId)?.metadata.height)}` : undefined
      }"
    >
      <img
        :src="game.getAsset(entry.image.imageAssetId)?.content"
        :style="entry.image.imageCrop ? {
          position: 'absolute',
          top: `${-entry.image.imageCrop.y * 100 * 1 / entry.image.imageCrop.height}%`,
          left: `${-entry.image.imageCrop.x * 100 * 1 / entry.image.imageCrop.width}%`,
          width: `${1 / entry.image.imageCrop.width * 100}%`,
          height: `${1 / entry.image.imageCrop.height * 100}%`,
          objectFit: 'fill',
        } : {}"
      />
    </div>

    <VIcon class="database-entry__fullscreen-icon">mdi-fullscreen</VIcon>

    <VDialog v-model="dialog" activator="parent" width="fit-content">
      <div class="database-entry__overlay">
        <div class="database-entry__overlay__content">
          <div class="database-entry__overlay__title">
            {{ entry.title }}
          </div>
          <div class="database-entry__overlay__description">
            {{ entry.description }}
          </div>
        </div>

        <div
          v-if="entry.image"
          class="database-entry__overlay__image"
          :style="{
            aspectRatio: entry.image.imageCrop ? `${
              (entry.image.imageCrop.width * game.getAsset(entry.image.imageAssetId)?.metadata.width) /
              (entry.image.imageCrop.height * game.getAsset(entry.image.imageAssetId)?.metadata.height)}` : undefined
          }"
        >
          <img
            :src="game.getAsset(entry.image.imageAssetId)?.content"
            :style="entry.image.imageCrop ? {
              position: 'absolute',
              top: `${-entry.image.imageCrop.y * 100 * 1 / entry.image.imageCrop.height}%`,
              left: `${-entry.image.imageCrop.x * 100 * 1 / entry.image.imageCrop.width}%`,
              width: `${1 / entry.image.imageCrop.width * 100}%`,
              height: `${1 / entry.image.imageCrop.height * 100}%`,
              objectFit: 'fill',
            } : {}"
          />
        </div>

        <Btn
          class="database-entry__overlay__close"
          square
          color="#A23946"
          @click="dialog = false"
        >
          <VIcon>mdi-close</VIcon>
        </Btn>
      </div>
    </VDialog>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Entry } from '../../../shared/suspectDatabase/entry'
import { useGameManager } from '@/store/gameManager';
import Btn from '../Btn.vue';

const game = useGameManager()

defineProps<{
  entry: Entry
}>()

const dialog = ref(false)

const root = ref<HTMLDivElement | null>(null)
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.database-entry {
  width: -webkit-fill-available;
  width: stretch;
  text-align: left;

  position: relative;
  background: #BCD1F111;
  border: 1px solid #fff1;
  border-radius: 1rem;
  margin: 0 1rem .5rem;

  -webkit-backdrop-filter: blur(.5rem);
  backdrop-filter: blur(.5rem);

  display: flex;
  align-items: stretch;
  padding: .5rem;

  &__content {
    z-index: 1;
    padding: 0 .5rem;
    flex: 1 1 auto;
    width: 0;

    display: flex;
    flex-direction: column;
  }

  &__title {
    padding: .5rem 0 .1rem;
    font-family: $fontHeading;
    font-size: 1.2rem;
  }

  &__description {
    height: 0;
    flex: 1 1 auto;

    min-height: 1.5rem;

    color: #fff8;
    line-height: 1rem;

    font-size: .8rem;
    mask-image: linear-gradient(to top, transparent, black 1rem);
    hyphens: auto;
    overflow: hidden;
  }

  &__image, &__overlay__image {
    z-index: 1;
    grid-row: 1 / span 2;
    grid-column: 2;

    position: relative;
    width: 5rem;
    height: fit-content;
    overflow: hidden;
    border-radius: .5rem;

    img {
      display: block;
      pointer-events: none;
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  }

  &__fullscreen-icon {
    z-index: 1;
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    color: #fff8;
    font-size: 1.5rem;
    
    .database-entry--has-image & {
      color: #fff;
      text-shadow: 0 0 .3srem #000;
    }
  }

  &__overlay {
    position: relative;
    width: 70vw;

    display: flex;
    flex-direction: row;
    // align-items: center;
    padding: 1rem 1rem 1rem 2rem;
    gap: 1rem;

    background: #1f212299;
    border: 3px solid #fff2;
    border-radius: 2rem;

    -webkit-backdrop-filter: blur(3rem);
    backdrop-filter: blur(3rem);

    &__close {
      z-index: 1;
      position: absolute;
      bottom: calc(100% - 1.5rem);
      right: -2.5rem;
    }

    &__box {
      position: absolute;
      inset: 0;
    }

    &__content {
      z-index: 1;
      flex: 1 1 auto;
      width: 0;
      font-size: 1.2rem;
      padding: 1rem 0;

      display: flex;
      flex-direction: column;
    }

    &__title {
      font-family: $fontHeading;
      font-size: 2rem;
    }

    &__description {
      color: #fff8;
      hyphens: auto;
    }

    &__image {
      width: 20vw;
      border-radius: 1rem;
    }
  }
}
</style>