<template>
  <VCard
    class="mb-2"
    flat
    bg-color="#121212"
    :color="i === admin.cueIndex ? 'primary' : '#161616'"
  >
    <VCardTitle>
      {{ cueTypeToName(cue.type) }} - {{ duration }}

      <VBtn
        icon
        @click="admin.startCue(i)"
        class="ml-auto"
      >
        <VIcon>mdi-play</VIcon>
      </VBtn>
      <VBtn
        icon
        @click="admin.removeCue(i)"
      >
        <VIcon>mdi-close</VIcon>
      </VBtn>
    </VCardTitle>

    <VCardText v-if="cue.unlockFiles?.length > 0">
      <p class="mb-4">
        Hinweise:
      </p>

      <VChip v-for="(vote, i) in cue.unlockFiles" :key="i" color="primary" class="mr-2" >
        {{ vote }}
      </VChip>
    </VCardText>
  </VCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { CueJson, cueTypeToName } from '../../../shared/cue';
import { useAdmin } from '@/store/admin';

const props = defineProps<{
  i: number
  cue: CueJson
}>()

const admin = useAdmin()

const duration = computed(() => {
  if (props.cue.duration === undefined) return 'manuell'

  const minutes = Math.floor(props.cue.duration / 60000)
  const seconds = (props.cue.duration / 1000) % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})
</script>