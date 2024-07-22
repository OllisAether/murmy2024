<template>
  <VCard flat color="background">
    <VToolbar color="grey-darken-3">
      <VBtn
        variant="flat"
        icon
        :color="admin.currentPlaybackIndex === index ? 'primary' : 'grey-darken-2'"
        size="2.5rem"
        class="mr-2 ml-4"
        @click="play"
      >
        <VIcon v-if="admin.currentPlaybackIndex !== index">mdi-circle-double</VIcon>
        <VIcon v-else-if="admin.currentCueIndex === -1">mdi-motion-play-outline</VIcon>
        <VIcon v-else>mdi-skip-next</VIcon>
      </VBtn>
      <VChip
        :color="playback.trigger === 'auto' ? 'secondary' : 'grey-darken-2'"
        variant="flat"
        :size="0"
        class="pa-1 mr-2"
      >
        <VIcon>mdi-flag-triangle</VIcon>
      </VChip>

      <VToolbarTitle>
        {{ playback.name }}

        <VChip
          v-for="(value, key) in playback.fields"
          :key="key"
          class="mr-2"
          size="small"
        >
          {{ key }}: {{ value }}
        </VChip>
      </VToolbarTitle>
      <VChip
        :color="admin.currentPlaybackIndex === index ? 'primary' : 'grey-darken-2'"
        variant="flat"
        class="mr-2"
        size="small"
      >
        {{ admin.currentCueIndex + 1 }} / {{ playback.cues.length }}
      </VChip>
      <VBtn
        icon
        class="mr-2"
        size="3rem"
        @click="showDetails = !showDetails"
      >
        <VIcon>{{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</VIcon>
      </VBtn>
    </VToolbar>

    <VExpandTransition>
      <div v-if="showDetails">
        <VCardText>
          <VBtnToggle
            v-model="trigger"
            :mandatory="true"
            class="mb-4 w-100"
            variant="outlined"
            color="primary"
          >
            <VBtn class="flex-grow-1" value="auto">
              <VIcon class="mr-2">mdi-motion-play-outline</VIcon>
              Automatisch
            </VBtn>
            <VBtn class="flex-grow-1" value="manual">
              <VIcon class="mr-2">mdi-hand</VIcon>
              Manuell
            </VBtn>
          </VBtnToggle>

          <CueCard
            v-for="(cue, i) in playback.cues"
            :key="i"
            :playback="playback"
            :index="i"
            :cue="cue"
            :active="admin.delayedCurrentPlaybackIndex === index && admin.delayedCurrentCueIndex === i"
          />
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>
</template>

<script setup lang="ts">
import { Playback } from '@/../shared/playback/Playback';
import CueCard from './CueCard.vue';
import { useAdmin } from '@/store/admin';
import { computed, ref } from 'vue';

const admin = useAdmin()
const showDetails = ref(false)

const props = defineProps<{
  index: number
  playback: Playback
}>()

const trigger = computed({
  get: () => props.playback.trigger,
  set: (value: string) => {
    // props.playback.trigger = value
  }
})

function play () {
  if (admin.currentPlaybackIndex !== props.index) {
    admin.setCurrentPlayback(props.index)
  } else {
    admin.nextCue()
  }
}
</script>