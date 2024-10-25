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
import { suspects } from '../../../shared/assets/suspects';
import { VDialog } from 'vuetify/components';

const admin = useAdmin();
const game = useGameManager();
</script>