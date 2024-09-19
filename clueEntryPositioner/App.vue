<template>
  <input type="file" ref="fileInput" accept=".webp, .png, .jpg, .jpeg" />

  <button @click.prevent="entries.push({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    rotation: 0
  })">
    New
  </button>

  <div class="img-container">
    <img ref="imgEl">

    <Entry
      v-for="(entry, i) in entries"
      :key="i"
      :entry="entry"
      @remove="entries.splice(i, 1)"
    />
  </div>

<pre>{{ entries.map(e => `x: ${e.x / (imgEl?.width || 0)},
y: ${e.y / (imgEl?.height || 0)},
width: ${e.width / (imgEl?.width || 0)},
height: ${e.height / (imgEl?.height || 0)},
transform: 'rotate(${e.rotation}deg)'`).join('\n\n') }}</pre>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Entry from './Entry.vue';

const entries = ref<{
  x: number
  y: number
  width: number
  height: number
  rotation: number
}[]>([])

const fileInput = ref<HTMLInputElement | null>(null)
const imgEl = ref<HTMLImageElement | null>(null)

function handleFileChange () {
  if (!fileInput.value || !fileInput.value.files || !fileInput.value.files[0]) return

  const reader = new FileReader()
  reader.onload = (e) => {
    if (!imgEl.value) return
    imgEl.value.src = e.target?.result as string

    imgEl.value.onload = calcSize
  }
  reader.readAsDataURL(fileInput.value.files[0])
}

onMounted(() => {
  if (!fileInput.value) return
  fileInput.value.addEventListener('change', handleFileChange)

  window.addEventListener('resize', calcSize)

  calcSize()
})

function calcSize () {
  if (!imgEl.value) return

  const imgWidth = imgEl.value?.naturalWidth || 0
  const imgHeight = imgEl.value?.naturalHeight || 0

  const windowWidth = window.innerWidth - 50
  const windowHeight = window.innerHeight - 50

  const imgRatio = imgWidth / imgHeight
  const windowRatio = windowWidth / windowHeight

  if (imgRatio > windowRatio) {
    imgEl.value.style.width = windowWidth + 'px'
    imgEl.value.style.height = windowWidth / imgRatio + 'px'
  } else {
    imgEl.value.style.width = windowHeight * imgRatio + 'px'
    imgEl.value.style.height = windowHeight + 'px'
  }
}
</script>

<style scoped lang="scss">
.img-container {
  position: relative;
  width: fit-content;
  height: fit-content;
  margin: auto;
  outline: 5px solid #000;

  img {
    display: block;
  }
}
</style>