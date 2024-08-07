<script lang="ts" setup>
withDefaults(defineProps<{
  steps?: number,
  blur?: number,
  start?: number,
  vertical?: boolean,
  flip?: boolean,
}>(), {
  steps: 5,
  blur: 5,
  start: 0,
  vertical: false,
  flip: false,
})
</script>

<template>
  <div :class="['blur-gradient', {
    'blur-gradient--vertical': vertical,
    'blur-gradient--flip': flip,
  }]" :style="{
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

    .blur-gradient--flip & {
      top: calc((1 - var(--start)) * var(--i) / var(--steps) * 100%);
      bottom: 0;

      -webkit-mask-image: linear-gradient(
        to top,
        black calc((1 - 1 / (var(--steps) - var(--i))) * 100%),
        transparent,
      );
      mask-image  : linear-gradient(
        to top,
        black calc((1 - 1 / (var(--steps) - var(--i))) * 100%),
        transparent,
      );
    }

    .blur-gradient--vertical & {
      bottom: 0;
      right: calc((1 - var(--start)) * var(--i) / var(--steps) * 100%);

      -webkit-mask-image: linear-gradient(
        to right,
        black calc((1 - 1 / (var(--steps) - var(--i))) * 100%),
        transparent,
      );
      mask-image  : linear-gradient(
        to right,
        black calc((1 - 1 / (var(--steps) - var(--i))) * 100%),
        transparent,
      );
    }

    .blur-gradient--vertical.blur-gradient--flip & {
      top: 0;
      left: calc((1 - var(--start)) * var(--i) / var(--steps) * 100%);

      -webkit-mask-image: linear-gradient(
        to left,
        black calc((1 - 1 / (var(--steps) - var(--i))) * 100%),
        transparent,
      );
      mask-image  : linear-gradient(
        to left,
        black calc((1 - 1 / (var(--steps) - var(--i))) * 100%),
        transparent,
      );
    }
  }
}
</style>