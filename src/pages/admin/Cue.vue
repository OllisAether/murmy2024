<template>
  <VContainer>
    <GameControl class="mb-6" />

    <VCard>
      <VToolbar>
        <VToolbarTitle>Cues</VToolbarTitle>

        <div>
          Cue:
          {{ admin.cues[admin.cueIndex]?.type ?? 'Keine Cue' }}
        </div>

        <VBtn icon>
          <VIcon>mdi-plus</VIcon>

          <VDialog
            scrollable
            v-model="addCueDialog"
            activator="parent"
            :max-width="useDisplay().smAndDown.value ? undefined : 400"
            :transition="useDisplay().smAndDown.value ? 'dialog-bottom-transition' : undefined"
            persistent
            :fullscreen="useDisplay().smAndDown.value"
          >
            <NewCueCard @submit="addCue" @close="addCueDialog = false" />
          </VDialog>
        </VBtn>
      </VToolbar>

      <VCardText>
        <VCard
          v-if="admin.cues.length === 0"
          class="mb-2"
          flat
          bg-color="#121212"
          color="grey"
          rounded="lg"
          style="border-style: dashed;"
          variant="outlined"
        >
          <VCardText class="d-flex align-center">
            Keine Cues vorhanden

            <VSpacer />

            <VBtn
              @click="addCueDialog = true"
              variant="tonal"
              color="primary"
            >
              Cue hinzufügen
            </VBtn>
          </VCardText>
        </VCard>

        <CueCard
          v-for="(cue, i) in admin.cues"
          :key="i"
          :cue="cue"
          :i="i"
        />
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import { useAdmin } from '../../store/admin';
import { CueJson } from '../../../shared/cue';
import { ref } from 'vue';
import GameControl from '../../components/admin/GameControl.vue';
import CueCard from '../../components/admin/CueCard.vue';
import NewCueCard from '../../components/admin/cueCreator/NewCueCard.vue';
import { useDisplay } from 'vuetify';

const admin = useAdmin()

const addCueDialog = ref(false)

function addCue(cue: CueJson) {
  admin.addCue(cue)
  addCueDialog.value = false
}
</script>