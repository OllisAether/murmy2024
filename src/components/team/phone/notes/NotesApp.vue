<template>
  <div class="notes-app">
    <VFadeTransition>
      <NotesScreen v-if="phone.isPath()" />
    </VFadeTransition>
    <VSlideYReverseTransition>
      <NoteScreen v-if="phone.isPathLoose() && !phone.isPath()" />
    </VSlideYReverseTransition>
  </div>
</template>

<script setup lang="ts">
import { useMainClue } from '@/store/team/mainClue';
import NotesScreen from './NotesScreen.vue';
import NoteScreen from './NoteScreen.vue';

const phone = useMainClue()
</script>

<style lang="scss" scoped>
.notes-app {
  background: black;
}
</style>