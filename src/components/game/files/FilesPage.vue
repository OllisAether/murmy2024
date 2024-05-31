<template>
  <div class="files-page">
    <VToolbar color="grey-darken-4" rounded="lg" class="files-page__toolbar">
      <VToolbarTitle>Files</VToolbarTitle>
      <VBtn icon>
        <VIcon>mdi-magnify</VIcon>
      </VBtn>
      <VBtn icon>
        <VIcon>mdi-dots-vertical</VIcon>
      </VBtn>
    </VToolbar>

    <div class="files-page__content">
      <VList nav rounded="lg" class="mt-4">
        <VListItem
          v-for="file in game.files"
          :key="file.name"
        >
          <template #prepend>
            <VAvatar size="48" rounded="lg">
              <VImg :src="game.getAsset(file.asset.name)?.content" cover />
            </VAvatar>
          </template>
          <VListItemTitle>
            {{ file.name }}
          </VListItemTitle>

          <VDialog scrollable activator="parent">
            <VCard>
              <VToolbar>
                <VToolbarTitle>
                  {{ file.name }}
                </VToolbarTitle>

                <VBtn icon>
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </VToolbar>
              <VCardText>
                <VImg :src="game.getAsset(file.asset.name)?.content" cover />
              </VCardText>
            </VCard>
          </VDialog>
        </VListItem>
      </VList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '../../../store/gameManager';

const game = useGameManager()
</script>

<style scoped lang="scss">
.files-page {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    &__title {
      font-size: 1.5rem;
    }

    &__actions {
      display: flex;
      gap: 1rem;
    }
  }
}
</style>