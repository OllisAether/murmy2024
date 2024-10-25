<template>
  <VContainer>
    <VCard class="mb-4">
      <VToolbar>
        <VToolbarTitle>
          Clues
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
                    Alle Clues zurücksetzen
                  </VToolbarTitle>

                  <VBtn
                    icon
                    @click="isActive.value = false"
                  >
                    <VIcon>mdi-close</VIcon>
                  </VBtn>
                </VToolbar>
                <VCardText>
                  Möchtest du wirklich alle Clues zurücksetzen?
                </VCardText>

                <VCardActions>
                  <VSpacer />
                  <VBtn
                    color="error"
                    @click="admin.clearAvailableClues(); isActive.value = false"
                  >
                    Zurücksetzen
                  </VBtn>
                </VCardActions>
              </VCard>
            </template>
          </VDialog>
        </VBtn>
      </VToolbar>

      <VList>
        <template
          v-for="clue in clues"
          :key="typeof clue === 'string' ? clue : clue.id"
        >
          <template v-if="typeof clue === 'string'">
            <VListItem>
              <VListItemTitle>
                Hinweis {{ clue }} nicht gefunden
              </VListItemTitle>

              <template #append>
                <VBtn
                  color="error"
                  variant="tonal"
                  size="small"
                  icon
                  @click="admin.removeClue(clue)"
                >
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </template>
            </VListItem>
          </template>

          <template v-else>
            <ClueListItem :clue="clue">
              <template #append>
                <VBtn
                  :color="game.clues.available.includes(clue.id) ? 'primary' : 'default'"
                  variant="tonal"
                  icon
                  size="small"
                >
                  <VIcon>mdi-eye-outline</VIcon>

                  <VDialog max-width="400" activator="parent">
                    <template #="{ isActive }">
                      <VCard>
                        <VToolbar>
                          <VToolbarTitle>
                            {{ game.clues.available.includes(clue.id) ? 'Hinweis verbergen' : 'Hinweis anzeigen' }}
                          </VToolbarTitle>

                          <VBtn
                            icon
                            @click="isActive.value = false"
                          >
                            <VIcon>mdi-close</VIcon>
                          </VBtn>
                        </VToolbar>

                        <VCardText>
                          <p>
                            {{ game.clues.available.includes(clue.id) ? 'Bist du sicher, dass du den Hinweis verbergen möchtest?' : 'Bist du sicher, dass du den Hinweis anzeigen möchtest?' }}
                          </p>
                        </VCardText>

                        <VCardActions>
                          <VSpacer />
                          <VBtn
                            color="error"
                            v-if="game.clues.available.includes(clue.id)"
                            @click="admin.removeClue(clue.id); isActive.value = false"
                          >
                            Verbergen
                          </VBtn>
                          <VBtn
                            color="primary"
                            v-else
                            @click="admin.addClue(clue.id); isActive.value = false"
                          >
                            Anzeigen
                          </VBtn>
                        </VCardActions>
                      </VCard>
                    </template>
                  </VDialog>
                </VBtn>
              </template>
            </ClueListItem>
          </template>
        </template>
      </VList>
    </VCard>

    <VCard class="mb-4">
      <VToolbar>
        <VToolbarTitle>
          Freigeschaltete Clues
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
                    Alle freigeschalteten Clues zurücksetzen
                  </VToolbarTitle>

                  <VBtn
                    icon
                    @click="isActive.value = false"
                  >
                    <VIcon>mdi-close</VIcon>
                  </VBtn>
                </VToolbar>
                <VCardText>
                  Möchtest du wirklich alle freigeschalteten Clues zurücksetzen?
                </VCardText>

                <VCardActions>
                  <VSpacer />
                  <VBtn
                    color="error"
                    @click="admin.clearUnlockedClues(); isActive.value = false"
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
        <UnlockedCluesTeamCard
          v-for="team in admin.teams"
          :key="team.id"
          :class="{
            'mb-2': team !== admin.teams[admin.teams.length - 1]
          }"
          :team="team"
          :unlockedClues="unlockedClues[team.id]"
        />
      </VCardText>
    </VCard>

    <VCard class="mb-4">
      <VToolbar>
        <VToolbarTitle>
          Ermittlungspunkte:
          <VIcon size="1em">mdi-star-four-points-circle</VIcon> {{ admin.clues.investigationCoins.total }} verfügbar
        </VToolbarTitle>

        <VBtn icon>
          <VIcon>mdi-pencil</VIcon>

          <VDialog activator="parent" max-width="300">
            <template #="{ isActive }">
              <SetCoinsCard
                :startValue="admin.clues.investigationCoins.total"
                @close="isActive.value = false"
                @set="(val) => admin.setGivenInvestigationCoins(val)"
              />
            </template>
          </VDialog>
        </VBtn>
      </VToolbar>

      <VCardText>
        <VList bg-color="background" rounded>
          <VListItem
            flat
            color="background"
            v-for="team in admin.teams"
            :key="team.id"
            :class="{
              'mb-4': team !== admin.teams[admin.teams.length - 1]
            }"
          >
            <div class="d-flex">
              <div class="flex-grow-1">
                <VListItemTitle>
                  {{ team.name }} ({{ team.id }}) - <VIcon size="1em">mdi-star-four-points-circle</VIcon> {{ admin.clues.investigationCoins.total - (admin.clues.investigationCoins.usedByTeam[team.id] ?? 0) }}
                </VListItemTitle>
                <VListItemSubtitle>
                  Ausgegeben: <VIcon size="1em">mdi-star-four-points-circle</VIcon> {{ admin.clues.investigationCoins.usedByTeam[team.id] ?? 0 }}
                </VListItemSubtitle>
              </div>
              <VBtn icon size="small" variant="text">
                <VIcon>mdi-pencil</VIcon>

                <VDialog activator="parent" max-width="300">
                  <template #="{ isActive }">
                    <SetCoinsCard
                      title="Ermittlungspunktedelta setzen"
                      :startValue="admin.clues.investigationCoins.usedByTeam[team.id] ?? 0"
                      @close="isActive.value = false"
                      @set="(val) => admin.setInvestigationCoinDelta(team.id, val)"
                    />
                  </template>
                </VDialog>
              </VBtn>
            </div>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>

    <VCard>
      <VToolbar>
        <VToolbarTitle>
          Haupthinweise
        </VToolbarTitle>
      </VToolbar>

      <VCardText>
        <div class="mb-4 d-flex align-center">
          <div class="flex-grow-1">
            Weitere abfragen werden zufällig zugewiesen:
          </div>

          <VBtnToggle
            class="flex-shrink-0"
            :model-value="admin.clues.assignFurtherMainClueTypesRandomly"
            color="primary"
            variant="tonal"
            density="compact"
          >
            <VBtn
              :value="true"
              @click="admin.setAssignFurtherMainClueTypesRandomly(true)"
            >Ja</VBtn>
            <VBtn
              :value="false"
              @click="admin.setAssignFurtherMainClueTypesRandomly(false)"
            >Nein</VBtn>
          </VBtnToggle>
        </div>

        <VBtn class="mb-4" variant="tonal" @click="admin.assignRandomMainClueTypeForAllTeams()">
          Zuweisung zufällig verteilen
        </VBtn>

        <VList bg-color="background" rounded>
          <VListItem
            flat
            color="background"
            v-for="team in admin.teams"
            :key="team.id"
            :class="{
              'mb-4': team !== admin.teams[admin.teams.length - 1]
            }"
          >
            <div class="d-flex flex-wrap align-center">
              <VListItemTitle class="my-1">
                {{ team.name }} ({{ team.id }})
              </VListItemTitle>
              <div class="d-flex flex-grow-1">
                <VSpacer />
                <VBtn
                  variant="tonal"
                  icon
                  size="small"
                  :color="admin.clues.mainClueUnlocked[team.id] ? 'primary' : 'default'"
                  @click="admin.setMainClueUnlocked(team.id, !admin.clues.mainClueUnlocked[team.id])"
                >
                  <VIcon>{{ admin.clues.mainClueUnlocked[team.id] ? 'mdi-lock-open' : 'mdi-lock' }}</VIcon>
                </VBtn>
                <VDivider vertical class="mx-2" />
                <VBtn
                  variant="tonal"
                  icon
                  size="small"
                  :color="admin.clues.mainClueType[team.id] === 'diary' ? 'primary' : 'default'"
                  @click="admin.setMainClueType(team.id, 'diary')"
                >
                  <VIcon>mdi-book-open-variant</VIcon>
                </VBtn>
                <VBtn
                  variant="tonal"
                  class="mx-1"
                  icon
                  size="small"
                  :color="admin.clues.mainClueType[team.id] === 'phone' ? 'primary' : 'default'"
                  @click="admin.setMainClueType(team.id, 'phone')"
                >
                  <VIcon>mdi-cellphone</VIcon>
                </VBtn>
                <VBtn
                  variant="tonal"
                  :color="!['diary', 'phone'].includes(admin.clues.mainClueType[team.id]) ? 'primary' : 'default'"
                  @click="admin.setMainClueType(team.id, null)"
                >
                  Keine / Zufall
                </VBtn>
              </div>
            </div>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin';
import { useGameManager } from '@/store/gameManager';
import { clues as clueList } from '../../../shared/assets/clues/index';
import { Clue, ClueTypes } from '../../../shared/clue';
import { computed } from 'vue';
import ClueListItem from '@/components/admin/ClueListItem.vue';
import UnlockedCluesTeamCard from '@/components/admin/UnlockedCluesTeamCard.vue';
import SetCoinsCard from '@/components/admin/SetCoinsCard.vue';
import { VIcon } from 'vuetify/components';

const game = useGameManager();
const admin = useAdmin();

const clues = computed(() => {
  return [...clueList, ...game.clues.available.filter(id => !clueList.some(clue => clue.id === id))];
});

const unlockedClues = computed(() => {
  const unlocked: Record<string, (Clue<ClueTypes> | string)[]> = {};

  for (const team of admin.teams) {
    unlocked[team.id] = admin.clues.unlocked[team.id]
      ?.map(id => clueList.find(clue => clue.id === id) ?? id) ?? [];
  }

  return unlocked;
})
</script>