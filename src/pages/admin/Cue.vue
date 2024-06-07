<template>
  <VContainer>
    <VCard>
      <VToolbar>
        <VToolbarTitle>Cues</VToolbarTitle>
        <VBtn @click="admin.startRecord()">
          Start Record
        </VBtn>
        <VBtn @click="admin.stopRecord()">
          Stop Record
        </VBtn>
        <VBtn @click="admin.skipRecord()">
          Skip Record
        </VBtn>

        <VSpacer />
        
        <VBtn @click="admin.stopCue()">
          Stop Cue
        </VBtn>
        <VBtn @click="admin.skipCue()">
          Skip Cue
        </VBtn>

        <div>
          Cue: 
          {{ admin.cues[admin.cueIndex]?.type ?? 'Kein Cue' }}, {{ admin.cueIndex }}
        </div>

        <VBtn icon>
          <VIcon>mdi-plus</VIcon>

          <VDialog v-model="addCueDialog" max-width="400" activator="parent">
            <VCard>
              <VToolbar>
                <VToolbarTitle>
                  Neue Cue
                </VToolbarTitle>
                <VBtn icon @click="addCueDialog = false">
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </VToolbar>
              
              <VForm @submit.prevent="">
              <VCardText>
                  <VSelect
                    v-model="newCue.type"
                    :items="[
                      { title: 'Wartezeit', value: CueType.Idle },
                      { title: 'Pause', value: CueType.Break },
                      { title: 'Arbeitsphase', value: CueType.Clue },
                      { title: 'Hinweisrunde', value: CueType.Vote },
                      { title: 'Endrunde', value: CueType.Quiz },
                      { title: 'Tutorial', value: CueType.Tutorial },
                    ]"
                    label="Typ"
                    outlined
                  />

                  <VTextField
                    v-model="newCue.duration"
                    label="Dauer"
                    outlined
                    type="number"
                    v-if="[
                      CueType.Break,
                      CueType.Clue,
                      CueType.Quiz,
                      CueType.Vote
                    ].includes(newCue.type)"
                    :rules="[
                      v => !!v || 'Dauer ist erforderlich',
                      v => v >= 0 || 'Dauer muss positiv sein'
                    ]"
                  />
                  <VTextField
                    v-model="newCue.duration"
                    label="Dauer (Optional)"
                    outlined
                    type="number"
                    v-if="newCue.type === CueType.Idle"
                  />

                  <VSelect
                    v-model="newCue.unlockClues"
                    :items="[
                      'Hinweis 1',
                      'Hinweis 2',
                      'Hinweis 3',
                      'Hinweis 4',
                      'Hinweis 5',
                      'Hinweis 6',
                      'Hinweis 7',
                      'Hinweis 8',
                      'Hinweis 9',
                      'Hinweis 10',
                    ]"
                    label="Hinweise"
                    outlined
                    multiple
                    chips
                    closable-chips
                    v-if="newCue.type === CueType.Vote"
                  />
                </VCardText>
                
                <VCardActions>
                  <VBtn
                    color="primary"
                    type="submit"
                  >
                    Hinzufügen
                  </VBtn>
                </VCardActions>
              </VForm>
            </VCard>
          </VDialog>
        </VBtn>
      </VToolbar>

      <VCardText>
        <VCard v-for="(cue, i) in admin.cues" :key="i" class="mb-2" flat color="#121212" rounded="lg">
          <VCardTitle>
            <template v-if="cue.type === CueType.Break">
              Pause
            </template>
            <template v-else-if="cue.type === CueType.Clue">
              Arbeitsphase
            </template>
            <template v-else-if="cue.type === CueType.Idle">
              Wartezeit
            </template>
            <template v-else-if="cue.type === CueType.Quiz">
              Endrunde
            </template>
            <template v-else-if="cue.type === CueType.Tutorial">
              Tutorial
            </template>
            <template v-else-if="cue.type === CueType.Vote">
              Hinweisrunde
            </template>

            - {{ moment.duration(cue.duration).humanize({ ss: 0 }) ?? 'Keine Dauer' }}
          </VCardTitle>

          <VCardText v-if="cue.type === CueType.Vote">
            <p class="mb-4">
              Hinweise:
            </p>

            <VChip v-for="(vote, i) in cue.unlockClues" :key="i" color="primary" class="mr-2" >
              {{ vote }}
            </VChip>
          </VCardText>
        </VCard>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { useAdmin } from '../../store/admin';
import { CueJson, CueType } from '../../../shared/cue';
import { reactive, ref } from 'vue';

const admin = useAdmin()

const addCueDialog = ref(false)
const newCue = reactive<CueJson>({
  type: CueType.Idle,
  duration: undefined,
  voteOptions: [],
  unlockClues: [],
})
</script>