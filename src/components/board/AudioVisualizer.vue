<template>
  <div class="audio-visualizer">

    <div class="audio-visualizer__elite-text">
      ELITE
    </div>
    <div class="audio-visualizer__time">
      {{ Math.floor(time / 60) }}:{{ Math.floor(time % 60).toString().padStart(2, '0') }} / {{ Math.floor(totalTime / 60) }}:{{ Math.floor(totalTime % 60).toString().padStart(2, '0') }}
    </div>

    <div class="audio-visualizer__progress-bar">
      <div class="audio-visualizer__progress-bar__text">
        Playing audio...
      </div>

      <div
        class="audio-visualizer__progress-bar__progress"
        :style="{
          width: `${time / totalTime * 100}%`
        }"
      ></div>
    </div>

    <canvas ref="canvas" class="audio-visualizer__canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import Color from 'color';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  video: HTMLVideoElement | null
}>()

const time = ref(0)
const totalTime = ref(0)

const video = computed(() => props.video)

watch(video, () => {
  if (!video.value) return

  video.value.addEventListener('timeupdate', () => {
    time.value = video.value?.currentTime || 0
  })

  video.value.addEventListener('loadedmetadata', () => {
    totalTime.value = video.value?.duration || 0
  })
})

const canvas = ref<HTMLCanvasElement | null>(null)

watch(canvas, () => {
  if (!canvas.value) return
  draw(canvas.value)
}, { immediate: true })

function draw(canvas: HTMLCanvasElement) {
  if (!video.value) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const ctx = canvas.getContext('2d')

  if (!ctx) return

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  let audioSource: MediaElementAudioSourceNode | null = null
  let analyser: AnalyserNode | null = null

  audioSource = audioCtx.createMediaElementSource(video.value as HTMLMediaElement)
  analyser = audioCtx.createAnalyser()
  audioSource.connect(analyser)
  analyser.connect(audioCtx.destination)

  analyser.fftSize = 2 ** 10
  analyser.smoothingTimeConstant = .9
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const offset = 32
  const displayLength = 100 + offset
  const exponent = Math.log(dataArray.length - offset) / displayLength
  let smoothDataArray = new Array(displayLength - offset).fill(0)

  function smooth (data: number[], factor: number, iterations = 1) {
    const newData = new Array(data.length).fill(0)

    for (let i = 0; i < data.length; i++) {
      const prev = data[i - 1] || data[i]
      const next = data[i + 1] || data[i]
      newData[i] = (prev + data[i] + next) / 3
    }

    for (let i = 0; i < data.length; i++) {
      data[i] = data[i] * (1 - factor) + newData[i] * factor
    }

    if (iterations > 1) {
      return smooth(data, factor, iterations - 1)
    }

    return data
  }

  function animate () {
    if (!ctx) return
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    analyser?.getByteFrequencyData(dataArray)

    for (let i = 0; i < smoothDataArray.length; i++) {
      const index = Math.exp(exponent * (i + offset))

      const lower = Math.floor(index)
      const upper = Math.ceil(index)

      const lowerWeight = 1 - (index - lower)
      const upperWeight = 1 - lowerWeight

      smoothDataArray[i] = dataArray[lower] * lowerWeight + dataArray[upper] * upperWeight
    }

    smoothDataArray = smooth(smoothDataArray, 1, 5)

    ctx.save()
    ctx.beginPath()
    ctx.lineCap = 'round'

    const barWidth = canvas.width / (smoothDataArray.length * 2 - 2)
    const lineOffset = 3

    let x = 0
    let lastPosX: number | null = null
    let lastPosY: number | null = null
    let lastPosY2: number | null = null

    for (let i = -smoothDataArray.length + 1; i < smoothDataArray.length; i++) {
      const value = smoothDataArray[Math.abs(i)] / 255
      const barHeight = value * canvas.height * 0.5

      if (lastPosX !== null && lastPosY !== null && lastPosY2 !== null) {
        const color = Color().hsl(Math.abs(i) / smoothDataArray.length * -100 + 300, 100, Math.abs(i) / smoothDataArray.length * 10 + 60)
  
        ctx.strokeStyle = color.hex()
        ctx.lineWidth = 2
  
        ctx.globalAlpha = 0.3
        // ctx.fillStyle = color.hex()

        ctx.beginPath()
        ctx.moveTo(x, canvas.height / 2 - barHeight / 2 - ctx.lineWidth)
        ctx.lineTo(x, canvas.height / 2 + barHeight / 2 + ctx.lineWidth)
        ctx.stroke()

        // ctx.beginPath()
        // ctx.moveTo(lastPosX - .1, lastPosY)
        // ctx.lineTo(x, canvas.height / 2 - barHeight / 2)
        // ctx.lineTo(x, canvas.height / 2 + barHeight / 2)
        // ctx.lineTo(lastPosX - .1, lastPosY2)
        // ctx.fill()

        ctx.globalAlpha = 1
        ctx.strokeStyle = color.lighten(.2).hex()
        ctx.lineWidth = value * 2 + 1

        ctx.beginPath()
        ctx.moveTo(lastPosX, lastPosY - lineOffset)
        ctx.lineTo(x, canvas.height / 2 - barHeight / 2 - lineOffset)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(lastPosX, lastPosY2 + lineOffset)
        ctx.lineTo(x, canvas.height / 2 + barHeight / 2 + lineOffset)
        ctx.stroke()
      }

      lastPosX = x
      lastPosY = canvas.height / 2 - barHeight / 2
      lastPosY2 = canvas.height / 2 + barHeight / 2

      x += barWidth
    }

    ctx.restore()
    ctx.lineCap = 'round'

    requestAnimationFrame(animate)
  }

  animate()
}
</script>

<style scoped lang="scss">
@use '@/scss/vars' as *;

.audio-visualizer {
  position: relative;
  background: $surface;

  &__time {
    position: absolute;
    top: 3vh;
    right: 5vh;
    line-height: 1;
    font-size: 5vh;
    color: #fff8;
    font-family: $fontDisplay;
    font-weight: 300;

    &::after {
      content: '';
      background: #f44;
      width: .3em;
      height: .3em;
      border-radius: 50%;
      display: inline-block;
      margin-left: .4em;
      vertical-align: middle;
    }
  }

  &__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    &--blur {
      filter: blur(20px);
    }
  }

  &__elite-text {
    position: absolute;
    top: 2vh;
    left: 4vh;
    line-height: 1;
    font-size: 30vh;

    font-family: $fontDisplay;
    font-weight: 300;
    opacity: 0.05;
    mask-image: linear-gradient(black, transparent)
  }

  &__progress-bar {
    position: absolute;
    bottom: 10vh;
    left: 20vw;
    right: 20vw;
    height: .5vh;
    border-radius: 1vh;

    background: #fff2;

    &__progress {
      border-radius: 1vh;
      transition: width 0.3s linear;
      height: 100%;
      background: white;
    }

    &__text {
      position: absolute;
      bottom: calc(100% + 1vh);
      left: 0;
      text-align: center;
      font-size: 1.5vh;
      font-family: $fontDisplay;
      font-weight: 700;
    }
  }

  &__canvasBlur {
    filter: blur(10px);
  }
}
</style>