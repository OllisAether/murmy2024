<template>
  <VCard>
    <VToolbar>
      <VToolbarTitle>
        {{ title ?? 'Ermittlungspunkte setzen' }}
      </VToolbarTitle>
    </VToolbar>

    <VCardText>
      <VTextField
        v-model.number="value"
        label="Ermittlungspunkte"
        type="number"
        outlined
        dense
      />
    </VCardText>

    <VCardActions>
      <VBtn
        @click="emit('close')"
      >
        Abbrechen
      </VBtn>
      <VBtn
        color="primary"
        @click="emit('set', value); emit('close')"
      >
        Setzen
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  startValue: number
  title?: string
}>()

const emit = defineEmits<{
  close: [],
  set: [number]
}>()

const value = ref(props.startValue)
</script>