<template>
  <VContainer>
    <VCard class="mb-4">
      <VToolbar>
        <VToolbarTitle>
          Angezeigte Verdächtige
        </VToolbarTitle>
        <VBtn>
          <VIcon>mdi-refresh</VIcon>
          Alle zurücksetzen

          <VDialog
            activator="parent"
            max-width="500"
          >
            <template #="{ isActive }">
              <VCard>
                <VToolbar>
                  <VToolbarTitle>
                    Alle Verdächtigen zurücksetzen
                  </VToolbarTitle>

                  <VBtn
                    icon
                    @click="isActive.value = false"
                  >
                    <VIcon>mdi-close</VIcon>
                  </VBtn>
                </VToolbar>
                <VCardText>
                  Möchtest du wirklich alle Verdächtigen zurücksetzen?
                </VCardText>

                <VCardActions>
                  <VSpacer />
                  <VBtn
                    color="error"
                    @click="admin.resetShownSuspects(); isActive.value = false"
                  >
                    Zurücksetzen
                  </VBtn>
                </VCardActions>
              </VCard>
            </template>
          </VDialog>
        </VBtn>
      </VToolbar>
      <VCardText>
        <VList nav>
          <VListItem
            v-for="suspect in suspects"
            :key="suspect.id"
          >
            {{ suspect.name }}

            <template #append>
              <VBtn
                icon
                variant="tonal"
                size="small"
                :color="game.shownSuspects.includes(suspect.id) ? 'primary' : ''"
              >
                <VIcon>
                  {{ game.shownSuspects.includes(suspect.id) ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
                </VIcon>
                
                <VDialog
                  activator="parent"
                  max-width="500"
                >
                  <template #="{ isActive }">
                    <VCard>
                      <VToolbar>
                        <VToolbarTitle>
                          {{ suspect.name }}
                        </VToolbarTitle>

                        <VBtn
                          icon
                          @click="isActive.value = false"
                        >
                          <VIcon>mdi-close</VIcon>
                        </VBtn>
                      </VToolbar>
                      <VCardText>
                        Möchtest du den Verdächtigen wirklich {{ game.shownSuspects.includes(suspect.id) ? 'ausblenden' : 'anzeigen' }}?
                      </VCardText>

                      <VCardActions>
                        <VSpacer />
                        <VBtn
                          color="primary"
                          @click="game.shownSuspects.includes(suspect.id)
                            ? admin.removeShownSuspect(suspect.id)
                            : admin.addShownSuspect(suspect.id); isActive.value = false"
                        >
                          {{ game.shownSuspects.includes(suspect.id) ? 'Ausblenden' : 'Anzeigen' }}
                        </VBtn>
                      </VCardActions>
                    </VCard>
                  </template>
                </VDialog>
              </VBtn>
            </template #append>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>

    <VBtn class="mb-4 w-100">
      Liste aller Hinweiseinträge anzeigen

      <VDialog
        activator="parent"
        max-width="500"
        scrollable
      >
        <template #="{ isActive }">
          <VCard>
            <VToolbar>
              <VToolbarTitle>
                Alle Hinweiseinträge ({{ game.allEntries.length }})
              </VToolbarTitle>

              <VBtn
                icon
                @click="isActive.value = false"
              >
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </VToolbar>
            <VCardText>
              <VCard
                v-for="entry in game.allEntries"
                :key="entry.id"
                class="mb-2"
                flat
                color="background"
              >
                <VCardTitle style="line-height: 1;" class="mt-2">
                  <TextContentRenderer :text-content="entry.title" />
                </VCardTitle>
                <VCardText>
                  <div class="d-flex mb-2 flex-wrap" style="gap: .5rem">
                    <VChip size="small" :color="getSuspectById(entry.suspectId)?.color ?? '#d9dbfb'">
                      {{ getSuspectById(entry.suspectId)?.name ?? 'Allgemein' }}
                    </VChip>
                    <VChip class="mr-2" size="small">
                      {{ entry.id }}
                    </VChip>
                  </div>

                  <TextContentRenderer v-if="entry.description" :text-content="entry.description" />
                </VCardText>
              </VCard>
            </VCardText>
          </VCard>
        </template>
      </VDialog>
    </VBtn>

    <TeamDatabase
      v-for="team in admin.teams" :class="{
        'mb-4': team !== admin.teams[admin.teams.length - 1]
      }"
      :key="team.id"
      :team="team"
    />
  </VContainer>
</template>

<script lang="ts" setup>
import TeamDatabase from '@/components/admin/TeamDatabase.vue';
import { useAdmin } from '@/store/admin';
import { useGameManager } from '@/store/gameManager';
import { getSuspectById, suspects } from '../../../shared/assets/suspects';
import { VDialog } from 'vuetify/components';
import TextContentRenderer from '@/components/TextContentRenderer.vue';

const admin = useAdmin();
const game = useGameManager();
</script>