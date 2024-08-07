<template>
  <button @click="click" class="app-icon">
    <img :src="iconSrc" class="app-icon__image">
    <span v-if="name" class="app-icon__name">{{ name }}</span>
  </button>
</template>

<script setup lang="ts">
import { usePhone } from '@/store/team/phone';
import { defineProps } from 'vue';

const props = defineProps<{
  iconSrc: string
  name?: string
  app?: string
  path?: string
}>();

const phone = usePhone();

function click() {
  if (!props.app) return

  if (props.path) {
    phone.openApp(props.app, props.path);
  } else {
    phone.openApp(props.app);
  }
}
</script>

<style lang="scss" scoped>
.app-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  filter: drop-shadow(0 1px 1px black)drop-shadow(0 0 1px black);

  &__image {
    width: 22px;
    width: 22px;
    pointer-events: none;
  }

  &__name {
    font-size: 6px
  }
}
</style>