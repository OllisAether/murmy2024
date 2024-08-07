<template>
  <div
    @pointerdown.passive="pointerdown"
    @touchstart="pointerdown"
    :class="['scroll-view', {
      'scroll-view--scrolling': scrolling,
    }]"
    data-no-pan
  >
    <div
      class="scroll-view__track"
      :style="{
        '--scroll-progress': scrollProgress,
        '--scroll-ratio': scrollRatio,
      }"
    >
      <div class="scroll-view__track__thumb" />
    </div>
    <div
      class="scroll-view__content"
      ref="scroller"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const scroller = ref<HTMLElement | null>(null);
const scrollProgress = ref(0);
const scrollRatio = ref(0);
const scrolling = ref(false);

let velocity = 0;
let animationFrame: number | null = null;
function startVelocityScroll() {
  let last = Date.now();

  function frame() {
    if (!scroller.value) return;

    const now = Date.now();
    const delta = now - last;
    last = now;

    scroller.value.scrollTop -= velocity * delta;

    velocity *= 0.95;

    if (Math.abs(velocity) < 0.05) {
      velocity = 0;
      animationFrame = null;
    } else {
      animationFrame = requestAnimationFrame(frame);
    }
  }

  animationFrame = requestAnimationFrame(frame);
}

function pointerdown(event: PointerEvent | TouchEvent) {
  let e: PointerEvent | Touch;

  if (!scroller.value) return;
  if (event instanceof TouchEvent) {
    if (event.touches.length > 1) return;

    window.addEventListener('touchmove', pointermove);
    window.addEventListener('touchend', pointerup);

    e = event.touches[0];
  } else {
    if (event.pointerType === 'touch') return;

    window.addEventListener('pointermove', pointermove);
    window.addEventListener('pointerup', pointerup);

    e = event;
  }

  animationFrame && cancelAnimationFrame(animationFrame);
  velocity = 0;
  scrolling.value = true;

  const startY = e.clientY;
  const startScrollTop = scroller.value.scrollTop;

  let last = Date.now();
  let lastY = startY;
  function pointermove(event: PointerEvent | TouchEvent) {
    if (!scroller.value) return;

    let e: PointerEvent | Touch;

    if (event instanceof TouchEvent) {
      if (event.touches.length > 1) {
        pointerup();
        return;
      };
      e = event.touches[0];
    } else {
      e = event;
    }

    const scale = scroller.value.getBoundingClientRect().height / scroller.value.offsetHeight;
    const deltaY = (e.clientY - startY) / scale;

    scroller.value.scrollTop = startScrollTop - deltaY;

    const now = Date.now();
    const deltaT = now - last;
    
    velocity = (e.clientY - lastY) / deltaT / scale;
    
    last = now;
    lastY = e.clientY;
  }

  function pointerup() {
    if (event instanceof TouchEvent) {
      window.removeEventListener('touchmove', pointermove);
      window.removeEventListener('touchend', pointerup);
    } else {
      window.removeEventListener('pointermove', pointermove);
      window.removeEventListener('pointerup', pointerup);
    }

    startVelocityScroll();
    scrolling.value = false;
  }
}

onMounted(() => {
  if (!scroller.value) return;

  scroller.value.addEventListener('scroll', () => {
    if (!scroller.value) return;

    scrollProgress.value = scroller.value.scrollTop / (scroller.value.scrollHeight - scroller.value.clientHeight)
    scrollRatio.value = scroller.value.clientHeight / scroller.value.scrollHeight;
  });
});
</script>

<style lang="scss" scoped>
.scroll-view {
  position: relative;
  overflow: hidden;

  &__track {
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    bottom: 0;

    &__thumb {
      position: absolute;
      top: calc(var(--scroll-progress) * (1 - var(--scroll-ratio)) * 100%);
      right: 0;
      width: 100%;
      height: calc(var(--scroll-ratio) * 100%);
      background: #fff4;

      opacity: 0;
      transition: opacity 1s 2s;

      .scroll-view--scrolling & {
        opacity: 1;
        transition: opacity 0.1s;
      }
    }
  }

  &__content {
    height: 100%;
    overflow: hidden;
  }
}
</style>