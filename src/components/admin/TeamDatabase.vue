<template>
  <VCard :elevation="0" :class="{
    'mb-4': team !== admin.teams[admin.teams.length - 1]
  }">
    <VToolbar>
      <VToolbarTitle>
        {{ team.name }} ({{ team.id }})
      </VToolbarTitle>

      <VBtn icon>
        <VIcon>mdi-plus</VIcon>

        <VDialog v-model="dialog" persistent max-width="400" activator="parent">
          <VCard title="Eintrag hinzufügen">
            <VCardText>
              <VSelect
                variant="outlined"
                v-model="newEntry"
                :items="game.collectAllEntries()
                  .filter(entry => !admin.suspectDatabases[team.id]?.entries.find(e => e.matterId === entry.matterId))
                  .map(entry => ({
                    title: `${entry.title} - ${entry.suspectId} (${entry.matterId})`,
                    value: entry
                  }))"
                label="Eintrag"
              />
            </VCardText>

            <VCardActions>
              <VBtn @click="dialog = false">
                Abbrechen
              </VBtn>
              <VBtn @click="addEntry" color="primary">
                Hinzufügen
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VBtn>
    </VToolbar>
    <VCardText>
      <VList nav rounded bg-color="background">
        <DatabaseEntry
          v-for="entry in admin.suspectDatabases[team.id]?.entries"
          :key="entry.matterId"
          :team="team"
          :entry="entry"
        />
        <VListItem v-if="!admin.suspectDatabases[team.id]?.entries.length">
          <VListItemTitle>
            Keine Einträge
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<script lang="ts" setup>
import DatabaseEntry from '@/components/admin/DatabaseEntry.vue';
import { useAdmin } from '@/store/admin';
import { ref } from 'vue';
import { Entry } from '../../../shared/suspectDatabase/entry';
import { useGameManager } from '@/store/gameManager';

const admin = useAdmin()
const game = useGameManager()

const props = defineProps<{
  team: {
    id: string
    name: string
    code: string
  }
}>()

const dialog = ref(false)

const newEntry = ref<Entry>()
function addEntry() {
  if (newEntry.value) {
    admin.addEntry(props.team.id, newEntry.value)
    dialog.value = false
    newEntry.value = undefined
  }
}
</script>