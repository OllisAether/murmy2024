<template>
  <Page blank class="page0">
    <div class="page0__title">
      Mein Tagebuch
    </div>

    <div class="page0__copyright-info">
      © 2012 LS. Technik-Crew
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '../Page.vue';
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.page0 {
  padding-top: 15rem;
  text-align: center;
  color: #b0957c;

  .page0__title {
    font-size: 7rem;
    font-family: $fontDiaryLarge;
  }

  .page0__copyright-info {
    font-size: 1.5rem;
    margin-top: 40rem;
  }
}
</style>