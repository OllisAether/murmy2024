<script lang="ts" setup>
withDefaults(defineProps<{
  steps?: number,
  blur?: number,
  start?: number,
}>(), {
  steps: 5,
  blur: 5,
  start: 0,
})
</script>

<template>
  <div class="blur-gradient" :style="{
    '--steps': steps,
    '--start': start,
  }">
    <div
      v-for="i in steps"
      :key="i"
      class="blur-gradient__step"
      :style="{
        '--i': i - 1,
        '--blur': blur * i / steps + 'px',
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.blur-gradient {
  position: relative;

  &__step {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: calc((1 - var(--start)) * var(--i) / var(--steps) * 100%);
    -webkit-backdrop-filter: blur(var(--blur));
    backdrop-filter: blur(var(--blur));

    -webkit-mask-image: linear-gradient(
      to bottom,
      black calc((1 - 1 / (var(--steps) - var(--i))) * 100%),
      transparent,
    );
    mask-image  : linear-gradient(
      to bottom,
      black calc((1 - 1 / (var(--steps) - var(--i))) * 100%),
      transparent,
    );
  }
}
</style>