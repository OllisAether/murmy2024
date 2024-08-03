<template>
  <div class="d-flex justify-stretch">
    <VDivider
      v-for="_ in depth"
      class="mx-4"
      vertical
      color="grey-darken-4"
      opacity="1"
      thickness="2"
    />
    <VCard
      :class="['flex-grow-1', {
        'mt-1': index !== 0,
      }]"
      flat
    >
      <VToolbar
        :color="active ? 'primary' : 'transparent'"
        :class="{
          'toolbar-transition': !active
        }"
        density="compact"
        @click="detailsShown = !detailsShown"
      >
        <VToolbarTitle class="text-body-1">
          <VIcon class="mr-2">
            {{ cueIconMap[cue.type] ?? 'mdi-help' }}
          </VIcon>
          {{ cue.type }}
          <template v-if="cue.type === CueType.SetPhase">
            to
            <VChip size="small">
              {{ cue.options?.phase ?? 'No Phase' }}
            </VChip>
          </template>
          <template v-if="cue.type === CueType.StartTimer">
            with
            <VChip size="small">
              {{ cue.options?.duration ?? 'No Duration' }}
            </VChip>
          </template>
          <template v-if="([
            CueType.If,
            CueType.ElseIf,
          ] as CueTypes[]).includes(cue.type)">
            <span class="ml-2">
              {{ (cue.options?.condition && conditionToString(cue.options.condition)) ?? 'No Condition' }}
            </span>
          </template>

          <template v-if="cue.type === CueType.SetMedia">
            <span class="ml-2">
              {{ cue.options?.media ?? 'No Media' }}
            </span>
          </template>
        </VToolbarTitle>
        <VIcon class="mr-4" v-if="Object.keys(cueSettingsMap[cue.type] ?? {}).length">
          {{ detailsShown ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </VIcon>
      </VToolbar>
      <VExpandTransition>
        <div v-if="cue.options && detailsShown">
          <VCardText>
            <VChip
              v-for="(value, key) in cue.options"
              :key="key"
              class="mr-2"
            >
              {{ key }}: {{ value }}
            </VChip>
          </VCardText>
        </div>
      </VExpandTransition>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { conditionToString } from '@/utils/conditionToString';
import { CueType, CueTypes } from '../../../../shared/cue/CueTypes';
import { cueIconMap } from '@/utils/cueIcon';
import { Playback } from '../../../../shared/playback/Playback';
import { Cue } from '../../../../shared/cue/Cue';
import { computed, ref } from 'vue';
import { cueSettingsMap } from '@/../shared/cue/cueSettings';
import { VDivider } from 'vuetify/components';

const props = defineProps<{
  playback: Playback
  index: number
  cue: Cue
  active: boolean
}>()

const detailsShown = ref(false);

const increase: CueTypes[] = [
  CueType.If
]
const decrease: CueTypes[] = [
  CueType.EndIf
]
const decreaseIncrease: CueTypes[] = [
  CueType.ElseIf,
  CueType.Else
]

const depth = computed(() => {
  let depth = 0;

  for (let i = 0; i < props.index; i++) {
    const cue = props.playback.cues[i];

    if (increase.includes(cue.type)) {
      depth++;
    } else if (decrease.includes(cue.type)) {
      depth--;
    }
  }

  const currentCue = props.playback.cues[props.index];

  if (decreaseIncrease.includes(currentCue.type)
    || decrease.includes(currentCue.type)) {
    depth--;
  }

  return depth;
})
</script>

<style lang="scss">
.toolbar-transition {
  transition: background-color 2s cubic-bezier(0, 1, 0, 1);
}
</style>