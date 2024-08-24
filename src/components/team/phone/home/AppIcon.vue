<template>
  <button @click="click" class="app-icon">
    <img :src="iconSrc" class="app-icon__image">
    <span v-if="name" class="app-icon__name">{{ name }}</span>
  </button>
</template>

<script setup lang="ts">
import { useMainClue } from '@/store/team/mainClue';

const props = defineProps<{
  iconSrc: string
  name?: string
  app?: string
  path?: string[]
  crash?: boolean
}>();

const phone = useMainClue();

function click() {
  if (props.crash) {
    phone.openCrashApp(props.name || 'App');
    return;
  }

  if (!props.app) return

  if (props.path) {
    phone.openApp(props.app, props.path);
  } else {
    phone.openApp(props.app);
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.app-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  filter: drop-shadow(0 1px * $scale 1px * $scale black)drop-shadow(0 0 1px * $scale black);

  &__image {
    width: 22px * $scale;
    width: 22px * $scale;
    pointer-events: none;
  }

  &__name {
    margin-top: 4px * $scale;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 0;
    min-width: 100%;
    font-size: 6px * $scale
  }
}
</style>