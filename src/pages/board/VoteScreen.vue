<template>
  <BoardScreen>
    <!-- <pre>{{ game.vote }}</pre> -->
    <div
      v-for="candidate in game.candidates"
      :key="candidate.id"
    >
      {{ candidate }}

      {{ candidate.votes?.length }} / {{ game.vote.session?.totalPossibleVotes }}
    </div>
    <div v-if="nextTiebreaker">
      Tiebreaker
    </div>
    <div v-if="isRandom">
      Random

      {{ game.vote.session?.winner }}
    </div>
  </BoardScreen>
</template>

<script setup lang="ts">
import BoardScreen from '@/components/board/BoardScreen.vue'
import { useGameManager } from '@/store/gameManager';
import { computed, watch } from 'vue';

const game = useGameManager()

const nextTiebreaker = computed(() => {
  return game.vote.session?.voteResults?.next === 'tiebreaker'
})

const isRandom = computed(() => {
  return game.vote.session?.isRandom
})

watch(nextTiebreaker, (value) => {
  if (value) {
    setTimeout(() => {
      game.triggerBoardSkip()
    }, 3000)
  }
}, { immediate: true })

watch(isRandom, (value) => {
  if (value) {
    setTimeout(() => {
      game.triggerBoardSkip()
    }, 3000)
  }
}, { immediate: true })
</script>