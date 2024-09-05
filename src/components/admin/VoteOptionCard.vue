<template>
  <VCard
    flat
    color="background"
  >
    <VToolbar>
      <VToolbarTitle class="ml-3">
        <VAvatar class="mr-2" :rounded="true" color="grey-darken-4">
          <VImg v-if="vote.image" :src="game.getAsset(vote.image)?.content" />
          <VIcon v-else size="1.2rem">mdi-vote</VIcon>
        </VAvatar>

        {{ vote.title }}
        <span VToolbarTitle="text-small text-grey">(ID: {{ vote.id }})</span>
      </VToolbarTitle>

      <VBtn icon>
        <VIcon>mdi-pencil</VIcon>

        <VDialog
          v-model="editDialog"
          persistent
          activator="parent"
          max-width="500"
          scrollable
        >
          <VoteOptionEditCard
            @close="editDialog = false"
            @remove="admin.removeVoteOption(vote.id)"
            :submitFn="admin.editVoteOption"
            :option="vote"
          />
        </VDialog>
      </VBtn>

      <VBtn icon @click="expanded = !expanded">
        <VIcon v-if="expanded">mdi-chevron-up</VIcon>
        <VIcon v-else>mdi-chevron-down</VIcon>
      </VBtn>
    </VToolbar>

    <VExpandTransition>
      <div v-if="expanded">
        <VCardText>
          <VCard>
            <VCardText>
              <VList>
                <VListItem>
                  <VListItemTitle>Beschreibung</VListItemTitle>

                  <VListItemSubtitle>
                    <template v-if="vote.description">
                      {{ vote.description }}
                    </template>
                    <span v-else class="text-grey font-italic">
                      Keine Beschreibung
                    </span>
                  </VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle class="mt-2">Entfernt sich aus dem Pool</VListItemTitle>
                  <VListItemSubtitle>
                    <span>{{ vote.removeSelf ? 'Ja' : 'Nein' }}</span>
                  </VListItemSubtitle>
                </VListItem>
                <VListItem>
                  <VListItemTitle class="mt-2">Spielt Medien</VListItemTitle>
                  <VListItemSubtitle>
                    <span>{{ vote.media ? vote.media : 'Nein' }}</span>
                  </VListItemSubtitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>

          <VCard
            class="mt-2"
            title="Verdächtige"
          >
            <VCardText>
              <VList rounded bg-color="transparent">
                <VListItem
                  v-for="(suspect, i) in shownSuspects"
                  :key="suspect?.id"
                  rounded
                  :class="['bg-background py-3', {
                    'mt-1': i !== 0,
                  }]"
                >
                  <VListItemTitle>
                    {{ suspect?.name }}
                  </VListItemTitle>
                </VListItem>

                <VListItem
                  v-if="!shownSuspects?.length"
                  rounded
                >
                  <VListItemTitle class="text-grey font-italic">
                    Keine Verdächtigen
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>

          <VCard
            class="mt-2"
            title="Optionen"
          >
            <VCardText>
              <VList rounded bg-color="transparent">
                <VListItem
                  v-for="(options, pool, i) in vote.options"
                  :key="pool"
                  rounded
                  :class="['bg-background py-3', {
                    'mt-1': i !== 0,
                  }]"
                >
                  <VListItemTitle class="mb-2">
                    {{ pool }}
                  </VListItemTitle>
    
                  <VChip
                    v-for="option in options"
                    :key="option"
                    class="mr-2"
                  >
                    {{ option }}
                  </VChip>
                </VListItem>

                <VListItem
                  v-if="!vote.options || !Object.keys(vote.options).length"
                  rounded
                >
                  <VListItemTitle class="text-grey font-italic">
                    Keine Optionen
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VCardText>
          </VCard>
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin/index';
import { VoteOption } from '../../../shared/vote';
import { computed, ref } from 'vue';
import VoteOptionEditCard from './VoteOptionEditCard.vue';
import { useGameManager } from '@/store/gameManager';
import { suspects } from '../../../shared/assets/suspects';
import { Suspect } from '../../../shared/suspectDatabase/suspect';

const props = defineProps<{
  vote: VoteOption;
  index: number;
}>();

const game = useGameManager();
const admin = useAdmin();

const editDialog = ref(false);
const expanded = ref(false);

const shownSuspects = computed(() => props.vote.suspectIds?.map(suspectId => suspects.find(s => s.id === suspectId)).filter(Boolean) as Suspect[] ?? []);
</script>