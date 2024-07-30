<template>
  <div class="clue-image-viewer" ref="root" @pointerdown="down">
    <div class="clue-image-viewer__tooltip">
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
    </div>

    <div class="clue-image-viewer__canvas">
      <VFadeTransition>
        <div
          v-if="progress > 0"
          :class="['clue-image-viewer__canvas__hold-indicator', {
            'clue-image-viewer__canvas__hold-indicator--nothing-found': nothingFound
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

      <div
        :style="{
          transform: `translate(${offsetX}px, ${offsetY}px)scale(${scale})`
        }"
        class="clue-image-viewer__origin"
      >
        <div
          class="clue-image-viewer__image-container"
          v-for="asset in assets"
          ref="images"
          :style="{
            transform: `scale(${Math.min(
              (rootHeight - 16 * 6) / asset.metadata?.height,
              (rootWidth - 16 * 6) / asset.metadata?.width)
            })translate(-50%, -50%)`
          }"
        >
          <img :src="asset.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { ImageEntry } from '../../../shared/clue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Asset } from '@/model/asset';
import { useDrag, usePinch } from '@vueuse/gesture';

const props = defineProps<{
  assetIds?: string[]
  entries?: ImageEntry[]
}>()

const assets = computed<Asset[]>(() => {
  return (props.assetIds?.map(id => game.getAsset(id)).filter(x => x) as Asset[]) ?? [];
})

const game = useGameManager();
const root = ref<HTMLElement | null>(null);
const images = ref<HTMLElement[]>([]);

const currentPage = ref(0);

const rootWidth = ref(0);
const rootHeight = ref(0);

onMounted(() => {
  const observer = new ResizeObserver(() => {
    rootWidth.value = root.value?.clientWidth ?? 0;
    rootHeight.value = root.value?.clientHeight ?? 0;
  });

  observer.observe(root.value!);

  onBeforeUnmount(() => {
    observer.disconnect();
  });
})

let startDistance: number = 0;
let startScale: number = 1;
let startOrigin: number[] = [0, 0];
let startOffset: number[] = [0, 0];

const holdPosition = ref([0, 0]);
const progress = ref(0);
const holdDuration = 2000;
const holdDelay = 200;
// cubic ease in out
const progressEase = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
const nothingFound = ref(false);
function down(event: PointerEvent) {
  event.preventDefault();

  let start = Date.now();

  holdPosition.value = [event.clientX - (root.value?.getBoundingClientRect().x ?? 0), event.clientY - (root.value?.getBoundingClientRect().y ?? 0)];
  nothingFound.value = false;

  let animation: number | null = null;
  async function counter () {
    progress.value = progressEase(Math.max(0, Math.min(1, (Date.now() - start - holdDelay) / holdDuration)))

    if (progress.value >= 1) {
      const success = checkHold(event.clientX, event.clientY);

      if (!success) {
        nothingFound.value = true;
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      up();
      return;
    }

    animation = requestAnimationFrame(counter);
  }

  counter();

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  
  let startX = event.clientX;
  let startY = event.clientY;
  function move (event: PointerEvent) {
    const distance = Math.sqrt(Math.pow(event.clientX - startX, 2) + Math.pow(event.clientY - startY, 2));

    if (distance > 20) {
      up();
    }
  }

  function up() {
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointermove', move);
    animation && cancelAnimationFrame(animation);
    progress.value = 0;
  }
}

function checkHold(x: number, y: number) {
  const imageRect = images.value[currentPage.value].getBoundingClientRect();

  const imageX = (x - imageRect.x) / imageRect.width;
  const imageY = (y - imageRect.y) / imageRect.height;

  const entries = (props.entries?.filter(entry => 
    entry.index === currentPage.value &&
    !game.database?.entries?.some(e => e.matterId === entry.entry.matterId) &&
    entry.rect.x <= imageX && entry.rect.x + entry.rect.width >= imageX &&
    entry.rect.y <= imageY && entry.rect.y + entry.rect.height >= imageY
  ) ?? []).map(entry => entry.entry);

  if (entries.length === 0) {
    return false;
  }

  entries.forEach(entry => {
    game.addDatabaseEntry(entry);
  })

  return true;
}

let stopDrag = false
useDrag(({ last, first, movement }) => {
  if (pinching) {
    stopDrag = true;
    return;
  }
  if (last) {
    stopDrag = false;
    return;
  }
  if (stopDrag) {
    return;
  }

  if (first) {
    startOffset = [offsetX.value, offsetY.value];
    startOrigin = movement;
    return
  }

  offsetX.value = Math.min(rootWidth.value * scale.value / 2, Math.max(-rootWidth.value * scale.value / 2, startOffset[0] + movement[0] - startOrigin[0]));
  offsetY.value = Math.min(rootHeight.value * scale.value / 2, Math.max(-rootHeight.value * scale.value / 2, startOffset[1] + movement[1] - startOrigin[1]));
}, {
  domTarget: root,
  threshold: 20,
  eventOptions: {
    passive: false
  }
})

let pinching = false;
usePinch(({ da, first, origin, last }) => {
  if (first) {
    startDistance = da[0];
    startScale = scale.value;
    startOrigin = origin;
    startOffset = [offsetX.value, offsetY.value];
    pinching = true;
    return
  }

  scale.value = Math.min(5, Math.max(0.5, startScale * da[0] / startDistance));
  offsetX.value = Math.min(rootWidth.value * scale.value / 2, Math.max(-rootWidth.value * scale.value / 2, startOffset[0] + origin[0] - startOrigin[0]));
  offsetY.value = Math.min(rootHeight.value * scale.value / 2, Math.max(-rootHeight.value * scale.value / 2, startOffset[1] + origin[1] - startOrigin[1]));


  // const rootOffset = [
  //   root.value?.clientLeft ?? 0,
  //   root.value?.clientTop ?? 0,
  // ]

  // const touchRelToTransformOrigin = [
  //   origin[0] - rootOffset[0] - rootWidth.value / 2 - startOffset[0],
  //   origin[1] - rootOffset[1] - rootHeight.value / 2 - startOffset[1]
  // ]
  
  // offsetX.value = Math.min(rootWidth.value * scale.value / 2, Math.max(-rootWidth.value * scale.value / 2, startOffset[0] + (origin[0] - startOrigin[0]) - touchRelToTransformOrigin[0] * (scale.value - startScale) / startScale));
  // offsetY.value = Math.min(rootHeight.value * scale.value / 2, Math.max(-rootHeight.value * scale.value / 2, startOffset[1] + (origin[1] - startOrigin[1]) - touchRelToTransformOrigin[1] * (scale.value - startScale) / startScale));

  if (last) {
    pinching = false;
  }
}, {
  domTarget: root,
  eventOptions: {
    passive: false
  }
})

const scale = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
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

    &__hold-indicator {
      z-index: 9999;
      position: absolute;
      top: calc(var(--y) * 1px);
      left: calc(var(--x) * 1px);
      transform: translate(-50%, -50%);
      width: fit-content;
      height: fit-content;

      mix-blend-mode: difference;
      filter: hue-rotate(180deg);

      svg {
        display: block;
        width: 10rem;
        height: 10rem;
      }

      &--nothing-found {
        mix-blend-mode: normal;
        filter: drop-shadow(0 0 0.5rem #000);
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
  }

  &__tooltip {
    position: absolute;
    top: -1.5rem;
    left: 1.7rem;
    font-size: 0.8rem;
    line-height: 1.25;

    display: flex;
    flex-direction: row;
    gap: 0.5rem;

    text-align: left;
    opacity: 0.5;

    div {
      display: flex;
      align-items: center;
      gap: 0.5rem;
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
  pointer-events: none;
    transform-origin: top left;
    width: min-content;
    height: min-content;

    img {
      display: block;
    }
  }
}
</style>