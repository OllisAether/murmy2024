<template>
  <VContainer>
    <VCard>
      <VToolbar>
        <VToolbarTitle>Umfrageoptionen</VToolbarTitle>

        <VBtn icon>
          <VIcon>mdi-plus</VIcon>

          <VDialog
            persistent
            v-model="addVoteOptionDialog"
            activator="parent"
            max-width="500"
            scrollable
          >
            <VoteOptionEditCard
              @close="addVoteOptionDialog = false"
              :submitFn="admin.addVoteOption"
            />
          </VDialog>
        </VBtn>
      </VToolbar>

      <VCardText>
        <VoteOptionCard
          v-for="(vote, i) in game.voteOptions"
          :vote="vote"
          :index="i"
          :class="{
            'mt-1': i !== 0,
          }"
        />
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import { useAdmin } from '../../store/admin/index';
import VoteOptionCard from '@/components/admin/VoteOptionCard.vue';
import { ref } from 'vue';
import VoteOptionEditCard from '@/components/admin/VoteOptionEditCard.vue';

const admin = useAdmin()

const game = useGameManager()

const addVoteOptionDialog = ref(false)
</script>