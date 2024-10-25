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
                  <VBtn @click="isActive.value = false">
                    Abbrechen
                  </VBtn>
                  <VBtn
                    @click="admin.clearForms(); isActive.value = false"
                    color="error"
                  >
                    Löschen
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
        <VToolbarTitle>Lösungsbögen</VToolbarTitle>
      </VToolbar>

      <VCardText>
        <VCard
          v-for="(form, i) in forms"
          :key="form.result.team.id"
          color="background"
          flat
          :class="{
            'mb-2': i !== forms.length - 1
          }"
        >
          <VCardTitle>
            {{ getPosition(form.result.score, form.result.entries) }}.

            <VChip color="primary">
              {{ form.result.score }} pt
            </VChip>

            {{ form.result.team.name }}

            <span style="font-size: .5em;">
              (ID: {{ form.result.team.id }})
            </span>
          </VCardTitle>
          <VCardText>

            <VChip class="mr-2">
              {{ form.result.entries }} Einträge
            </VChip>

            <VChip class="mr-2">
              {{ form.submitted ? 'Abgegeben' : 'Nicht abgegeben' }}
            </VChip>

            <VChip>
              Seite: {{ form.page + 1 }}
            </VChip>
          </VCardText>

          <VDialog
            activator="parent"
            max-width="400"
          >
            <template #="{ isActive }">
              <VCard>
                <VToolbar>
                  <VToolbarTitle>
                    Lösungsbogen von {{ form.result.team.name }}
                  </VToolbarTitle>

                  <template #append>
                    <VBtn
                      icon
                      @click="isActive.value = false"
                    >
                      <VIcon>mdi-close</VIcon>
                    </VBtn>
                  </template>
                </VToolbar>
                <VCardText>
                  <VChip class="mr-2">
                    {{ form.result.entries }} Einträge
                  </VChip>

                  <div class="d-flex align-center my-4">
                    <VBtn
                      :disabled="form.page <= 0"
                      icon
                      variant="tonal"
                      @click="admin.setFormPage(form.result.team.id, form.page - 1)"
                    >
                      <VIcon>mdi-arrow-left</VIcon>
                    </VBtn>
                    <div class="flex-grow-1 text-center">
                      Seite: {{ form.page + 1 }}
                    </div>
                    <VBtn
                      :disabled="form.page >= formPageLength - 1"
                      icon
                      variant="tonal"
                      @click="admin.setFormPage(form.result.team.id, form.page + 1)"
                    >
                      <VIcon>mdi-arrow-right</VIcon>
                    </VBtn>
                  </div>

                  <VBtn
                    class="w-100 mb-2"
                    variant="tonal"
                    @click="toggleFormSubmit(form.result.team.id)"
                  >
                    {{ form.submitted ? 'Zurückgeben' : 'Abgeben' }}
                  </VBtn>
                  <VBtn
                    class="w-100"
                    color="error"
                    variant="tonal"
                  >
                    <VIcon>mdi-delete</VIcon>
                    Löschen
  
                    <VDialog
                      activator="parent"
                      max-width="290"
                    >
                      <template #="{ isActive }">
                        <VCard>
                          <VCardTitle class="headline">Löschen</VCardTitle>
                          <VCardText>
                            Möchtest du wirklich die Lösung von {{ form.result.team.name }} löschen?
                          </VCardText>
                          <VCardActions>
                            <VBtn @click="isActive.value = false">
                              Abbrechen
                            </VBtn>
                            <VBtn
                              @click="admin.clearForm(form.result.team.id); isActive.value = false"
                              color="error"
                            >
                              Löschen
                            </VBtn>
                          </VCardActions>
                        </VCard>
                      </template>
                    </VDialog>
                  </VBtn>
                </VCardText>
              </VCard>
            </template>
          </VDialog>
        </VCard>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin';
import { computed } from 'vue';
import { VChip, VDialog, VToolbar, VToolbarTitle } from 'vuetify/components';
import { form } from '@/../shared/assets/form'

const admin = useAdmin();

const formPageLength = form.length;
const forms = computed(() => {
  return admin.forms.results.sort((a, b) => {
    if (a.score === b.score) {
      return b.entries - a.entries;
    }

    return b.score - a.score;
  }).map(result => ({
    result,
    page: admin.forms.pages[result.team.id] ?? 0,
    submitted: admin.forms.submitted.includes(result.team.id)
  }));
})

function getPosition (score: number, entries: number) {
  return forms.value.findIndex(form => form.result.score === score && form.result.entries === entries) + 1;
}

function toggleFormSubmit (teamId: string) {
  const submitted = admin.forms.submitted.includes(teamId);

  admin.setSubmittedForm(teamId, !submitted);
}
</script>