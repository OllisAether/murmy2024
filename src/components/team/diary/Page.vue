<template>
  <div class="diary-page">
    <div class="diary-page__background" v-if="!blank">
      <div class="diary-page__date">
        <div class="diary-page__date__label">
          Datum:
        </div>
        <div class="diary-page__date__value">
          <slot name="date" />
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 455 588"
        fill="none"
      >
        <path
          v-for="(_, i) in 19"
          :d="`M0 ${i * 24 + 88} H455`"
          stroke="#DCC1A7"
          stroke-width="1"
        />
      </svg>
      <div class="diary-page__page-number">
        {{ ((pageNumber ?? 2) - 2).toString().padStart(2, '0') }}
      </div>
    </div>

    <div class="diary-page__content">
      <div class="diary-page__content__text">
        <slot name="text"/>
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pageNumber?: number,
  blank?: boolean,
}>();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.diary-page {
  background: #EDE0CF;
  color: #3b3955;
  height: 100%;

  border-radius: 1rem 0 0 1rem;

  .book__page-wrapper--odd & {
    border-radius: 0 1rem 1rem 0;
  }

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__date {
    position: absolute;
    top: 3rem;
    left: 2rem;
    width: 40%;
    height: 4rem;

    border-bottom: 2px solid #DCC1A7;

    &__label {
      font-family: $fontDiarySmall;
      font-size: 1.5rem;
      line-height: .3;
      font-weight: bold;
      color: #DCC1A7;
    }

    &__value {
      font-family: $fontHandwriting;
      font-size: 4rem;
      line-height: 1;
      padding-left: .3rem;
    }
  }

  &__page-number {
    position: absolute;
    bottom: 3rem;
    left: 0;
    padding: 0 2rem;

    font-family: $fontDiaryLarge;
    line-height: 1;
    font-size: 10rem;
    font-weight: 600;

    color: #DCC1A7;
    background: #EDE0CF;

    .book__page-wrapper--odd & {
      left: auto;
      right: 0;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    height: 100%;

    &__text {
      width: 100%;
      height: 100%;
      font-family: $fontHandwriting;
      position: absolute;
      top: 8.5rem;
      padding: 0 2rem;
      line-height: 3rem;
      font-size: 2.7rem;
      // filter: drop-shadow(-1px -1px 2px #d7c5ae)drop-shadow(1px 1px 2px #ebe3d8);
    }
  }
}
</style>