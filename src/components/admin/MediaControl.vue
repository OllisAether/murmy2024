<template>
  <VCard>
    <VCardText>
      Media Control: {{ game.phase.type === 'media' ? game.currentMedia ?? '-/-' : '-/-' }}

      <div class="controls">
        <VBtn
          icon
          :disabled="game.phase.type !== 'media'"
          @click="playPause"
          variant="text"
        >
          <VIcon>{{ admin.media.state === 'playing' ? 'mdi-pause' : 'mdi-play' }}</VIcon>
        </VBtn>

        <VSlider
          class="no-transition"
          :disabled="game.phase.type !== 'media'"
          v-model="progress"
          :max="duration"
          :min="0"
          :step="0.1"
          hide-details
          @start="seekStart"
          @end="seekEnd"
        />
        <Duration :duration="progress * 1000" /> / <Duration :duration="duration" />
      </div>
    </VCardText>
  </VCard>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin';
import { useGameManager } from '@/store/gameManager';
import { computed } from 'vue';
import Duration from '@/components/Duration.vue';

const admin = useAdmin()
const game = useGameManager()

let startState = 'paused'
function seekStart () {
  startState = admin.media.state
}

function seekEnd () {
  if (startState === 'playing') {
    admin.playMedia()
  } else {
    admin.pauseMedia()
  }
}

const duration = computed(() => {
  if (game.phase.type === 'media') {
    return admin.media.duration
  } else {
    return 0
  }
})

const progress = computed({
  get: () => {
    if (game.phase.type === 'media') {
      return admin.media.progress
    } else {
      return 0
    }
  },
  set: (value: number) => {
    admin.media.progress = value
    admin.seekMedia(value)
  }
})

function playPause () {
  if (admin.media.state === 'playing') {
    admin.pauseMedia()
  } else {
    admin.playMedia()
  }
}
</script>

<style lang="scss" scoped>
.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>