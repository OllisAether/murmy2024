<template>
  <div class="image-screen">
    <div class="image-screen__toolbar">
      <button @click="phone.popPath()" class="image-screen__back-btn">
        <VIcon>mdi-arrow-left</VIcon>
      </button>

      <div class="image-screen__title">
        {{ image?.date }}, {{ imageWidth }}x{{ imageHeight }}px
      </div>
    </div>
    <div class="image-screen__content" data-no-pan ref="container">
      <template
        v-for="(image, i) in gallery"
        :key="i"
      >
        <Transition :name="`image-screen__content__image-wrapper--${transitionType}`" mode="in-out">
          <div
            v-if="i === imageIndex"
            class="image-screen__content__image-wrapper"
            :style="{
              '--scale': Math.min(containerWidth / imageWidth, containerHeight / imageHeight),
              width: `calc(${imageWidth}px * var(--scale))`,
              height: `calc(${imageHeight}px * var(--scale))`,
            }"
          >
            <img
              class="image-screen__content__image"
              :src="game.getAsset(image?.assetId)?.content"
              ref="imageRefs"
            >

            <Collectable
              disappear
              class="image-screen__content__image-entry"
              v-for="(entry, i) in image?.entries"
              :key="i"
              :entryId="entry.entry.id"
              :style="{
                top: `${entry.rect.x * 100}%`,
                left: `${entry.rect.y * 100}%`,
                width: `${entry.rect.width * 100}%`,
                height: `${entry.rect.height * 100}%`
              }"
            />
          </div>
        </Transition>
      </template>
    </div>

    <div class="image-screen__images" ref="imagesPreview">
      <template
        v-for="(image, i) in gallery"
        :key="i"
      >
        <button
          :class="['image-screen__images__image', {
            'image-screen__images__image--active': i === imageIndex
          }]"
          @click="setIndex(i)"
        >
          <img :src="game.getAsset(image?.assetId)?.content">
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { useMainClue } from '@/store/team/mainClue';
import { gallery } from '../../../../../shared/assets/phone/gallery';
import { computed, onMounted, ref } from 'vue';
import Collectable from '../../../Collectable.vue';
import { useSwipe } from '@vueuse/core';
import { watch } from 'vue';
import { GalleryItem } from '../../../../../shared/phone/gallery';

const phone = useMainClue();
const game = useGameManager();

const imageIndex = computed(() => +phone.currentPath[phone.currentPath.length - 1]);
const image = computed<GalleryItem | undefined>(() => gallery[imageIndex.value]);

const imageRefs = ref<HTMLImageElement[]>([]);

const imageWidth = ref(game.getAsset(image.value?.assetId)?.metadata.width || 0);
const imageHeight = ref(game.getAsset(image.value?.assetId)?.metadata.height || 0);

const container = ref<HTMLDivElement | null>(null);

const containerWidth = ref(0);
const containerHeight = ref(0);

const transitionType = ref('next');
const swipe = useSwipe(container, {
  threshold: 100,
  onSwipeEnd: () => {
    if (swipe.direction.value === 'right') {
      const nextIndex = imageIndex.value - 1;

      if (nextIndex < 0) {
        return;
      }

      transitionType.value = 'prev';

      phone.popPath();
      phone.pushPath(nextIndex.toString());
    }

    if (swipe.direction.value === 'left') {
      const nextIndex = imageIndex.value + 1;

      if (nextIndex >= gallery.length) {
        return;
      }

      transitionType.value = 'next';

      phone.popPath();
      phone.pushPath(nextIndex.toString());
    }
  }
});

watch(imageRefs, () => {
  if (imageRefs.value.length) {
    imageWidth.value = imageRefs.value[0].naturalWidth;
    imageHeight.value = imageRefs.value[0].naturalHeight;
  }
}, { deep: true, immediate: true });

const imagesPreview = ref<HTMLDivElement | null>(null);
let scrollAnimationFrame: number | null = null;
watch(imageIndex, () => {
  if (imagesPreview.value) {
    const startLeft = imagesPreview.value.scrollLeft;
    const startTime = Date.now();

    function scrollUpdate () {
      if (!imagesPreview.value) {
        return;
      }

      const progress = Math.min((Date.now() - startTime) / 200, 1);
      const targetLeft = imageIndex.value * ((imagesPreview.value.querySelector('button')?.offsetWidth || 0) * 1.1);

      if (!imagesPreview.value) {
        return;
      }

      imagesPreview.value.scrollLeft = startLeft + (targetLeft - startLeft) * progress;

      if (progress < 1) {
        scrollAnimationFrame = requestAnimationFrame(scrollUpdate);
      }
    }

    if (scrollAnimationFrame) {
      cancelAnimationFrame(scrollAnimationFrame);
    }

    scrollAnimationFrame = requestAnimationFrame(scrollUpdate);
  }
});

function setIndex(index: number) {
  if (index === imageIndex.value) {
    return;
  }

  if (index > imageIndex.value) {
    transitionType.value = 'next';
  } else {
    transitionType.value = 'prev';
  }

  phone.popPath();
  phone.pushPath(index.toString());
}

onMounted(() => {
  if (container.value) {
    containerWidth.value = container.value.offsetWidth;
    containerHeight.value = container.value.offsetHeight;
  }

  if (imagesPreview.value) {
    imagesPreview.value.scrollTo({
      left: imageIndex.value * ((imagesPreview.value.querySelector('button')?.offsetWidth || 0) * 1.1),
      behavior: 'instant'
    });
  }
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.image-screen {
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
    z-index: 1;
    font-size: 8px * $scale;
    line-height: 1.2;
  }

  &__content {
    position: relative;
    height: 0;
    flex: 1;

    &__image {
      pointer-events: none;
      transform-origin: top left;
      transform: scale(var(--scale));
    }

    &__image-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      &--next {
        &-enter-active, &-leave-active {
          transition: transform .2s linear;
        }

        &-enter-from {
          transform: translate(-50%, -50%)translateX(calc(var(--phone-width) * $scale));
        }
        
        &-leave-to {
          transform: translate(-50%, -50%)translateX(calc(var(--phone-width) * -1 * $scale));
        }
      }

      &--prev {
        &-enter-active, &-leave-active {
          transition: transform .2s linear;
        }
        
        &-enter-from {
          transform: translate(-50%, -50%)translateX(calc(var(--phone-width) * -1 * $scale));
        }
        
        &-leave-to {
          transform: translate(-50%, -50%)translateX(calc(var(--phone-width) * $scale));
        }
      }
    }

    &__image-entry {
      position: absolute;
    }
  }

  &__images {
    display: flex;
    padding: 0 calc(50% - 10px * $scale);
    overflow: hidden;
    gap: 10%;

    &__image {
      flex-shrink: 0;
      display: block;
      width: 19px * $scale;
      height: 19px * $scale;
      opacity: .5;

      transition: opacity .2s linear;

      &--active {
        opacity: 1;
        border: 1px * $scale solid #fff;
      }

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