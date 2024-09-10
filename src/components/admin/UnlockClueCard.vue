<template>
  <VCard>
    <VToolbar>
      <VToolbarTitle>
        Clues freischalten für {{ props.team.name }}
      </VToolbarTitle>

      <VBtn
        icon
        @click="emit('close')"
      >
        <VIcon>mdi-close</VIcon>
      </VBtn>
    </VToolbar>
      
    <div class="my-2">
      <ClueListItem
        v-for="clue in clues"
        :key="clue.id"
        :clue="clue"
      >
        <template #append>
          <VBtn
            :color="admin.clues.unlocked[team.id]?.includes(clue.id) ? 'primary' : 'default'"
            @click="toggleClue(clue.id)"
            icon
            variant="tonal"
            size="small"
          >
            <VIcon>
              {{ admin.clues.unlocked[team.id]?.includes(clue.id) ? 'mdi-lock-open' : 'mdi-lock' }}
            </VIcon>
          </VBtn>
        </template>
      </ClueListItem>
    </div>

    <VCardActions>
      <VSpacer />
      <VBtn
        color="error"
        @click="emit('close')"
      >
        Schließen
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin';
import { clues } from '../../../shared/assets/clues/index';
import ClueListItem from './ClueListItem.vue';

const props = defineProps<{
  team: { id: string; name: string }
}>();

const emit = defineEmits(['close']);

const admin = useAdmin();

function toggleClue(clueId: string) {
  if (admin.clues.unlocked[props.team.id]?.includes(clueId)) {
    admin.lockClue(props.team.id, clueId);
  } else {
    admin.unlockClue(props.team.id, clueId);
  }
}
</script>