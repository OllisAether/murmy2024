<template>
  <VContainer>
    <MediaControl class="mb-4" />

    <VCard>
      <VToolbar>
        <VToolbarTitle>Media</VToolbarTitle>
      </VToolbar>

      <VCardText>
        <VList>
          <VListItem
            v-for="(media, i) in media"
            :key="i"
            :class="{
              'mt-1': i !== 0,
            }"
          >
            <template #prepend>
              <VIcon v-if="getType(media) === 'video'">mdi-movie-outline</VIcon>
              <VIcon v-else-if="getType(media) === 'audio'">mdi-music</VIcon>
              <VIcon v-else>mdi-file</VIcon>
            </template>
            
            <VListItemTitle>{{ media.name }}</VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import MediaControl from '@/components/admin/MediaControl.vue';
import { useAdmin } from '@/store/admin/index';
import { useGameManager } from '@/store/gameManager';
import { computed } from 'vue';
import { Asset } from '../../../shared/asset';

const admin = useAdmin()
const game = useGameManager()

function getType (asset: Asset) {
  const mime = asset.metadata?.mime;
  const url = asset.url;

  if (mime?.startsWith('video') || url.endsWith('.mp4') || url.endsWith('.webm')) {
    return 'video';
  }

  if (mime?.startsWith('audio') || url.endsWith('.mp3') || url.endsWith('.wav')) {
    return 'audio';
  }

  if (mime?.startsWith('image') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.webp')) {
    return 'image';
  }

  return 'file';
}

const media = computed(() => [
  ...admin.assets.board,
  ...admin.assets.shared
].filter((asset) => {
  const type = getType(asset);
  return type === 'video' || type === 'audio';
}))
</script>