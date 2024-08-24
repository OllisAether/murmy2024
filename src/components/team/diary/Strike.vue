<template>
  <span :class="['strike', {
    'strike--behind': behind,
  }]" ref="root">
    <span
      v-for="(char, i) in text"
      :key="i"
      class="strike__char"
    >
      {{ char }}<svg
        class="strike__line"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0%"
          :y1="`${randomSequence[i * 3] * deviation + randomSequence[i * 3 + 1] * 2 + height}%`"
          x2="100%"
          :y2="`${randomSequence[i * 3 + 3] * deviation + randomSequence[i * 3 + 4] * 2 + height}%`"
          :stroke="color"
          stroke-linecap="round"
          :stroke-width="thickness"
        />
        <line
          x1="0%"
          :y1="`${randomSequence[i * 3] * deviation + randomSequence[i * 3 + 2] * 2 + height}%`"
          x2="100%"
          :y2="`${randomSequence[i * 3 + 3] * deviation + randomSequence[i * 3 + 5] * 2 + height}%`"
          :stroke="color"
          stroke-linecap="round"
          :stroke-width="thickness"
        />
      </svg>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

withDefaults(defineProps<{
  deviation?: number,
  height?: number,
  thickness?: number,
  color?: string,
  behind?: boolean,
}>(), {
  deviation: 2,
  height: 50,
  thickness: 2,
  color: 'currentColor',
  behind: false,
});

const text = computed(() => (useSlots().default?.()[0].children as string));

const randomSequence = Array.from({ length: text.value.length * 6 }, () => Math.random() * 2 - 1);
</script>

<style lang="scss" scoped>
.strike {
  position: relative;
  display: inline-block;

  &__char {
    position: relative;
    display: inline-block;
    white-space: pre-wrap;

  }

  &__line {
    .strike--behind & {
      z-index: -1;
    }

    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
</style>