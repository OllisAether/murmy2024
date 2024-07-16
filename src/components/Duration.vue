<template>
  {{ Math.floor((duration / 1000) / 60) }}:{{ Math.floor((duration / 1000) % 60).toString().padStart(2, '0') }}
</template>

<script lang="ts" setup>
defineProps<{
  duration: number
}>()
</script>