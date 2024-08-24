<template>
  <VContainer>
    <GameControl class="mb-6" />

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

const admin = useAdmin()
</script>