<template>
  <div class="camera-app">
    <VFadeTransition>
      <ViewfinderScreen v-if="phone.isPath()" />
    </VFadeTransition>
    <VSlideYReverseTransition>
      <GalleryScreen v-if="phone.isPathLoose('gallery')" />
    </VSlideYReverseTransition>
  </div>
</template>

<script setup lang="ts">
import { useMainClue } from '@/store/team/mainClue';
import ViewfinderScreen from './ViewfinderScreen.vue';
import GalleryScreen from './GalleryScreen.vue';

const phone = useMainClue()
</script>

<style lang="scss" scoped>
.camera-app {
  background: black;
}
</style>