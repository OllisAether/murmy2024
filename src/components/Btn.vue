<template>
  <button :class="['btn', {
    'btn--square': square,
  }]">
    <SkewBox
      class="btn__box"
      :color="color"
      :corner-cut="8"
    />
    <div class="btn__content">
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
import SkewBox from './SkewBox.vue';

defineProps<{
  color?: string
  square?: boolean
}>()
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  padding: 1rem 2rem;
  line-height: 1rem;

  &__box {
    position: absolute;
    inset: 0;
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  &--square {
    width: 3rem;
    height: 3rem;
    padding: 0;
  }
}
</style>