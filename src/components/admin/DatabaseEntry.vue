<template>
  <VListItem>
    <VListItemTitle>
      {{ entry.suspectId }} - {{ getRawText(entry.title) }}
    </VListItemTitle>
    <VListItemSubtitle>
      {{ entry.id }}
    </VListItemSubtitle>

    <template #append>
      <VBtn color="error" icon size="small" variant="tonal">
        <VIcon>mdi-delete</VIcon>

        <VDialog v-model="deleteDialog" max-width="400" activator="parent">
          <VCard title="Eintrag löschen">
            <VCardText>
              <p>Bist du sicher, dass du den Eintrag löschen möchtest?</p>
            </VCardText>
            <VCardActions>
              <VBtn @click="deleteDialog = false">Abbrechen</VBtn>
              <VBtn color="error" @click="admin.removeEntry(team.id, entry.id)">Löschen</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VBtn>
    </template>
  </VListItem>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin';
import { computed, ref } from 'vue';
import { useGameManager } from '@/store/gameManager';
import { getRawText } from '../../../shared/textContent';

const props = defineProps<{
  team: {
    id: string
    name: string
    code: string
  },
  entryId: string
}>();

const game = useGameManager();

const entry = computed(() => game.allEntries.find(e => e.id === props.entryId) ?? {
  id: props.entryId,
  suspectId: '???',
  title: 'Eintrag nicht gefunden'
});

const deleteDialog = ref(false);

const admin = useAdmin();
</script>