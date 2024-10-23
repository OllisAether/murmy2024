<template>
  <div :class="['clue-viewer', {
    'clue-viewer--main-clue-type': mainClueType,
    'clue-viewer--odd': currentPage % 2 === 0,
    'clue-viewer--book': book,
    'clue-viewer--swiping': pageTransitionProgress !== 0,
  }]">
    <template v-if="pageCount > 1">
      <Btn
        :disabled="currentPage === 0"
        square
        @click="currentPage--"
        class="clue-viewer__prev-button"
      >
        <VIcon>mdi-chevron-left</VIcon>
      </Btn>
      <Btn
        :disabled="currentPage === pageCount - 1"
        square
        @click="currentPage++"
        class="clue-viewer__next-button"
      >
        <VIcon>mdi-chevron-right</VIcon>
      </Btn>

      <div class="clue-viewer__dots">
        <div
          v-for="i in pageCount"
          :key="i"
          class="clue-viewer__dot"
          :class="{'clue-viewer__dot--active': (i - 1) === currentPage}"
        />

        <div class="clue-viewer__page-counter">
          {{ currentPage + 1 }} / {{ pageCount }}
        </div>
      </div>
    </template>

    <HoldIndicator
      :threshold="threshold"
      @holdend="onHoldEnd"
      class="clue-viewer__hold-indicator"
    >
      <div
        class="clue-viewer__canvas"
        ref="root"
        @touchstart="onTouchStartEnd"
        @touchend="onTouchStartEnd"
        @touchmove="onTouchMove"
        @pointerdown="onPointerDown"
        @wheel.prevent="onScroll"
        @contextmenu.prevent=""
      >
        <div
          :style="{
            transform: `translate(${translate.x}px, ${translate.y}px)scale(${scale})`
          }"
          class="clue-viewer__origin"
          v-if="rootWidth > 0 && rootHeight > 0"
        >
          <template v-if="assets.length > 0">
            <template v-if="book">
              <div
                class="clue-viewer__image-container clue-viewer__image-container--book"
                ref="bookContainer"
                :style="{
                  '--scale': Math.min(
                    (rootHeight - 16 * 6) / assets[0].metadata.height,
                    (rootWidth - 16 * 6) / assets[0].metadata.width),
                  '--canvasScale': scale,
                  '--pageTransitionProgress': pageTransitionProgress,
                  '--rootWidth': rootWidth + 'px',
                }"
              >
                <Book
                  :zoomScale="scale"
                  :currentPage="currentPage"
                  :pageTransitionProgress="pageTransitionProgress"
                  :pageAssets="assets"
                  :entries="entries"
                  :style="{
                    width: assets[0].metadata.width + 'px',
                    height: assets[0].metadata.height + 'px',
                  }"
                  filter
                />
              </div>
            </template>
            <template v-else>
              <template v-for="(asset, index) in [...assets].reverse()">
                <div
                  :class="['clue-viewer__image-container', {
                    'clue-viewer__image-container--current': (assets.length - index - 1) === currentPage,
                    'clue-viewer__image-container--next': (assets.length - index - 1) >= currentPage + 1,
                    'clue-viewer__image-container--prev': (assets.length - index - 1) <= currentPage - 1,
                    'clue-viewer__image-container--transition-next': pageTransitionProgress < 0 && ((assets.length - index - 1) === currentPage + 1 || (assets.length - index - 1) === currentPage),
                    'clue-viewer__image-container--transition-prev': pageTransitionProgress > 0 && ((assets.length - index - 1) === currentPage - 1 || (assets.length - index - 1) === currentPage),
                  }]"
                  v-show="(assets.length - index - 1) >= currentPage - 1"
                  ref="images"
                  :style="{
                    '--canvasScale': scale,
                    '--pageTransitionProgress': pageTransitionProgress,
                    '--rootWidth': rootWidth + 'px',
                    width: asset.metadata.width * Math.min(
                      (rootHeight - 16 * 6) / asset.metadata.height,
                      (rootWidth - 16 * 6) / asset.metadata.width) + 'px',
                    height: asset.metadata.height * Math.min(
                      (rootHeight - 16 * 6) / asset.metadata.height,
                      (rootWidth - 16 * 6) / asset.metadata.width) + 'px',
                  }"
                >
                <!-- v-show="index === currentPage || index === currentPage + 1 || index === currentPage - 1" -->
                  <img :src="asset.content" :style="{
                    '--imgScale': Math.min(
                      (rootHeight - 16 * 6) / asset.metadata.height,
                      (rootWidth - 16 * 6) / asset.metadata.width),
                  }">
                  <template
                    v-if="(assets.length - index - 1) === currentPage"
                  >
                    <template
                      v-for="(entry, i) in entries?.filter(e => (e.index !== undefined && e.index !== null) ? e.index === (assets.length - index - 1) : true)"
                      :key="i"
                    >
                      <Collectable
                        class="clue-viewer__collectable"
                        :highlight="isTutorialMarkEntry && tutorial.state.entryId === (entry.entryId ?? entry.entry?.id)"
                        v-if="entry.entryId ?? entry.entry?.id"
                        :entryId="(entry.entryId ?? entry.entry?.id)!"
                        :style="{
                          pointerEvents: tutorial.isTutorial && !(isTutorialMarkEntry && tutorial.state.entryId === (entry.entryId ?? entry.entry?.id)) ? 'none' : '',
                          'left': entry.rect.x * 100 + '%',
                          'top': entry.rect.y * 100 + '%',
                          'width': entry.rect.width * 100 + '%',
                          'height': entry.rect.height * 100 + '%',
                          transform: entry.rect.transform,
                        }"
                      />
                    </template>
                  </template>
                </div>
              </template>
            </template>
          </template>
          <template v-else-if="$slots.custom">
            <div
              class="clue-viewer__image-container clue-viewer__image-container--main-clue-type"
              :style="{
                '--scale': customSize.width > 0 && customSize.height > 0 ? Math.min(
                  (rootHeight - 16 * 6) / customSize.height,
                  (rootWidth - 16 * 6) / customSize.width) : 1,
                '--canvasScale': scale,
                '--pageTransitionProgress': pageTransitionProgress,
                '--rootWidth': rootWidth + 'px',
                '--rootHeight': rootHeight + 'px',
              }"
            >
              <div ref="customContainer">
                <slot name="custom"
                  :zoomScale="scale"
                  :pageCount="pageCount"
                  :currentPage="currentPage"
                  :pageTransitionProgress="pageTransitionProgress"
                />
              </div>
            </div>
          </template>
          <template v-else-if="mainClueType">
            <div
              class="clue-viewer__image-container clue-viewer__image-container--main-clue-type"
              :style="{
                '--scale': mainClueTypeSize.width > 0 && mainClueTypeSize.height > 0 ? Math.min(
                  (rootHeight - 16 * 6) / mainClueTypeSize.height,
                  (rootWidth - 16 * 6) / mainClueTypeSize.width) : 1,
                '--canvasScale': scale,
                '--pageTransitionProgress': pageTransitionProgress,
                '--rootWidth': rootWidth + 'px',
                '--rootHeight': rootHeight + 'px',
              }"
            >
              <div ref="mainClueTypeContainer">
                <slot name="main-clue-type"
                  :zoomScale="scale"
                  :currentPage="currentPage"
                  :pageTransitionProgress="pageTransitionProgress"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </HoldIndicator>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { ImageEntry } from '../../../shared/clue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { Asset } from '@/../shared/asset';
import { useSwipe } from '@vueuse/core';
import Btn from '../Btn.vue';
import Collectable from '../Collectable.vue';
import { pages } from './diary/pages';
import { useMainClue } from '@/store/team/mainClue';
import HoldIndicator from './HoldIndicator.vue';
import { useTutorial } from '@/store/team/tutorial';
import Book from './Book.vue';

const props = defineProps<{
  assetIds?: string[]
  entries?: ImageEntry[],
  book?: boolean,
  mainClueType?: 'phone' | 'diary' | null
}>()

const slots = useSlots();

const assets = computed<Asset[]>(() => {
  return (props.assetIds?.map(id => game.getAsset(id)).filter(x => x) as Asset[]) ?? [];
})

const diary = useMainClue();

const customPageCount = ref(1);
const pageCount = computed({
  get: () => {
    if (slots.custom) {
      return customPageCount.value;
    }

    if (props.mainClueType === 'diary') {
      return (diary.locked ? 2 : pages.length)
    }

    if (props.mainClueType === 'phone') {
      return 1;
    }

    return assets.value.length;
  },
  set: (value) => {
    customPageCount.value = value;
  }
})

const game = useGameManager();

const root = ref<HTMLElement | null>(null);
const images = ref<HTMLElement[]>([]);
const bookContainer = ref<HTMLElement | null>(null);
const mainClueTypeContainer = ref<HTMLElement | null>(null);
const mainClueTypeSize = ref({ width: 0, height: 0 });

const customContainer = ref<HTMLElement | null>(null);
const customSize = ref({ width: 0, height: 0 });

const currentElement = computed(() => {
  if (customContainer.value) {
    return customContainer.value;
  }

  if (bookContainer.value) {
    return bookContainer.value;
  }

  if (mainClueTypeContainer.value) {
    return mainClueTypeContainer.value;
  }

  return images.value[currentPage.value];
});

const currentPage = ref(props.mainClueType === 'diary' ? diary.page : 0);
watch(currentPage, (page) => {
  if (props.mainClueType === 'phone') {
    return;
  }

  if (page < 0) {
    currentPage.value = 0;
  } else if (page >= pageCount.value - 1) {
    currentPage.value = pageCount.value - 1;
  }

  if (props.mainClueType === 'diary') {
    diary.page = page;
  }

  atLeftEdgeAtStart = false;
  atRightEdgeAtStart = false;

  applyTransform(translate.value);
})

watch(() => diary.page, (page) => {
  if (props.mainClueType === 'diary') {
    currentPage.value = page;
  }
})

const rootWidth = ref(0);
const rootHeight = ref(0);

onMounted(() => {
  const rootObserver = new ResizeObserver(() => {
    rootWidth.value = root.value?.clientWidth ?? 0;
    rootHeight.value = root.value?.clientHeight ?? 0;
  });

  rootObserver.observe(root.value!);

  onBeforeUnmount(() => {
    rootObserver.disconnect();
  });
})

const mainClueTypeObserver = new ResizeObserver(() => {
  mainClueTypeSize.value = {
    width: mainClueTypeContainer.value?.offsetWidth ?? 0,
    height: mainClueTypeContainer.value?.offsetHeight ?? 0
  }
});

onBeforeUnmount(() => {
  mainClueTypeObserver.disconnect();
});

watch(mainClueTypeContainer, (el) => {
  if (el) {
    mainClueTypeObserver.observe(el);
  }
})

const customObserver = new ResizeObserver(() => {
  customSize.value = {
    width: customContainer.value?.offsetWidth ?? 0,
    height: customContainer.value?.offsetHeight ?? 0
  }
});

onBeforeUnmount(() => {
  customObserver.disconnect();
});

watch(customContainer, (el) => {
  if (el) {
    customObserver.observe(el);
  }
})

const scale = ref(1);
const maxScale = 5;
const translate = ref({ x: 0, y: 0 });

const startPos = ref({ x: 0, y: 0 })
const startScale = ref(1)
const startTouchPos = ref({ x: 0, y: 0 })
const startDistance = ref(0)
const threshold = 20;
let thresholdExceeded = false;

const atRightEdge = ref(false);
const atLeftEdge = ref(false);
function applyTransform (composedTranslate: { x: number, y: number }) {
  nextTick(() => {
    const rootRect = root.value!.getBoundingClientRect()

    const imgRect = currentElement.value.getBoundingClientRect()

    const yMin = Math.min(0, (rootRect.height - imgRect.height) / 2) + 16 * 6 * (1 - scale.value)
    const yMax = Math.max(0, -(rootRect.height - imgRect.height) / 2) - 16 * 6 * (1 - scale.value)

    const xMin = Math.min(0, (rootRect.width - imgRect.width) / 2) + 16 * 6 * (1 - scale.value)
    const xMax = Math.max(0, -(rootRect.width - imgRect.width) / 2) - 16 * 6 * (1 - scale.value)

    translate.value = {
      x: Math.min(xMax, Math.max(xMin, composedTranslate.x)),
      y: Math.min(yMax, Math.max(yMin, composedTranslate.y))
    }

    atRightEdge.value = translate.value.x === xMax
    atLeftEdge.value = translate.value.x === xMin
  })
}

function onTouchStartEnd (e: TouchEvent) {
  startPos.value = {
    x: translate.value.x,
    y: translate.value.y
  }
  startScale.value = scale.value

  thresholdExceeded = false;

  if (e.touches.length === 2) {
    startTouchPos.value = {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2
    }
    startDistance.value = Math.sqrt(
      Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
      Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
    )
  } else if (e.touches.length === 1) {
    startTouchPos.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }
}

function onTouchMove (e: TouchEvent) {
  if (root.value === null) return

  const rootRect = root.value.getBoundingClientRect()
  let composedTranslate = { x: 0, y: 0 }

  if (e.touches.length === 2) {
    oneFinger = false
    pageTransitionProgress.value = 0;

    const touchOrigin = {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2
    }

    const distance = Math.sqrt(
      Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
      Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
    )

    const touchRelToTransformOrigin = {
      x: startTouchPos.value.x - rootRect.left - rootRect.width / 2 - startPos.value.x,
      y: startTouchPos.value.y - rootRect.top - rootRect.height / 2 - startPos.value.y
    }

    scale.value = Math.min(maxScale, Math.max(1, startScale.value * distance / startDistance.value))

    composedTranslate = {
      x: startPos.value.x + (touchOrigin.x - startTouchPos.value.x) - touchRelToTransformOrigin.x * (scale.value - startScale.value) / startScale.value,
      y: startPos.value.y + (touchOrigin.y - startTouchPos.value.y) - touchRelToTransformOrigin.y * (scale.value - startScale.value) / startScale.value
    }
  } else if (e.touches.length === 1) {
    // if (props.mainClueType === 'phone') {
    //   return;
    // }

    let path = e.composedPath();
    path = path.slice(0, path.indexOf(root.value!) + 1);

    if (path.some((el) => {
      if (el instanceof HTMLElement) {
        return el.hasAttribute('data-no-pan');
      }
    })) {
      return;
    }

    const distance = Math.sqrt(Math.pow(e.touches[0].clientX - startTouchPos.value.x, 2) + Math.pow(e.touches[0].clientY - startTouchPos.value.y, 2));

    if (distance < threshold && !thresholdExceeded) {
      return;
    }

    thresholdExceeded = true;

    composedTranslate = {
      x: startPos.value.x + e.touches[0].clientX - startTouchPos.value.x,
      y: startPos.value.y + e.touches[0].clientY - startTouchPos.value.y
    }
  }

  applyTransform(composedTranslate)
}

function onHoldEnd () {
  up();
}

function onPointerDown (e: PointerEvent) {
  startTouchPos.value = {
    x: e.clientX,
    y: e.clientY
  }

  startPos.value = {
    x: translate.value.x,
    y: translate.value.y
  }

  startScale.value = scale.value

  window.addEventListener('pointerup', up);
  window.addEventListener('pointermove', move);
}

function up() {
  window.removeEventListener('pointerup', up);
  window.removeEventListener('pointermove', move);
}

function move (e: PointerEvent) {

  if (e.pointerType === 'touch') return

  if (!(e.ctrlKey || e.metaKey)) {
    return;
  }

  let path = e.composedPath();
  path = path.slice(0, path.indexOf(root.value!) + 1);

  if (path.some((el) => {
    if (el instanceof HTMLElement) {
      return el.hasAttribute('data-no-pan');
    }
  })) {
    up();
    return;
  }

  const composedTranslate = {
    x: startPos.value.x + e.clientX - startTouchPos.value.x,
    y: startPos.value.y + e.clientY - startTouchPos.value.y
  }

  applyTransform(composedTranslate)
}

function onScroll (e: WheelEvent) {
  if (root.value === null) return

  const rootRect = root.value.getBoundingClientRect()
  let composedTranslate = { x: 0, y: 0 }
  if (!e.ctrlKey) {
    e.preventDefault()

    composedTranslate = {
      x: translate.value.x - e.deltaX,
      y: translate.value.y - e.deltaY
    }
  } else {
    const startScale = scale.value
    scale.value = Math.min(maxScale, Math.max(1, scale.value - Math.min(e.deltaY, 50) / 100))
    
    const mouseRelToTransformOrigin = {
      x: e.clientX - rootRect.left - rootRect.width / 2 - translate.value.x,
      y: e.clientY - rootRect.top - rootRect.height / 2 - translate.value.y
    }
    
    composedTranslate = {
      x: translate.value.x - (mouseRelToTransformOrigin.x * (scale.value - startScale) / startScale),
      y: translate.value.y - (mouseRelToTransformOrigin.y * (scale.value - startScale) / startScale)
    }
  }

  applyTransform(composedTranslate)
}

let atLeftEdgeAtStart = false;
let atRightEdgeAtStart = false;
let swiped = false;
let oneFinger = false;
const swipe = useSwipe(root, {
  threshold,
  onSwipeStart: (e) => {
    atLeftEdgeAtStart = atLeftEdge.value;
    atRightEdgeAtStart = atRightEdge.value;
    swiped = false;

    if (e.touches.length === 1) {
      oneFinger = true;
    }
  },
  onSwipe: () => {
    if (swiped) {
      return;
    }

    if (!oneFinger) {
      return;
    }

    if (props.mainClueType === 'phone') {
      return;
    }

    if ((atLeftEdgeAtStart && atLeftEdge.value && swipe.direction.value === 'left') ||
        (atRightEdgeAtStart && atRightEdge.value && swipe.direction.value === 'right')) {

      if ((currentPage.value === 0 && swipe.direction.value === 'right') ||
        (currentPage.value === pageCount.value - 1 && swipe.direction.value === 'left')) {
        pageTransitionProgress.value = -swipe.lengthX.value / rootWidth.value / 10;
        return;
      }

      pageTransitionProgress.value = -swipe.lengthX.value / rootWidth.value;

      if (Math.abs(swipe.lengthX.value) < 100) {
        return
      }

      if (Math.abs(swipe.lengthX.value) > rootWidth.value / 2) {
        if (swipe.direction.value === 'left') {
          currentPage.value++;
        } else {
          currentPage.value--;
        }
        swiped = true;
        pageTransitionProgress.value = 0;
      }
    }
  },
  onSwipeEnd: () => {
    pageTransitionProgress.value = 0;
  }
})

const pageTransitionProgress = ref(0);
watch(swipe.isSwiping, (isSwiping) => {
  if (isSwiping || swiped || !oneFinger) {
    return;
  }

  if (Math.abs(swipe.lengthX.value) < 100) {
    return
  }

  if (swipe.direction.value === 'left' && atLeftEdge.value && atLeftEdgeAtStart) {
    currentPage.value++;
  } else if (swipe.direction.value === 'right' && atRightEdge.value && atRightEdgeAtStart) {
    currentPage.value--;
  }
})

// #region Tutorial
const tutorial = useTutorial()
const isTutorialMarkEntry = computed(() => tutorial.state.action === 'markEntry');
// #endregion
</script>

<style lang="scss" scoped>
.clue-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: none;

  &__canvas {
    position: relative;

    width: 100%;
    height: 100%;

    overflow: hidden;

    -webkit-mask-image: linear-gradient(transparent, black 2rem, black calc(100% - 2rem), transparent);
    mask-image: linear-gradient(transparent, black 2rem, black calc(100% - 2rem), transparent);
  }

  &__hold-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__origin {
    position: absolute;

    top: 50%;
    left: 50%;
    width: 0;
    height: 0;

    transform-origin: center;
  }

  &__image-container {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    transform-origin: top left;
    width: min-content;
    height: min-content;
    transform: scale(var(--scale, 1))translate(-50%, -50%);
    transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);

    will-change: transform;

    img {
      transform-origin: top left;
      display: block;
      transform: scale(var(--imgScale, 1));
      transition: filter 1s cubic-bezier(0.19, 1, 0.22, 1),
                  transform 1s cubic-bezier(0.19, 1, 0.22, 1);

      will-change: filter, transform;
    }

    &--next {
      img {
        filter: brightness(0.7)drop-shadow(0 0 2rem #0007);
        transform: scale(var(--imgScale, 1))rotate(2deg)translate(1.5rem, 1rem)scale(.99);
      }
    }

    &--prev {
      transform: translateX(calc(-0.5 * var(--rootWidth)))translateX(3rem)scale(var(--scale, 1))scale(0.9)translate(-100%, -50%);
      
      img {
        filter: brightness(0.7)drop-shadow(0 0 2rem #0007);
      }
    }
    
    &--current {
      filter: drop-shadow(0 0 2rem #0007);
    }

    &--current.clue-viewer__image-container--transition-next,
    &--current.clue-viewer__image-container--transition-prev,
    &--prev.clue-viewer__image-container--transition-prev {
      img {
        transition: none;
        transform: scale(var(--imgScale, 1))translateX(calc(var(--pageTransitionProgress) * var(--rootWidth) / var(--canvasScale)));
      }
    }

    & > :deep(.clue-viewer__collectable) {
      position: absolute;
      z-index: 1;
      pointer-events: all;
    }
  }
  
  &__next-button {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    z-index: 99;
  }

  &__prev-button {
    position: absolute;
    top: 50%;
    left: 3rem;
    transform: translateY(-50%);
    z-index: 99;
  }

  &__dots {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: .5rem;
    align-items: center;
  }

  &__dot {
    width: .4rem;
    height: .4rem;
    border-radius: 50%;
    background-color: #fff;
    opacity: 0.2;
    transition: opacity .5s cubic-bezier(0.19, 1, 0.22, 1);

    &--active {
      opacity: 1;
    }
  }

  &__page-counter {
    color: #fff8;
    font-size: .8rem;
  }
}
</style>