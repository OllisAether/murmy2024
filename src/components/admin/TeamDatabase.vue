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
                :items="game.allEntries
                  .filter(entry => !admin.suspectDatabases[team.id]?.entries.find(e => e === entry.id))
                  .map(entry => ({
                    title: `${getRawText(entry.title)} - ${entry.suspectId} (${entry.id})`,
                    value: entry.id
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
          v-for="entryId in admin.suspectDatabases[team.id]?.entries"
          :key="entryId"
          :team="team"
          :entryId="entryId"
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
import { useGameManager } from '@/store/gameManager';
import { getRawText } from '../../../shared/textContent';

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

const newEntry = ref<string>()
function addEntry() {
  if (newEntry.value) {
    admin.addEntry(props.team.id, newEntry.value)
    dialog.value = false
    newEntry.value = undefined
  }
}
</script>