<template>
  <div class="carousel-item">
    <div class="carousel-item__banner">
      <slot name="banner" />
    </div>
    <div class="carousel-item__title">
      <slot name="title" />
    </div>

    <div class="carousel-item__text">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;

  &__banner {
    z-index: 1;
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 3 / 1;
    font-size: 8rem;

    & > :deep(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      overflow: hidden;
      border-radius: .5rem;
    }
  }

  &__title {
    margin-top: 2rem;
    font-size: 2rem;
    font-family: $fontHeading;
    font-weight: bold;
  }

  &__text {
    margin-top: 2rem;
    margin-bottom: 4rem;
    padding: 0 1rem;
  }
}
</style>