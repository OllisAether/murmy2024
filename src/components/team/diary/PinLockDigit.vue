<template>
  <div
    class="pin-lock-digit"
    data-no-pan
    ref="root"
    @pointerdown="pointerdown"
    @touchstart="pointerdown"
  >
    <!-- {{ rotation }} -->
    <div
      :class="['pin-lock-digit__inner', {
        'pin-lock-digit__inner--dragging': dragging,
      }]"
      :style="{
        transform: `rotateX(${rotation}deg)`
      }"
    >
      <span
        v-for="i in 10"
        :key="i"
      >
        <!-- :style="{
          opacity: (Math.abs((i - 1) * 36 - rotation) + 90) % 360 > 180 ? 0 : 1,
        }" -->
        {{ i - 1 }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useModel } from 'vue';

const props = defineProps<{
  modelValue: number,
}>();

const emit = defineEmits(['update:modelValue']);

const value = useModel(props, 'modelValue');

const root = ref<HTMLElement | null>(null);
const dragging = ref(false);
const rotation = ref(0);

function pointerdown(event: PointerEvent | TouchEvent) {
  let e: PointerEvent | Touch;

  if (!root.value) return;
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

  const startY = e.clientY;
  const startValue = value.value;
  dragging.value = true;

  function pointermove(event: PointerEvent | TouchEvent) {
    if (!root.value) return;

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

    const scale = root.value.getBoundingClientRect().height / root.value.offsetHeight;
    const deltaY = (e.clientY - startY) / scale;

    rotation.value = (((-deltaY * 2 % 360) + 360) + startValue * 36) % 360;
    value.value = Math.round(rotation.value / 36) % 10;
  }

  function pointerup() {
    dragging.value = false;
    if (event instanceof TouchEvent) {
      window.removeEventListener('touchmove', pointermove);
      window.removeEventListener('touchend', pointerup);
    } else {
      window.removeEventListener('pointermove', pointermove);
      window.removeEventListener('pointerup', pointerup);
    }

    rotation.value = Math.round(rotation.value / 36) * 36;
  }
}

onMounted(() => {
  rotation.value = value.value * 36;
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.pin-lock-digit {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  width: 1rem;
  overflow: hidden;
  font-family: $fontDisplay;
  border-radius: 0.25rem;

  &::after {
    content: '';
    position: absolute;
    inset: -.5rem;
  }

  &__inner {
    position: absolute;
    height: 100%;
    width: 100%;
    transform-origin: center center;
    transform-style: preserve-3d;
    transition: transform 0.2s;
    pointer-events: none;

    &--dragging {
      transition: none;
    }
  }

  span {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    text-align: center;
    transform-origin: center 0;
    line-height: 1rem;
    background: #b5b2ad;
    color: black;
    box-shadow: 0 0 .2rem #000 inset;
    font-size: .75rem;

    @for $i from 0 through 9 {
      &:nth-child(#{$i + 1}) {
        transform: rotateX(#{$i * -36}deg)translateZ(1.5rem)translateY(-50%);
      }
    }
  }
}
</style>