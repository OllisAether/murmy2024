<template>
  <div :class="['clue-image-viewer', {
    'clue-image-viewer--main-clue-type': mainClueType
  }]">
    <!-- <div class="clue-image-viewer__tooltip">
      <div>
        <VIcon size="1.25rem">mdi-gesture-spread</VIcon>
        <span>
          Zoomen
        </span>
      </div>
      <div>
        <VIcon size="1.25rem">mdi-gesture-tap-hold</VIcon>
        <span>
          Halten, um Hinweis zu markieren
        </span>
      </div>
    </div> -->

    <VFadeTransition>
      <div
        v-if="progress > 0"
        :class="['clue-image-viewer__hold-indicator', {
          'clue-image-viewer__hold-indicator--nothing-found': nothingFound
        }]"
        :style="{
          '--progress': progress,
          '--x': holdPosition[0],
          '--y': holdPosition[1]
        }"
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" :r="progress * 32" fill="currentColor" opacity="0.15" />
          <circle cx="50" cy="50" r="35" fill="transparent" stroke="currentColor" stroke-width="1" />
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" opacity="0.3" stroke-width="4"
            stroke-dasharray="251.2"
            :style="{
              strokeDashoffset: 251.2 * (1 - progress),
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%'
            }"
          />
        </svg>
      </div>
    </VFadeTransition>

    <template v-if="pageCount > 1">
      <Btn
        :disabled="currentPage === 0"
        square
        @click="currentPage--"
        class="clue-image-viewer__prev-button"
      >
        <VIcon>mdi-chevron-left</VIcon>
      </Btn>
      <Btn
        :disabled="currentPage === pageCount - 1"
        square
        @click="currentPage++"
        class="clue-image-viewer__next-button"
      >
        <VIcon>mdi-chevron-right</VIcon>
      </Btn>
    </template>

    <div
      class="clue-image-viewer__canvas"
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
        class="clue-image-viewer__origin"
        v-if="rootWidth > 0 && rootHeight > 0"
      >
        <template v-if="assets.length > 0">
          <template v-for="(asset, index) in assets">
            <div
              :class="['clue-image-viewer__image-container', {
                'clue-image-viewer__image-container--current': index === currentPage,
                'clue-image-viewer__image-container--next': index === currentPage + 1,
                'clue-image-viewer__image-container--prev': index === currentPage - 1,
                'clue-image-viewer__image-container--transition-next': pageTransitionProgress < 0,
                'clue-image-viewer__image-container--transition-prev': pageTransitionProgress > 0
              }]"
              ref="images"
              v-show="index === currentPage || index === currentPage + 1 || index === currentPage - 1"
              :style="{
                '--scale': Math.min(
                  (rootHeight - 16 * 6) / asset.metadata.height,
                  (rootWidth - 16 * 6) / asset.metadata.width),
                '--canvasScale': scale,
                '--pageTransitionProgress': pageTransitionProgress,
                '--rootWidth': rootWidth + 'px',
              }"
            >
              <img :src="asset.content" />
              <Collectable
                disappear
                class="clue-image-viewer__collectable"
                v-for="(entry, i) in entries?.filter(e => (e.index !== undefined && e.index !== null) ? e.index === index : true)"
                :key="i"
                :entry="entry.entry"
                :style="{
                  'left': entry.rect.x * 100 + '%',
                  'top': entry.rect.y * 100 + '%',
                  'width': entry.rect.width * 100 + '%',
                  'height': entry.rect.height * 100 + '%',
                }"
              />
            </div>
          </template>
        </template>
        <template v-else-if="mainClueType">
          <div
            class="clue-image-viewer__image-container clue-image-viewer__image-container--main-clue-type"
            :style="{
              '--scale': mainClueTypeSize.width > 0 && mainClueTypeSize.height > 0 ? Math.min(
                (rootHeight - 16 * 6) / mainClueTypeSize.height,
                (rootWidth - 16 * 6) / mainClueTypeSize.width) : 1,
              '--canvasScale': scale,
              '--pageTransitionProgress': pageTransitionProgress,
              '--rootWidth': rootWidth + 'px',
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
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { ImageEntry } from '../../../shared/clue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Asset } from '@/../shared/asset';
import { useSwipe } from '@vueuse/core';
import Btn from '../Btn.vue';
import { useCollectables } from '@/store/collectables';
import Collectable from './Collectable.vue';
import { pages } from './diary/pages';
import { useMainClue } from '@/store/team/mainClue';

const props = defineProps<{
  assetIds?: string[]
  entries?: ImageEntry[],
  mainClueType?: 'phone' | 'diary' | null
}>()

const assets = computed<Asset[]>(() => {
  return (props.assetIds?.map(id => game.getAsset(id)).filter(x => x) as Asset[]) ?? [];
})

const diary = useMainClue();

const pageCount = computed(() => {
  return props.mainClueType === 'diary'
    ? (diary.locked ? 2 : pages.length)
    : assets.value.length;
})

const game = useGameManager();
const collectables = useCollectables();

const root = ref<HTMLElement | null>(null);
const images = ref<HTMLElement[]>([]);
const mainClueTypeContainer = ref<HTMLElement | null>(null);
const mainClueTypeSize = ref({ width: 0, height: 0 });
const currentElement = computed(() => {
  if (mainClueTypeContainer.value) {
    return mainClueTypeContainer.value;
  }

  return images.value[currentPage.value];
});

const currentPage = ref(props.mainClueType === 'diary' ? diary.page : 0);
watch(currentPage, (page) => {
  if (props.mainClueType === 'diary') {
    diary.page = page;
  }

  if (props.mainClueType === 'phone') {
    return;
  }

  if (page < 0) {
    currentPage.value = 0;
  } else if (page >= pageCount.value - 1) {
    currentPage.value = pageCount.value - 1;
  }

  atLeftEdgeAtStart = false;
  atRightEdgeAtStart = false;

  applyTransform(translate.value);
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

const scale = ref(1);
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

    scale.value = Math.min(5, Math.max(1, startScale.value * distance / startDistance.value))

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

const holdPosition = ref([0, 0]);
const progress = ref(0);
const holdDuration = 2000;
const holdDelay = 200;
// cubic ease in out
const progressEase = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
const nothingFound = ref(false);

function onPointerDown (e: PointerEvent) {
  let start = Date.now();

  holdPosition.value = [e.clientX - (root.value?.getBoundingClientRect().x ?? 0), e.clientY - (root.value?.getBoundingClientRect().y ?? 0)];
  nothingFound.value = false;

  let animation: number | null = null;
  async function counter () {
    progress.value = progressEase(Math.max(0, Math.min(1, (Date.now() - start - holdDelay) / holdDuration)))
    
    if (progress.value >= 1) {
      const success = collectables.markCollectableAt(e.clientX, e.clientY);

      if (!success) {
        nothingFound.value = true;
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      up();
      return;
    }
    
    animation = requestAnimationFrame(counter);
  }

  startTouchPos.value = {
    x: e.clientX,
    y: e.clientY
  }

  startPos.value = {
    x: translate.value.x,
    y: translate.value.y
  }

  startScale.value = scale.value

  counter();

  window.addEventListener('pointerup', up);
  window.addEventListener('pointermove', move);

  function up() {
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointermove', move);
    animation && cancelAnimationFrame(animation);
    progress.value = 0;
  }

  function move (e: PointerEvent) {
    const distance = Math.sqrt(Math.pow(e.clientX - startTouchPos.value.x, 2) + Math.pow(e.clientY - startTouchPos.value.y, 2));
  
    if (distance > threshold) {
      animation && cancelAnimationFrame(animation);
      progress.value = 0;
    }

    if (e.pointerType === 'touch') return

    if (/* props.mainClueType === 'phone' &&  */!(e.ctrlKey || e.metaKey)) {
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
    scale.value = Math.min(5, Math.max(1, scale.value - Math.min(e.deltaY, 50) / 100))
    
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
</script>

<style lang="scss" scoped>
.clue-image-viewer {
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
    z-index: 9999;
    position: absolute;
    top: calc(var(--y) * 1px);
    left: calc(var(--x) * 1px);
    transform: translate(-50%, -50%);
    width: fit-content;
    height: fit-content;
    pointer-events: none;

    mix-blend-mode: difference;
    filter: hue-rotate(180deg);

    svg {
      display: block;
      width: 10rem;
      height: 10rem;
    }

    &--nothing-found {
      mix-blend-mode: normal !important;
      filter: drop-shadow(0 0 0.5rem #000)hue-rotate(0);
      color: #A23946;
      animation: wiggle .3s forwards;
      animation-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);

      @keyframes wiggle {
        0% {
          transform: translateX(-1rem)translate(-50%, -50%);
        }
        20% {
          transform: translateX(0.95rem)translate(-50%, -50%);
        }
        40% {
          transform: translateX(-0.85rem)translate(-50%, -50%);
        }
        60% {
          transform: translateX(0.6rem)translate(-50%, -50%);
        }
        80% {
          transform: translateX(-0.30rem)translate(-50%, -50%);
        }
        100% {
          transform: translateX(0rem)translate(-50%, -50%);
        }
      }
    }
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
    transform: scale(var(--scale))translate(-50%, -50%);
    transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);

    will-change: transform;

    img {
      display: block;
      transition: filter .5s cubic-bezier(0.19, 1, 0.22, 1),
                  transform .5s cubic-bezier(0.19, 1, 0.22, 1);

      will-change: filter, transform;

    }

    &--next {
      z-index: -1;

      img {
        filter: brightness(0.7);
        transform: rotate(5deg)translate(1rem, -.5rem)scale(.95);
      }
    }

    &--prev {
      transform: translateX(calc(-0.5 * var(--rootWidth)))translateX(3rem)scale(var(--scale))scale(0.9)translate(-100%, -50%);
      
      img {
        filter: brightness(0.7);
      }
    }

    &--current.clue-image-viewer__image-container--transition-next,
    &--current.clue-image-viewer__image-container--transition-prev,
    &--prev.clue-image-viewer__image-container--transition-prev {
      img {
        transition: none;
        transform: translateX(calc(var(--pageTransitionProgress) * var(--rootWidth) / (var(--scale) * var(--canvasScale))));
      }
    }

    & > :deep(.clue-image-viewer__collectable) {
      position: absolute;
      z-index: 1;
      pointer-events: all;
    }
  }

  &__collectable__image {
    position: absolute;
    object-fit: cover;
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
}
</style>