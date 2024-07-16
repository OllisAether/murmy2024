<template>
  <BoardScreen>
    <div
      v-for="(option, i) in game.vote?.voteOptions ?? []"
      :key="i"
    >
      <div>
        <div>
          {{ mediaMap[option]?.displayName ?? option }}
        </div>
      </div>
    </div>
  </BoardScreen>
</template>

<script setup lang="ts">
import { mediaMap } from '@/assets/media';
import BoardScreen from '@/components/board/BoardScreen.vue'
import { useGameManager } from '@/store/gameManager';

const game = useGameManager()
</script>