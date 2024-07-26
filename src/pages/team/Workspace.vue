<template>
  <VLayout class="workspace">
    <SuspectDatabase />

    <div class="workspace__main">
      <div class="workspace__ep">
        <VIcon size="1em">
          mdi-star-four-points-circle
        </VIcon> 40
      </div>
    </div>
  </VLayout>
</template>

<script setup lang="ts">
import SuspectDatabase from '@/components/SuspectDatabase.vue';
</script>

<style lang="scss" scoped>
@import '@/scss/vars';

.workspace {
  height: 100%;
  display: flex;

  &__main {
    flex: 1;
    position: relative;
  }

  &__ep {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    font-size: 1.5rem;
    font-family: $fontDisplay;
  }
}
</style>
