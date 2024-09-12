<template>
  <Book
    class="diary"
    :zoomScale="zoomScale"
    :currentPage="currentPage"
    :pageTransitionProgress="pageTransitionProgress"
    :pageComponents="diary.locked ? [Cover, BackCover] : pages"
    :filter="!diary.locked"
  />
</template>

<script lang="ts" setup>
import { pages } from './pages';
import Cover from './pages/FrontCover.vue';
import BackCover from './pages/BackCover.vue';
import { useMainClue } from '@/store/team/mainClue';
import Book from '../Book.vue';

const diary = useMainClue();

defineProps<{
  zoomScale: number,
  currentPage: number,
  pageTransitionProgress: number,
}>();
</script>

<style lang="scss" scoped>
.diary {
  width: 455px * 2;
  height: 588px * 2;
  pointer-events: all;
}
</style>