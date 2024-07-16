<template>
  <div>
    <VContainer>
      <VList nav bg-color="transparent">
        <VListItem
          v-for="(option, i) in game.vote?.voteOptions ?? []"
          :key="i"
          @click="vote(i)"
          color="primary"
          :active="game.voted === i"
          :disabled="game.voted !== null"
        >
          <VListItemTitle>
            {{ mediaMap[option]?.displayName ?? option }}
          </VListItemTitle>
        </VListItem>
      </VList>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { mediaMap } from '@/assets/media';
import { useGameManager } from '@/store/gameManager';

const game = useGameManager()

function vote (index: number) {
  if (game.voted !== null) return
  game.addVote(index)
}
</script>