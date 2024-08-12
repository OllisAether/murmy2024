<template>
  <VListItem>
    <VListItemTitle>
      {{ entry.suspectId }} - {{ entry.matterId }}
    </VListItemTitle>
    <VListItemSubtitle>
      {{ entry.matterId }}
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
              <VBtn color="error" @click="admin.removeEntry(team.id, entry.matterId)">Löschen</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VBtn>
    </template>
  </VListItem>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin';
import { Entry } from '../../../shared/suspectDatabase/entry';
import { ref } from 'vue';

defineProps<{
  team: {
    id: string
    name: string
    code: string
  },
  entry: Entry
}>();

const deleteDialog = ref(false);

const admin = useAdmin();
</script>