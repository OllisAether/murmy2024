<template>
  <VProgressLinear
    :model-value="progress"
    :max="1"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const props = defineProps<{
  duration: number
}>()

const progress = ref(1)

onMounted(() => {
  const start = Date.now()

  function animate () {
    if (progress.value === 0) return
    setTimeout(animate, 100)

    progress.value = Math.max(1 - (Date.now() - start) / props.duration, 0)
  }

  animate()
})
</script>