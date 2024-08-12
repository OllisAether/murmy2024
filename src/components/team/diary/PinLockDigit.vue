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
        :class="['pin-lock-digit__digit', {
          'pin-lock-digit__digit--active': i - 1 === value,
        }]"
        :style="{
          background: `linear-gradient(${getGradient(i - 1)})`,
          opacity: (Math.abs((i - 1) * 36 - rotation) + 90) % 360 > 180 ? 0 : 1,
        }"
      >
        {{ i - 1 }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Color from 'color';
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

function getGradient (index: number) {
  const angle = index * 36;
  const angleDiff = (angle - ((rotation.value + 360) % 360) + 180) % 360 - 180;
  
  const progress = /* Math.max(-1, Math.min(1 , */(angleDiff / 36 - 5) % 10 + 5/* )); */

  // console.log(index, progress, angleDiff);

  const stop1Colors = [Color('#d5dddd'), Color('#9cafaa'), Color('#31434e')];
  const stop2Colors = [Color('#48625a'), Color('#575958'), Color('#899699')];
  const stop3Colors = [Color('#c2c9c6'), Color('#bcc8cf'), Color('#3b4b54')];

  let stop1: Color, stop2: Color, stop3: Color

  if (progress > 0) {
    stop1 = stop1Colors[1].mix(stop1Colors[2], progress);
    stop2 = stop2Colors[1].mix(stop2Colors[2], progress);
    stop3 = stop3Colors[1].mix(stop3Colors[2], progress);
  } else {
    stop1 = stop1Colors[0].mix(stop1Colors[1], progress + 1);
    stop2 = stop2Colors[0].mix(stop2Colors[1], progress + 1);
    stop3 = stop3Colors[0].mix(stop3Colors[1], progress + 1);
  }

  return `${stop1.hex()}, ${stop2.hex()}, ${stop3.hex()}`;
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.pin-lock-digit {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  width: 2rem;
  overflow: hidden;
  font-family: $fontDisplay;
  border-radius: 0.25rem;
  background: black;
  box-shadow:
    2px 0 1px #131414,
    -2px 0 1px #0d0e0e,
    0 1px 1px #a5adab,
    0 -1px 1px #a5a9ad
  ;

  transform-style: preserve-3d;
  perspective: 9999px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateZ(4rem);
    background: linear-gradient(#000a, transparent 20%, transparent 80%, #000a);
  }

  &__inner {
    position: absolute;
    height: 100%;
    width: 100%;
    transform-origin: center center;
    transition: transform 0.2s;
    pointer-events: none;
    transform-style: preserve-3d;

    &--dragging {
      transition: none;
    }
  }

  &__digit {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    text-align: center;
    transform-origin: center 0;
    line-height: 2rem;
    color: black;
    box-shadow:
      0 0 5px #000 inset,
      1px 0 1px #fff inset,
      -1px 0 1px #fff inset;
    text-shadow:
      0 0 2px #000,
      0 1px 1px #fff,
      0 -1px 1px #fff;
    font-size: 1.5rem;

    will-change: transform;

    @for $i from 0 through 9 {
      &:nth-child(#{$i + 1}) {
        transform: rotateX(#{$i * -36}deg)translateZ(3.08rem)translateY(-50%);
      }
    }
  }
}
</style>