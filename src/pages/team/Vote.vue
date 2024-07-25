<template>
  <div>
    <VContainer>
      {{ game.voted }}
      <VList>
        <VListItem
          v-for="candidate in game.candidates"
          :key="candidate.id"
          @click="vote(candidate.id)"
          color="primary"
          :active="game.voted === candidate.id"
          :disabled="game.voted !== false"
        >
          <VListItemTitle>
            {{ candidate }}
          </VListItemTitle>
        </VListItem>
      </VList>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';

const game = useGameManager()

function vote (option: string) {
  game.addVote(option)
}
</script>