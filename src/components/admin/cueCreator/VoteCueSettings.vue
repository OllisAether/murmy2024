<template>
  <VLabel class="mb-2 mt-4">Tiebreaker-Dauer</VLabel>
  <DurationTextField v-model="modelValue.tieBreakerDuration" />
  
  <VDivider class="mt-4" />

  <VSelect
    class="mt-4"
    v-model="selectedMedia"
    multiple
    chips
    closable-chips
    :items="media.map(media => ({
      title: media.displayName,
      value: media.name
    }))"
    label="Medien"
    hide-details
  />

  <p class="mt-2 text-grey text-body-2">
    Medien werden zum Pool hinzugefügt. Medien aus vorherigen Runden werden nicht entfernt.
  </p>

  <VCard
    v-for="option in modelValue.options"
    :key="option.media"
    variant="outlined"
    rounded="lg"
    style="border-style: dashed;"
    class="mt-4"
  >
    <VCardTitle>
      {{ mediaMap[option.media]?.displayName ?? option.media}}
    </VCardTitle>
    <VCardText>
      <VSelect
        v-model="option.unlockFiles"
        multiple
        chips
        closable-chips
        :items="files.map(file => file.name)"
        label="Freizuschaltende Dateien"
        hide-details
      />

    </VCardText>
  </VCard>
  <p class="text-grey mt-2 text-body-2">
    Die Dateien werden nach der Wahl freigeschaltet, wenn die Option gewählt wurde.
  </p>
</template>

<script setup lang="ts">
import DurationTextField from '../DurationTextField.vue';
import { computed, useModel } from 'vue';
import { CueJson } from '../../../../shared/cue';
import { media, mediaMap } from '@/assets/media';
import { files } from '@/assets/files';

const props = defineProps<{
  modelValue: NonNullable<CueJson['vote']>
}>();

const modelValue = useModel(props, 'modelValue')

const selectedMedia = computed({
  get: () => modelValue.value.options.map(o => o.media),
  set: (value: string[]) => modelValue.value.options = value.map(media => ({
    media,
    unlockFiles: modelValue.value.options.find(o => o.media === media)?.unlockFiles ?? []
  }))
})
</script>