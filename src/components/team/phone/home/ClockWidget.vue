<template>
  <button
    class="clock-widget"
    @click="phone.openApp('clock')"
  >
    <div class="clock-widget__content">
      <div class="clock-widget__time">{{ phone.clock }}</div>
      <div class="clock-widget__date">{{ phone.date }}</div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useMainClue } from '@/store/team/mainClue';

const phone = useMainClue();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.clock-widget {
  background: linear-gradient(#888d, #444d 49%, #222d 51%, #000d);
  border-radius: 5px * $scale;
  box-shadow:
    0 -1px * $scale 1px * $scale 0 #000a inset,
    0 1px * $scale 1px * $scale 0 #fffa inset,
    -1px * $scale 0 1px * $scale 0 #000a inset,
    1px * $scale 0 1px * $scale 0 #fffa inset,
    0 0 1px * $scale 0 #000d,
    0 1px * $scale 2px * $scale 1px * $scale #000d,
  ;

  &__content {
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5px * $scale;
    gap: 5px * $scale;
    align-items: center;
    mask-image: linear-gradient(#0002, #000 49%, #000a 51%, #0005);
  }

  &__time {
    font-size: 48px * $scale;
    // font-weight: bold;
    line-height: 1;
  }

  &__date {
    font-size: 8px * $scale;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1;
  }
}
</style>