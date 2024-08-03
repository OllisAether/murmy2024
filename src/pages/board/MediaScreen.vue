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
    {{ isAudio }}
    <canvas v-if="isAudio" ref="canvas" class="media__canvas" />
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
const canvas = ref<HTMLCanvasElement | null>(null)

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

const isAudio = computed(() => {
  if (!game.currentMedia) return false

  const asset = game.getAsset(game.currentMedia)
  if (!asset) return false

  return asset.metadata?.mime?.startsWith?.('audio') ||
    asset.url?.endsWith?.('.mp3') ||
    asset.url?.endsWith?.('.wav')
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

watch(canvas, () => {
  if (!canvas.value) return
  if (!video.value) return

  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight

  const ctx = canvas.value.getContext('2d')

  if (!ctx) return

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  let audioSource: MediaElementAudioSourceNode | null = null
  let analyser: AnalyserNode | null = null

  audioSource = audioCtx.createMediaElementSource(video.value as HTMLMediaElement)
  analyser = audioCtx.createAnalyser()
  audioSource.connect(analyser)
  analyser.connect(audioCtx.destination)

  analyser.fftSize = 2 ** 10
  analyser.smoothingTimeConstant = 0.8
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const displayLength = 128
  // const offset = 0
  // const exponent = Math.log(dataArray.length - offset) / displayLength
  let smoothDataArray = new Array(displayLength).fill(0)

  // function smooth (data: number[], factor: number, iterations = 1) {
  //   const newData = new Array(data.length).fill(0)

  //   for (let i = 0; i < data.length; i++) {
  //     const prev = data[i - 1] || 0
  //     const next = data[i + 1] || 0
  //     newData[i] = (prev + data[i] + next) / 3
  //   }

  //   for (let i = 0; i < data.length; i++) {
  //     data[i] = data[i] * (1 - factor) + newData[i] * factor
  //   }

  //   if (iterations > 1) {
  //     return smooth(data, factor, iterations - 1)
  //   }

  //   return data
  // }

  let x = 0
  function animate () {
    if (!ctx) return
    if (!canvas.value) return
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight

    x = 0
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    analyser?.getByteFrequencyData(dataArray)

    const barWidth = canvas.value.width / smoothDataArray.length
    for (let i = 0; i < smoothDataArray.length; i++) {
      // smoothDataArray[i] = dataArray[Math.floor(Math.exp(exponent * (i + offset)))]
      smoothDataArray[i] = dataArray[Math.floor(i * dataArray.length / smoothDataArray.length)]
    }

    // smoothDataArray = smooth(smoothDataArray, 0.8, 2)

    for (let i = 0; i < smoothDataArray.length; i++) {
      const barHeight = smoothDataArray[i] / 255 * canvas.value.height * 0.8 + barWidth / 2
      ctx.beginPath()
      ctx.fillStyle = 'white'
      ctx.roundRect(x, (canvas.value.height - barHeight) / 2, barWidth / 2, barHeight, barWidth / 2)
      ctx.closePath()
      ctx.fill()
      x += barWidth
    }

    requestAnimationFrame(animate)
  }

  animate()
})
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

  &__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
}
</style>