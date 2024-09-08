<template>
  <VContainer>
    <VCard class="mb-2">
      <VToolbar>
        <VToolbarTitle>Aktionen</VToolbarTitle>
      </VToolbar>
      
      <VCardText>
        <VBtn
          variant="tonal"
          class="w-100"
        >
          <VIcon>mdi-delete</VIcon>
          Alle Lösungen löschen

          <VDialog
            activator="parent"
            max-width="290"
          >
            <template #="{ isActive }">
              <VCard>
                <VCardTitle class="headline">Löschen</VCardTitle>
                <VCardText>
                  Möchtest du wirklich alle Lösungen löschen?
                </VCardText>
                <VCardActions>
                  <VBtn
                    @click="admin.clearForms(); isActive.value = false"
                    color="error"
                  >
                    Löschen
                  </VBtn>
                  <VBtn @click="isActive.value = false">
                    Abbrechen
                  </VBtn>
                </VCardActions>
              </VCard>
            </template>
          </VDialog>
        </VBtn>
      </VCardText>
    </VCard>

    <VCard>
      <VToolbar>
        <VToolbarTitle>Ergebnisse</VToolbarTitle>
      </VToolbar>

      <VCardText>
        <VCard
          v-for="(result, i) in results"
          :key="result.team.id"
          color="background"
          flat
          :class="{
            'mb-2': i !== results.length - 1
          }"
        >
          <VCardTitle>
            {{ getPosition(result.score, result.entries) }}.

            {{ result.team.name }} (ID: {{ result.team.id }})
          </VCardTitle>
          <VCardText>
            <VChip class="mr-2">
              {{ result.score }} Punkte
            </VChip>

            <VChip>
              {{ result.entries }} Einträge
            </VChip>
          </VCardText>
        </VCard>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin';
import { computed } from 'vue';

const admin = useAdmin();

const results = computed(() => {
  return admin.forms.results.sort((a, b) => {
    if (a.score === b.score) {
      return a.entries - b.entries;
    }

    return b.score - a.score;
  });
})

function getPosition (score: number, entries: number) {
  return results.value.findIndex(result => result.score === score && result.entries === entries) + 1;
}
</script>