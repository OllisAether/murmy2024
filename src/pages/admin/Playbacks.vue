<template>
  <VContainer>
    <GameControl class="mb-6" />

    <VCard>
      <VToolbar>
        <VToolbarTitle>Playbacks</VToolbarTitle>
      </VToolbar>

      <VCardText>
        <PlaybackCard
          v-for="(playback, i) in admin.playbacks"
          :playback="playback"
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
import { useAdmin } from '../../store/admin';
import GameControl from '../../components/admin/GameControl.vue';
import PlaybackCard from '../../components/admin/playbacks/PlaybackCard.vue';

const admin = useAdmin()
</script>