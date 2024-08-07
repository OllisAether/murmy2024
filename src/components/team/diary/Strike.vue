<template>
  <span class="strike" ref="root">
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
          x1="5%"
          :y1="`${randomSequence[i * 3] * deviation + randomSequence[i * 3 + 1] * 2 + height}%`"
          x2="95%"
          :y2="`${randomSequence[i * 3 + 3] * deviation + randomSequence[i * 3 + 4] * 2 + height}%`"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="1"
        />
        <line
          x1="5%"
          :y1="`${randomSequence[i * 3] * deviation + randomSequence[i * 3 + 2] * 2 + height}%`"
          x2="95%"
          :y2="`${randomSequence[i * 3 + 3] * deviation + randomSequence[i * 3 + 5] * 2 + height}%`"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="1"
        />
      </svg>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

withDefaults(defineProps<{
  deviation: number,
  height: number,
}>(), {
  deviation: 2,
  height: 50,
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
    position: absolute;
    top: -5%;
    left: -5%;
    height: 110%;
    width: 110%;
  }
}
</style>