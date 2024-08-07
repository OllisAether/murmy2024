<template>
  <div
    v-if="!collected || !disappear"
    :class="['collectable', {
      'collectable--inline': inline
    }]"
    ref="root"
    @click="collected = !collected"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useCollectables } from '@/store/collectables'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { idGen } from '../../../shared/random'
import { Entry } from '../../../shared/suspectDatabase/entry'
import { useGameManager } from '@/store/gameManager'

const collectable = useCollectables()
const game = useGameManager()

const root = ref<HTMLDivElement | null>(null)

const props = defineProps<{
  entry: Entry
  inline?: boolean
  disappear?: boolean
}>()

const id = idGen()

const collected = computed(() => game.database.entries.some((e) => e.matterId === props.entry.matterId))
const rect = ref<{
  x: number
  y: number
  width: number
  height: number
  transform: string
} | null>(null)

watch(collected, () => {
  if (!collected.value) return
  if (!root.value) return

  const boundingRect = root.value.getBoundingClientRect()

  rect.value = {
    x: boundingRect.left,
    y: boundingRect.top,
    width: root.value.offsetWidth,
    height: root.value.offsetHeight,
    transform: `scale(${boundingRect.width / root.value.offsetWidth}, ${boundingRect.height / root.value.offsetHeight})`
  }
})

onMounted(() => {
  if (!root.value) return

  collectable.setCollectable(id, {
    entry: props.entry,
    element: root.value
  })
})

onBeforeUnmount(() => {
  collectable.removeCollectable(id)
})
</script>

<style lang="scss" scoped>
.collectable {
  border-radius: 0.5rem;
  overflow: hidden;
  transition:
    1s cubic-bezier(0.645, 0.045, 0.355, 1),
    transform 1s cubic-bezier(0.4, 0.1, 0.4, 1),
    opacity 0.5s 0.5s;

  &--hide-content {
    opacity: 0;
  }

  &--inline {
    display: inline;
  }

  &--collected {
    position: fixed;
    top: var(--top);
    left: var(--left);
    width: var(--width);
    height: var(--height);

    transform-origin: top left;
    transform: var(--transform);
    // pointer-events: none;

    opacity: 1;
    box-shadow: 0 0 1rem #000;
  }

  &-leave-to {
    transform: translateY(30rem)scale(2)translateY(-50%);
    top: calc(50% - 30rem);
    left: 12.5rem;
    opacity: 0;
  }
}
</style>