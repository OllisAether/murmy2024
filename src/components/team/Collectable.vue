<template>
  <div
    :class="['collectable', {
      'collectable--inline': inline
    }]"
    ref="root"
  >
    <!-- @click="collected = !collected" -->
    <!-- {{ collected }} -->
    <slot />
    <Teleport
      v-if="showOrb"
      to="body"
    >
      <div
        ref="orb"
        class="collectable__orb"
      >
        <div />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCollectables } from '@/store/collectables'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

// const collected = ref(false)
const collected = computed(() => game.database.entries.some((e) => e.matterId === props.entry.matterId))
const rect = ref<{
  x: number
  y: number
  width: number
  height: number
} | null>(null)

watch(collected, () => {
  if (!root.value) return

  const boundingRect = root.value.getBoundingClientRect()

  rect.value = {
    x: boundingRect.left,
    y: boundingRect.top,
    width: boundingRect.width,
    height: boundingRect.height
  }

  if (collected.value) {
    startOrbAnimation()
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

const orb = ref<HTMLDivElement | null>(null)
const showOrb = ref(false)
async function startOrbAnimation () {
  showOrb.value = true

  await nextTick()

  if (!orb.value || !rect.value) return

  const animation1 = orb.value.animate([
    {
      top: rect.value.y + rect.value.height / 2 + 'px',
      left: rect.value.x + rect.value.width / 2 + 'px',
      easing: 'cubic-bezier(0.4, 0, 0.8, 0.1)'
    },
    {
      top: '50%',
      left: !!document.querySelector('.sus-db') ? '12.5rem' : '0',
    }
  ], {
    duration: 700,
  })
  
  const animation2 = orb.value.children[0].animate([
    {
      width: rect.value.width + 'px',
      height: rect.value.height + 'px',
      opacity: 0,
      easing: 'cubic-bezier(0.5, 0, 0, 1)'
    },
    {
      opacity: 1,
      offset: .8,
    },
    {
      width: '48px',
      height: '48px',
      opacity: 0,
      offset: 1
    }
  ], {
    duration: 700,
  })
  
  await Promise.all([
    animation1.finished,
    animation2.finished
  ])

  showOrb.value = false
}
</script>

<style lang="scss" scoped>
.collectable {
  // outline: 1px solid blue;

  animation: cubic-bezier(0.215, 0.610, 0.355, 1);
  animation: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  animation: cubic-bezier(0.19, 1, 0.22, 1);
  &--inline {
    display: inline;
  }

  &__orb {
    pointer-events: none;
    position: fixed;

    div {
      border-radius: 1.5rem;
      transform: translate(-50%, -50%);

      $neon1: #00ff7b;
      $neon2: #00b7ff;
      
      box-shadow:
      inset 0 0 1rem #fff,
      
      inset .2rem 0 .5rem $neon1,
      inset -.2rem 0 .5rem $neon2,
      
      inset 1rem 0 2rem -.5rem $neon1,
      inset -1rem 0 2rem -.5rem $neon2,
      
      0 0 1.5rem #fff,
      -.5rem 0 1rem $neon1,
      .5rem 0 1rem $neon2,
      0 0 3rem 1rem #000;
    }
  }
}
</style>