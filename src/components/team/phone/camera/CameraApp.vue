<template>
  <div class="camera-app">
    <ViewfinderScreen v-if="phone.isPath()" />
    <GalleryScreen v-else-if="phone.isPath('gallery')" />
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