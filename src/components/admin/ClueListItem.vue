<template>
  <VListItem>
    <template #prepend>
      <VAvatar rounded>
        <VImg
          v-if="game.getAsset(clue.thumbnailAssetId)?.content"
          :src="game.getAsset(clue.thumbnailAssetId)?.content"
          alt="clue.title"
        />
        <VIcon v-else>
          mdi-file-document
        </VIcon>
      </VAvatar>
    </template>
    <VListItemTitle>
      {{ clue.title }} ({{ clue.id }})
    </VListItemTitle>
    <VListItemSubtitle>
      Typ: {{ ({
        images: 'Bilder',
      } as Record<ClueTypes, string>)[clue.type] }} |
      Preis: <VIcon size="1em">mdi-star-four-points-circle</VIcon> {{ clue.cost }}
    </VListItemSubtitle>

    <template #append>
      <slot name="append" />
    </template>
  </VListItem>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import { Clue, ClueTypes } from '../../../shared/clue';

const game = useGameManager()

defineProps<{
  clue: Clue<ClueTypes>
}>()
</script>