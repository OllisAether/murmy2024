<template>
  <button class="google-widget" @click="phone.openApp('internet')">
    <span>
      Google
    </span>
    <VIcon size="1em">mdi-microphone</VIcon>
  </button>
</template>

<script setup lang="ts">
import { useMainClue } from '@/store/team/mainClue';

const phone = useMainClue();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.google-widget {
  font-family: 'Times New Roman', Times, serif;
  margin: auto 0;
  height: 24px * $scale;
  color: white;
  background: #000a;
  border-radius: 2px * $scale;
  box-shadow: 0 1px * $scale 2px * $scale #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px * $scale;
}
</style>