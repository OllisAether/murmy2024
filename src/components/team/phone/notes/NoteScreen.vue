<template>
  <ScrollView class="note-screen">
    <div class="note-screen__head">
      <div class="note-screen__title">
        {{ note.title ?? 'Memo vom ' + note.date.format('DD.MM.YYYY') }}
      </div>
      <div v-if="note.title" class="note-screen__date">
        vom {{ note.date.format('DD.MM.YYYY') }}
      </div>
    </div>

    <div class="note-screen__text">
      <TextContentRenderer :textContent="note.content" />
    </div>
  </ScrollView>
</template>

<script setup lang="ts">
import ScrollView from '../ScrollView.vue';
import { useMainClue } from '@/store/team/mainClue';
import { computed } from 'vue';
import { notes } from '../../../../../shared/assets/phone/notes';
import TextContentRenderer from '../../../TextContentRenderer.vue';

const phone = useMainClue();

const noteIndex = computed(() => +phone.currentPath[phone.currentPath.length - 1]);
const note = computed(() => notes[noteIndex.value]);
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.note-screen {
  position: absolute;
  inset: 0;
  height: 100%;
  background: linear-gradient(#FFF4E8, #F0DCC4);

  &__head {
    padding: 10px * $scale;
  }

  &__title {
    color: black;
    font-weight: bold;
  }

  &__date {
    font-size: 8px * $scale;
    color: black;
  }

  &__text {
    padding: 0 10px * $scale;
    font-size: 8px * $scale;
    line-height: 1.5;
    color: black;
  }
}
</style>