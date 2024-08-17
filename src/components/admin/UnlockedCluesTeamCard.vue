<template>
  <VCard
    flat
    color="background"
  >
    <VToolbar>
      <VToolbarTitle>
        {{ team.name }} ({{ team.id }}) - {{ unlockedClues.length }} Hinweise freigeschalte
      </VToolbarTitle>

      <VBtn icon>
        <VIcon>mdi-plus</VIcon>
        <VDialog max-width="400" activator="parent">
          <template #="{ isActive }">
            <UnlockClueCard :team="team" @close="isActive.value = false" />
          </template>
        </VDialog>
      </VBtn>

      <VBtn icon @click="open = !open">
        <VIcon>{{ open ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</VIcon>
      </VBtn>
    </VToolbar>

    <VExpandTransition>
      <div v-if="open">
        <VList nav rounded bg-color="background">
          <template
            v-for="clue in unlockedClues"
            :key="typeof clue === 'string' ? clue : clue.id"
          >
            <template v-if="typeof clue === 'string'">
              <VListItem>
                <VListItemTitle>
                  Hinweis {{ clue }} nicht gefunden
                </VListItemTitle>
              </VListItem>
            </template>
            <template v-else>
              <ClueListItem :clue="clue">
                <template #append>
                  <VBtn
                    color="error"
                    variant="text"
                    icon
                    size="small"
                  >
                    <VIcon>mdi-close</VIcon>
                    <VDialog activator="parent" max-width="400">
                      <template #="{ isActive }">
                        <VCard>
                          <VToolbar>
                            <VToolbarTitle>
                              Hinweis verriegeln
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
                              Bist du sicher, dass du den Hinweis verriegeln möchtest?
                            </p>
                          </VCardText>
                          <VCardActions>
                            <VSpacer />
                            <VBtn
                              color="error"
                              @click="admin.lockClue(team.id, clue.id); isActive.value = false"
                            >
                              Verriegeln
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
          <VListItem v-if="!unlockedClues.length">
            <VListItemTitle>
              Keine Hinweise freigeschaltet
            </VListItemTitle>
          </VListItem>
        </VList>
      </div>
    </VExpandTransition>
  </VCard>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin';
import UnlockClueCard from './UnlockClueCard.vue';
import ClueListItem from './ClueListItem.vue';
import { Clue, ClueTypes } from '../../../shared/clue';
import { ref } from 'vue';

defineProps<{
  team: { id: string; name: string }
  unlockedClues: (string |  Clue<ClueTypes>)[];
}>();

const admin = useAdmin();

const open = ref(false);
</script>