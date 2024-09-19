<template>
  <div
    :style="{
      left: entry.x + 'px',
      top: entry.y + 'px',
      width: entry.width + 'px',
      height: entry.height + 'px',
      transform: `rotate(${entry.rotation}deg)`
    }"
    class="entry"
    ref="root"
  >
    <div class="entry__move-handle" @pointerdown="handleMoveHandle" />
    <div class="entry__handle entry__handle--n" @pointerdown="handleHandle($event, 'n')" />
    <div class="entry__handle entry__handle--e" @pointerdown="handleHandle($event, 'e')" />
    <div class="entry__handle entry__handle--s" @pointerdown="handleHandle($event, 's')" />
    <div class="entry__handle entry__handle--w" @pointerdown="handleHandle($event, 'w')" />
    <div class="entry__handle entry__handle--ne" @pointerdown="handleHandle($event, 'ne')" />
    <div class="entry__handle entry__handle--se" @pointerdown="handleHandle($event, 'se')" />
    <div class="entry__handle entry__handle--sw" @pointerdown="handleHandle($event, 'sw')" />
    <div class="entry__handle entry__handle--nw" @pointerdown="handleHandle($event, 'nw')" />
    <div class="entry__rotate-handle" @pointerdown="handleRotateHandle" />

    <button class="entry__remove-btn" @click="$emit('remove')">
      ✖
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  entry: {
    x: number
    y: number
    width: number
    height: number
    rotation: number
  }
}>()

const root = ref<HTMLDivElement | null>(null)

function handleHandle (e: PointerEvent, direction: 'n' | 'e' | 's' | 'w' | 'ne' | 'se' | 'sw' | 'nw') {
  e.preventDefault()
  e.stopPropagation()
  
  const startX = e.clientX
  const startY = e.clientY

  const startEntryX = props.entry.x
  const startEntryY = props.entry.y
  const startEntryWidth = props.entry.width
  const startEntryHeight = props.entry.height

  function handleMove (e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()

    const diffX = e.clientX - startX
    const diffY = e.clientY - startY

    // Rotate the diff by the entry rotation
    const angle = props.entry.rotation * (Math.PI / 180)
    const diffXRotated = diffX * Math.cos(angle) - diffY * Math.sin(angle)
    const diffYRotated = diffX * Math.sin(angle) + diffY * Math.cos(angle)

    switch (direction) {
      case 'n':
        props.entry.y = startEntryY + diffYRotated
        props.entry.height = startEntryHeight - diffYRotated
        break
      case 'e':
        props.entry.width = startEntryWidth + diffXRotated
        break
      case 's':
        props.entry.height = startEntryHeight + diffYRotated
        break
      case 'w':
        props.entry.x = startEntryX + diffXRotated
        props.entry.width = startEntryWidth - diffXRotated
        break
      case 'ne':
        props.entry.y = startEntryY + diffYRotated
        props.entry.height = startEntryHeight - diffYRotated
        props.entry.width = startEntryWidth + diffXRotated
        break
      case 'se':
        props.entry.height = startEntryHeight + diffYRotated
        props.entry.width = startEntryWidth + diffXRotated
        break
      case 'sw':
        props.entry.x = startEntryX + diffXRotated
        props.entry.width = startEntryWidth - diffXRotated
        props.entry.height = startEntryHeight + diffYRotated
        break
      case 'nw':
        props.entry.x = startEntryX + diffXRotated
        props.entry.y = startEntryY + diffYRotated
        props.entry.width = startEntryWidth - diffXRotated
        props.entry.height = startEntryHeight - diffYRotated
        break
    }
  }

  function handleUp () {
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}

function handleMoveHandle (e: PointerEvent) {
  e.preventDefault()
  e.stopPropagation()

  const startX = e.clientX
  const startY = e.clientY

  const startEntryX = props.entry.x
  const startEntryY = props.entry.y

  function handleMove (e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()

    const diffX = e.clientX - startX
    const diffY = e.clientY - startY

    props.entry.x = startEntryX + diffX
    props.entry.y = startEntryY + diffY
  }

  function handleUp () {
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}

function handleRotateHandle (e: PointerEvent) {
  e.preventDefault()
  e.stopPropagation()

  const boundingRect = root.value?.getBoundingClientRect()

  if (!boundingRect) return

  const centerX = boundingRect?.left + boundingRect?.width / 2
  const centerY = boundingRect?.top + boundingRect?.height / 2

  const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)

  const startEntryRotation = props.entry.rotation

  function handleMove (e: PointerEvent) {
    e.preventDefault()
    e.stopPropagation()

    const diffX = e.clientX - centerX
    const diffY = e.clientY - centerY

    const angle = Math.atan2(diffY, diffX) * (180 / Math.PI) - startAngle

    props.entry.rotation = startEntryRotation + angle
  }

  function handleUp () {
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}
</script>

<style scoped lang="scss">
.entry {
  position: absolute;
  border: 1px solid black;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  color: white;

  &__handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: black;
    border-radius: 50%;
    border: 1px solid white;
    cursor: pointer;

    &--n {
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
    }

    &--e {
      top: 50%;
      right: -5px;
      transform: translateY(-50%);
    }

    &--s {
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
    }

    &--w {
      top: 50%;
      left: -5px;
      transform: translateY(-50%);
    }

    &--ne {
      top: -5px;
      right: -5px;
    }

    &--se {
      bottom: -5px;
      right: -5px;
    }

    &--sw {
      bottom: -5px;
      left: -5px;
    }

    &--nw {
      top: -5px;
      left: -5px;
    }

    &:hover {
      background-color: #df4c4c;
    }
  }

  &__move-handle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: move;
  }

  &__rotate-handle {
    position: absolute;
    bottom: -30px;
    right: -30px;
    width: 20px;
    height: 20px;
    background-color: black;
    cursor: pointer;

    &:hover {
      background-color: red;
    }
  }

  &__remove-btn {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 20px;
    height: 20px;
    background-color: black;
    border-radius: 50%;
    border: 1px solid white;
    padding: 0;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: red;
    }
  }
}
</style>