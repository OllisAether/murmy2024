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

            <template #append>
              <VBtn
                icon
                variant="tonal"
                :color="game.watchedMedia.includes(media.name) ? 'primary' : 'default'"
                size="small"
                class="mr-2"
                @click="toggleWatched(media)"
              >
                <VIcon>mdi-eye-outline</VIcon>
              </VBtn>

              <VBtn
                icon
                variant="tonal"
                size="small"
                v-if="game.currentMedia !== media.name"
                @click="admin.setMedia(media.name)"
              >
                <VIcon>mdi-play</VIcon>
              </VBtn>
              <template v-else>
                <VBtn
                  icon
                  size="small"
                  variant="tonal"
                  color="primary"
                  v-if="admin.media.state === 'playing'"
                  @click="admin.pauseMedia"
                >
                  <VIcon>mdi-pause</VIcon>
                </VBtn>
                <VBtn
                  icon
                  size="small"
                  variant="tonal"
                  color="primary"
                  v-else
                  @click="admin.playMedia"
                >
                  <VIcon>mdi-play</VIcon>
                </VBtn>
                <VBtn
                  icon
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click="admin.skipMedia"
                  class="ml-2"
                >
                  <VIcon>mdi-skip-next</VIcon>
                </VBtn>
              </template>
            </template>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup lang="ts">
import MediaControl from '@/components/admin/MediaControl.vue';
import { useAdmin } from '@/store/admin/index';
import { computed } from 'vue';
import { Asset } from '../../../shared/asset';
import { useGameManager } from '@/store/gameManager';

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

function toggleWatched (media: Asset) {
  if (game.watchedMedia.includes(media.name)) {
    admin.removeWatchedMedia(media.name);
  } else {
    admin.addWatchedMedia(media.name);
  }
}
</script>