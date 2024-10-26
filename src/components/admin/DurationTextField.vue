<template>
  <div class="d-flex align-center">
    <span class="text-grey mr-4" v-if="$slots.prepend">
      <slot name="prepend" />
    </span>
    <VTextField
      v-model="durationMinutes"
      class="mr-3"
      label="Minuten"
      outlined
      type="number"
      hide-details
      :disabled="disabled"
    />
    <VTextField
      v-model="durationSeconds"
      label="Sekunden"
      outlined
      type="number"
      hide-details
      :disabled="disabled"
    />
    <span class="text-grey ml-4" v-if="$slots.append">
      <slot name="append" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, useModel } from 'vue';

const props = defineProps<{
  modelValue: number | null
  disabled?: boolean
}>()

const emits= defineEmits<{
  'update:modelValue': [number]
}>()

const modelValue = useModel(props, 'modelValue')

const durationMinutes = computed({
  get: () => modelValue.value ? Math.floor(modelValue.value / 60000) : 0,
  set: (value) => {
    const dur = value * 60000 + durationSeconds.value * 1000
    
    if (dur >= 0) {
      modelValue.value = dur
    }
  }
})
const durationSeconds = computed({
  get: () => modelValue.value ? Math.floor((modelValue.value % 60000) / 1000) : 0,
  set: (value) => {
    const dur = durationMinutes.value * 60000 + value * 1000

    if (dur >= 0) {
      modelValue.value = dur
    }
  }
})
</script>