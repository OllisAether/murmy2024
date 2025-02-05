<template>
  <button :class="['database-entry', {
    'database-entry--has-image': !!entry.imageAssetId,
    'database-entry--has-description': !!entry.description,
    'database-entry--dragging': dragging,
    'database-entry--draggable': draggable
  }]" ref="root" @pointerdown="pointerdown">
    <img
      v-if="entry.imageAssetId"
      class="database-entry__image"
      :src="game.getAsset(entry.imageAssetId)?.content"
    />

    <div class="database-entry__content">
      <div class="database-entry__title">
        <TextContentRenderer :text-content="entry.title" />
      </div>
      <div v-if="entry.description" class="database-entry__description">
        <TextContentRenderer :text-content="entry.description" />
      </div>
  
      <VIcon class="database-entry__fullscreen-icon">mdi-fullscreen</VIcon>
    </div>

    <VDialog v-model="dialog" activator="parent" width="fit-content">
      <div class="database-entry__overlay">
        <img
          v-if="entry.imageAssetId"
          class="database-entry__overlay__image"
          :src="game.getAsset(entry.imageAssetId)?.content"
        />

        <div class="database-entry__overlay__content">
          <div class="database-entry__overlay__title">
            <TextContentRenderer :text-content="entry.title" />
          </div>
          <div class="database-entry__overlay__description">
            <TextContentRenderer v-if="entry.description" :text-content="entry.description" />
          </div>
        </div>

        <Btn
          class="database-entry__overlay__close"
          square
          color="#A23946"
          @click="dialog = false"
        >
          <VIcon>mdi-close</VIcon>
        </Btn>
      </div>
    </VDialog>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Entry } from '../../shared/suspectDatabase/entry'
import { useGameManager } from '@/store/gameManager';
import Btn from '../Btn.vue';
import { useEntryDrag } from '@/store/team/entryDrag';
import TextContentRenderer from '../TextContentRenderer.vue';

const game = useGameManager()

const props = defineProps<{
  scroller: HTMLElement
  entry: Entry
}>()

const entry = computed(() => game.allEntries.find(e => e.id === props.entry.id) ?? props.entry)

const dialog = ref(false)

const root = ref<HTMLDivElement | null>(null)

const entryDrag = useEntryDrag()
const dragging = computed(() => entryDrag.draggedEntry === props.entry.id)
const draggable = computed(() => entryDrag.dropZones.length > 0)

watch([draggable, root], () => {
  if (draggable.value) {
    root.value?.addEventListener('touchstart', touchstart, { passive: false })
  } else {
    root.value?.removeEventListener('touchstart', touchstart)
  }
}, { immediate: true, deep: true })

function touchstart (event: TouchEvent) {
  if (!draggable.value) return

  const start = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  }

  window.addEventListener('touchmove', touchmove, { passive: false })
  window.addEventListener('touchend', touchend)

  let thresholdSurpassed = false
  function touchmove (event: TouchEvent) {
    const distanceX = Math.abs(event.touches[0].clientX - start.x)
    const distanceY = Math.abs(event.touches[0].clientY - start.y)

    if (distanceY > 50 && !thresholdSurpassed) {
      touchend()
      return
    }

    if (!thresholdSurpassed && distanceX > 10) {
      thresholdSurpassed = true
      entryDrag.startDrag(props.entry.id)

      props.scroller.style.overflow = 'hidden'

    } else if (!thresholdSurpassed) {
      return
    }

    event.preventDefault()

    entryDrag.moveDrag({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    })
  }

  function touchend () {
    if (thresholdSurpassed) {
      entryDrag.endDrag()
    }
    window.removeEventListener('touchmove', touchmove)
    window.removeEventListener('touchend', touchend)

    props.scroller.style.overflow = ''
  }
}

function pointerdown (event: PointerEvent) {
  if (!draggable.value) return
  if (event.pointerType === 'touch') return

  window.addEventListener('pointermove', pointermove)
  window.addEventListener('pointerup', pointerup)

  entryDrag.startDrag(props.entry.id)
  entryDrag.moveDrag({
    x: event.clientX,
    y: event.clientY,
  })

  function pointermove (event: PointerEvent) {
    event.preventDefault()

    entryDrag.moveDrag({
      x: event.clientX,
      y: event.clientY,
    })
  }

  function pointerup () {
    entryDrag.endDrag()

    window.removeEventListener('pointermove', pointermove)
    window.removeEventListener('pointerup', pointerup)
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.database-entry {
  width: calc(100% - 2rem);

  text-align: left;

  position: relative;
  background: #393c3fa1;
  border: 1px solid #fff1;
  border-radius: 1rem;
  margin: 0 1rem .5rem;

  -webkit-backdrop-filter: blur(.5rem);
  backdrop-filter: blur(.5rem);

  display: flex;
  align-items: stretch;
  padding: .5rem;

  transition: opacity .2s;

  &--dragging {
    opacity: .3;
    cursor: grab;
  }

  &--draggable {
    animation: pulse 1.5s infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);

    @keyframes pulse {
      0%, 100% {}
      50% {
        border-color: #79ccff88;
      }
    }
  }

  &__content {
    z-index: 1;
    margin: 0 .5rem;
    flex: 1 1 auto;
    width: 0;

    display: flex;
    flex-direction: column;
  }

  &__title {
    padding: .5rem 0;
    padding-right: 2rem;
    font-family: $fontHeading;
    font-size: 1.2rem;

    .database-entry--has-description &, .database-entry--has-image & {
      padding: 0 0 .2rem;
      padding-right: 1.5rem;
    }
  }

  &__description {
    flex: 1 1 auto;

    min-height: 1.5rem;
    height: 0;

    color: #fff8;
    line-height: 1rem;

    font-size: .8rem;
    mask-image: linear-gradient(to top, transparent, black 1rem);
    hyphens: auto;
    overflow: hidden;
  }

  &__image {
    display: block;
    pointer-events: none;
    height: auto;
    object-fit: cover;
    width: 5rem;
    border-radius: .5rem;
    margin-right: .5rem;
  }

  &__fullscreen-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    right: 1rem;
    display: block;
    color: #fff8;
    font-size: 1.5rem;

    .database-entry--has-description &, .database-entry--has-image & {
      top: .5rem;
      right: .5rem;
      transform: none;
    }
  }

  &__overlay {
    position: relative;
    width: 70vw;

    display: flex;
    flex-direction: row;
    // align-items: center;
    padding: 1rem 1rem 1rem 1rem;
    gap: 1rem;

    background: #1f212299;
    border: 3px solid #fff2;
    border-radius: 2rem;

    -webkit-backdrop-filter: blur(3rem);
    backdrop-filter: blur(3rem);

    &__close {
      z-index: 1;
      position: absolute;
      bottom: calc(100% - 1.5rem);
      right: -2.5rem;
    }

    &__box {
      position: absolute;
      inset: 0;
    }

    &__content {
      z-index: 1;
      flex: 1 1 auto;
      width: 0;
      font-size: 1.2rem;
      padding: 1rem 1rem;
      
      display: flex;
      flex-direction: column;
    }

    &__title {
      font-family: $fontHeading;
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    &__description {
      color: #fff8;
      hyphens: auto;
    }

    &__image {
      display: block;
      pointer-events: none;
      height: auto;
      object-fit: cover;
      width: 20vw;
      border-radius: 1rem;
    }
  }
}
</style>