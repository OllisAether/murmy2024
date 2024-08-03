<template>
  <ScreenWrapper :class="{
    media: true,
    'media--show-controls': showControls
  }">
    <video
      v-if="game.currentMedia"
      ref="video"
      class="media__video"
      autoplay
      @ended="finished"
      :src="game.getAsset(game.currentMedia)?.content"
    />
    <div class="media__controls">
      <VBtn
        icon
        @click="playPause"
      >
        <VIcon>{{ state === 'playing' ? 'mdi-pause' : 'mdi-play' }}</VIcon>
      </VBtn>
      <VBtn
        icon
        @click="finished"
      >
        <VIcon>mdi-skip-next</VIcon>
      </VBtn>
      <VSlider
        v-model="progressSlider"
        :max="video?.duration || 0"
        :step="0.1"
        hide-details
        thumb-size="0"
        class="media__progress"
      />
      <div class="media__time">
        {{ Math.floor(progress / 60) }}:{{ Math.floor(progress % 60).toString().padStart(2, '0') }} / {{ Math.floor((video?.duration || 0) / 60) }}:{{ Math.floor((video?.duration || 0) % 60).toString().padStart(2, '0') }}
      </div>
    </div>
  </ScreenWrapper>
</template>

<script lang="ts" setup>
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import { useGameManager } from '@/store/gameManager'
import { useWsClient } from '@/store/wsClient';
import { useEventListener } from '@vueuse/core';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const game = useGameManager()
const ws = useWsClient()

const video = ref<HTMLVideoElement | null>(null)
const state = ref<'playing' | 'paused'>('paused')

onMounted(() => {
  if (video.value) {
    video.value.addEventListener('play', () => state.value = 'playing')
    video.value.addEventListener('pause', () => state.value = 'paused')
    video.value.addEventListener('timeupdate', updateProgress)
    video.value.addEventListener('loadedmetadata', () => {
      game.mediaDuration(video.value!.duration)
    })

    const actions = [
      ws.onAction('mediaControl', (data: {
        progress?: number
        action: 'play' | 'pause' | 'seek'
      }) => {
        if (!video.value) return

        if (data.action === 'play') {
          video.value.play()
        } else if (data.action === 'pause') {
          video.value.pause()
        } else if (data.action === 'seek') {
          video.value.pause()
          video.value.currentTime = data.progress || 0
        }
      }),
      ws.onAction('getMedia', () => {
        if (video.value) {
          game.mediaState(video.value.paused ? 'paused' : 'playing')
          game.mediaDuration(video.value.duration)
          game.mediaProgress(video.value.currentTime)
        }
      })
    ]

    onBeforeUnmount(() => {
      actions.forEach((off) => off())
    })
  }
})

watch(state, (value) => {
  game.mediaState(value)
})

let timeout: number | null = null
useEventListener('pointerdown', triggerShowControls)
useEventListener('keydown', triggerShowControls)
useEventListener('mousemove', triggerShowControls)
useEventListener('mouseout', hideControls)

function triggerShowControls () {
  if (timeout) {
    clearTimeout(timeout)
  }

  showControls.value = true
  timeout = setTimeout(() => {
    showControls.value = false
  }, 3000) as unknown as number
}

function hideControls () {
  if (timeout) {
    clearTimeout(timeout)
  }

  showControls.value = false
}

const showControls = ref(false)
function playPause () {
  if (video.value) {
    if (video.value.paused) {
      video.value.play()
    } else {
      video.value.pause()
    }
  }
}

const progress = ref(0)
const progressSlider = computed({
  get: () => progress.value,
  set: (value) => {
    if (video.value) {
      video.value.currentTime = value
    }
  }
})

function updateProgress () {
  if (video.value) {
    progress.value = video.value.currentTime
    game.mediaProgress(video.value.currentTime)
  }
}

function finished () {
  game.mediaFinished()
}
</script>

<style lang="scss" scoped>
.media {
  cursor: none;

  &--show-controls {
    cursor: auto;

    .media__controls {
      opacity: 1;
    }
  }

  &__video {
    width: 100%;
    height: 100%;
  }

  &__controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 1rem 1rem;

    opacity: 0;
    transition: opacity 0.3s;

    background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), transparent);
  }
}
</style>