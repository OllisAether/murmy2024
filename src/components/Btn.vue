<template>
  <button :class="['btn', {
    'btn--square': square,
    'btn--disabled': $attrs.disabled,
    'btn--loading': loading
  }]">
    <SkewBox
      class="btn__box"
      :color="$attrs.disabled ? undefined : color"
      :corner-cut="8"
    />
    <div class="btn__content">
      <slot />
    </div>

    <VFadeTransition>
      <div class="btn__loading" v-if="loading">
        <VProgressCircular
        indeterminate
        color="white"
        size="24"
        />
      </div>
    </VFadeTransition>
  </button>
</template>

<script setup lang="ts">
import SkewBox from './SkewBox.vue';

defineProps<{
  color?: string
  square?: boolean,
  loading?: boolean
}>()
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  padding: 1rem 1.5rem;
  line-height: 1rem;

  transition: .3s opacity, .1s filter;

  &:active {
    filter: brightness(1.4) contrast(0.7);
  }

  &--disabled {
    pointer-events: none;
    opacity: 0.3;
  }

  &__box {
    position: absolute;
    inset: 2px;
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

  &--loading {
    .btn__content {
      opacity: .5;
    }
  }

  &__loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>