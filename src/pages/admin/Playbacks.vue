<template>
  <VContainer>
    <MediaControl class="mb-4" />
    <GameControl class="mb-4" />

    <VCard class="mb-4">
      <VToolbar>
        <VToolbarTitle>Phase</VToolbarTitle>
      </VToolbar>

      <VCardText>
        <VBtnToggle v-model="phase" mandatory color="primary" variant="tonal">
          <VBtn :value="Phase.Idle">
            {{ phaseToName(Phase.Idle) }}
          </VBtn>
          <VBtn :value="Phase.Vote">
            {{ phaseToName(Phase.Vote) }}
          </VBtn>
          <VBtn :value="Phase.Work">
            {{ phaseToName(Phase.Work) }}
          </VBtn>
        </VBtnToggle>

        <template v-if="phaseChanged">
          <VBtnGroup variant="tonal" class="ml-2">
            <VBtn @click="admin.setPhase(phase)">
              <VIcon>mdi-check</VIcon>
            </VBtn>
            <VBtn @click="newPhase = null">
              <VIcon>mdi-close</VIcon>
            </VBtn>
          </VBtnGroup>
        </template>
      </VCardText>
    </VCard>

    <VCard>
      <VToolbar>
        <VToolbarTitle>Playbacks</VToolbarTitle>
      </VToolbar>

      <VCardText>
        <VBtn
          :color="admin.manualTriggerOverride ? 'primary' : ''"
          variant="tonal"
          class="w-100 mb-4"
          @click="admin.setManualTriggerOverride(!admin.manualTriggerOverride)"
        >
          <VIcon>mdi-hand-back-left</VIcon>
          Manuelle Trigger-Überschreibung {{ admin.manualTriggerOverride ? 'deaktivieren' : 'aktivieren' }}
        </VBtn>

        <template
          v-for="(playback, i) in admin.playbacks"
          :key="i"
        >
          <div v-if="playback.divider" class="mt-4 mb-2">
            <VDivider>
              {{ playback.divider }}
            </VDivider>
          </div>

          <PlaybackCard
            v-else
            :playback="(playback as Playback)"
            :index="admin.playbacks.filter(p => !p.divider).indexOf(playback)"
            :class="{
              'mt-1': i !== 0,
            }"
          />
        </template>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import { useAdmin } from '../../store/admin/index';
import GameControl from '../../components/admin/GameControl.vue';
import PlaybackCard from '../../components/admin/playbacks/PlaybackCard.vue';
import { Playback } from '../../../shared/playback/Playback';
import { useGameManager } from '@/store/gameManager';
import { Phase, phaseToName } from '../../../shared/phase';
import { computed, ref, watch } from 'vue';
import MediaControl from '@/components/admin/MediaControl.vue';
const admin = useAdmin()
const game = useGameManager()

const newPhase = ref<Phase | null>(null)
const newMeta = ref<string | null>(null)

const phase = computed({
  get: () => {
    if (newPhase.value) {
      return newPhase.value
    }

    return game.phase.type
  },
  set: (value: Phase) => {
    newPhase.value = value
  }
})

// const meta = computed({
//   get: () => {
//     if (newMeta.value) {
//       return newMeta.value
//     }

//     return game.phase.meta
//   },
//   set: (value: string) => {
//     newMeta.value = value
//   }
// })

const phaseChanged = computed(() => {
  return newPhase.value !== null || newMeta.value !== null
})

watch(() => game.phase.type, () => {
  newPhase.value = null
  newMeta.value = null
})

watch(() => game.phase.meta, () => {
  newPhase.value = null
  newMeta.value = null
}, { deep: true })
</script>