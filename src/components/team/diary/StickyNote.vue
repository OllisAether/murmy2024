<template>
  <div class="sticky-note">
    <slot />
    <Collectable
      v-if="entryId"
      :entryId="entryId"
      class="sticky-note__collectable"
    />
  </div>
</template>

<script setup lang="ts">
import Collectable from '../../Collectable.vue';

defineProps<{
  entryId?: string,
}>();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.sticky-note {
  position: relative;
  width: 30rem;
  height: 30rem;
  background: linear-gradient(#d5cf8d, #d1c185 5rem, #d5cf8d 5.5rem, #beae7c);
  padding: 7rem 2rem;
  box-shadow:
    0 2rem 3rem #0004;

  font-size: 3rem;
  line-height: 1;
  font-family: $fontHandwriting;

  &__collectable {
    position: absolute;
    inset: 0;
  }
}
</style>