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
        {{ pageNumber?.toString().padStart(2, '0') }}
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
  font-size: 1rem;
  background: #EDE0CF;
  color: #3b3955;
  height: 100%;

  border-radius: .5rem 0 0 .5rem;

  .diary__page-wrapper--odd & {
    border-radius: 0 .5rem .5rem 0;
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
    top: 1.5rem;
    left: 1rem;
    width: 40%;
    height: 2rem;

    border-bottom: 2px solid #DCC1A7;

    &__label {
      font-family: $fontDiaryDate;
      font-size: .75rem;
      line-height: 1;
      font-weight: bold;
      color: #DCC1A7;
    }

    &__value {
      font-family: $fontHandwriting;
      font-size: 1.4rem;
      line-height: 1;
      padding-left: .3rem;
    }
  }

  &__page-number {
    position: absolute;
    bottom: 1.5rem;
    left: 0;
    padding: 0 1rem;

    font-family: $fontDiaryPage;
    line-height: 1;
    font-size: 5rem;
    font-weight: 600;

    color: #DCC1A7;
    background: #EDE0CF;

    .diary__page-wrapper--odd & {
      left: auto;
      right: 0;
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    height: 100%;

    &__text {
      font-family: $fontHandwriting;
      position: absolute;
      top: 4.25rem;
      padding: 0 1rem;
      line-height: 1.5rem;
      font-size: 1.4rem;
      filter: drop-shadow(-1px -1px 2px #d7c5ae)drop-shadow(1px 1px 2px #ebe3d8);
    }
  }
}
</style>