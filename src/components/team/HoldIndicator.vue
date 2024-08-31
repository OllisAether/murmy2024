<template>
  <div
    class="hold-indicator__wrapper"
    ref="root"
    @pointerdown="onPointerDown"
  >
    <VFadeTransition>
      <div
        v-if="progress > 0"
        :class="['hold-indicator', {
          'hold-indicator--nothing-found': nothingFound,
          'hold-indicator--already-found': alreadyFound
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

    <slot />
  </div>
</template>

<script setup lang="ts">
import { useCollectables } from '@/store/collectables';
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  threshold: number
}>(), {
  threshold: 20
});

const emit = defineEmits(['holdend']);

const collectables = useCollectables();
const root = ref<HTMLElement | null>(null);

const holdPosition = ref([0, 0]);
const progress = ref(0);

const holdDuration = 2000;
const holdCheck = 1800;
const holdDelay = 200;

// quadratic ease in out
const progressEase = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const nothingFound = ref(false);
const alreadyFound = ref(false);

function onPointerDown (e: PointerEvent) {
  let start = Date.now();

  holdPosition.value = [e.clientX - (root.value?.getBoundingClientRect().x ?? 0), e.clientY - (root.value?.getBoundingClientRect().y ?? 0)];
  nothingFound.value = false;
  alreadyFound.value = false;

  let success: boolean | 'alreadyCollected' | undefined = undefined

  let animation: number | null = null;
  async function counter () {
    const now = Date.now()
    const timeElapsed = now - start - holdDelay
    progress.value = progressEase(Math.max(0, Math.min(1, timeElapsed / holdDuration)))

    if (timeElapsed >= holdCheck && success === undefined) {
      setTimeout(() => {
        success = collectables.markCollectableAt(e.clientX, e.clientY);
      }, holdDuration - holdCheck);
    } else if (progress.value >= 1) {
      if (success === 'alreadyCollected') {
        alreadyFound.value = true;
        await new Promise(resolve => setTimeout(resolve, 200));
      } else if (!success) {
        nothingFound.value = true;
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      up();
      return;
    }

    animation = requestAnimationFrame(counter);
  }

  const startTouchPos = {
    x: e.clientX,
    y: e.clientY
  }

  counter();

  window.addEventListener('pointerup', up);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointercancel', up);

  function up() {
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointercancel', up);

    animation && cancelAnimationFrame(animation);
    progress.value = 0;
    emit('holdend');
  }

  function move (e: PointerEvent) {
    const distance = Math.sqrt(Math.pow(e.clientX - startTouchPos.x, 2) + Math.pow(e.clientY - startTouchPos.y, 2));
  
    if (distance > props.threshold) {
      animation && cancelAnimationFrame(animation);
      progress.value = 0;
      up();
    }
  }
}

</script>

<style scoped lang="scss">
.hold-indicator {
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

  &__wrapper {
    position: relative;
  }

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

  &--already-found {
    mix-blend-mode: normal !important;
    filter: drop-shadow(0 0 0.5rem #000)hue-rotate(0);
    color: #ff7948;
    animation: scaleUp .3s forwards;

    @keyframes scaleUp {
      0% {
        transform: translate(-50%, -50%)scale(1);
      }
      50% {
        transform: translate(-50%, -50%)scale(.9);
      }
      100% {
        transform: translate(-50%, -50%)scale(1);
      }
    }
  }
}
</style>