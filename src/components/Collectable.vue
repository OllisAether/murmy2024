<template>
  <div
    :class="['collectable', {
      'collectable--inline': inline,
      'collectable--highlight': highlight && !collected,
      'collectable--collected': collected
    }]"
    ref="root"
  >
    <!-- @click="collected = !collected" -->
    <!-- {{ collected }} -->
    <VIcon v-if="highlight && !collected" class="collectable--highlight__icon">mdi-gesture-tap</VIcon>
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
import { idGen } from '../../shared/random'
import { useGameManager } from '@/store/gameManager'
import { getPathToElement } from '@/utils/getPathToElement';

const collectable = useCollectables()
const game = useGameManager()

const root = ref<HTMLDivElement | null>(null)

const props = defineProps<{
  entryId: string
  inline?: boolean,
  highlight?: boolean,
}>()

const id = idGen()

// const collected = ref(false)
const collected = computed(() => game.database.entries.some((e) => e === props.entryId))
const rect = ref<{
  x: number
  y: number
  width: number
  height: number
  rotation: number
} | null>(null)

watch(collected, () => {
  if (!root.value) return

  const boundingRect = root.value.getBoundingClientRect()

  const path = getPathToElement(root.value).reverse()
  const matrix: DOMMatrix = new DOMMatrix()

  path.forEach((p) => {
    const m = new DOMMatrix(getComputedStyle(p).transform)
    matrix.preMultiplySelf(m)
  })

  const rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)

  rect.value = {
    x: boundingRect.left,
    y: boundingRect.top,
    width: boundingRect.width,
    height: boundingRect.height,
    rotation
  }

  if (collected.value) {
    startOrbAnimation()
  }
})

onMounted(() => {
  if (!root.value) return

  collectable.setCollectable(id, {
    entryId: props.entryId,
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
      transform: `rotate(${rect.value.rotation}deg)`,
      easing: 'cubic-bezier(0.4, 0, 0.8, 0.1)'
    },
    {
      top: '22rem',
      left: '12.5rem'
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
@use '@/scss/vars' as *;

.collectable {
  outline: red solid 2px;

  :deep(*) {
    pointer-events: none;
  }

  &--inline {
    display: inline;
    padding: .5em;
    margin: -.5em;
  }

  &--highlight {
    &__icon {
      z-index: 2;
      position: absolute;
      left: calc(100% - 2rem);
      top: calc(100% - 1rem);
      transform: rotate(-10deg);
      font-size: 5rem;
      animation: bounce 1.8s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
      text-shadow: 
        0 0 1rem #fff8,
        -.5rem 0 2rem rgba($neon1, 0.6),
        .5rem 0 2rem rgba($neon2, 0.6),
        0 0 4rem black;

      @keyframes bounce {
        0%, 100% {
          transform: rotate(-10deg)translateY(0);
        }
        30%, 70% {
          transform: rotate(-10deg)translateY(-1rem);
        }
      }
    }

    &::after {
      content: '';
      position: absolute;
      inset: -1rem;
      pointer-events: none;
      z-index: 1;
      border-radius: 1rem;
      border: 2px solid #fff;
      box-shadow: 
        inset 0 0 .5rem #fff,
        
        // inset .2rem 0 .25rem $neon1,
        // inset -.2rem 0 .25rem $neon2,
        
        inset 1rem 0 2rem -.5rem rgba($neon1, 0.3),
        inset -1rem 0 2rem -.5rem rgba($neon2, 0.3),
        
        0 0 1.5rem #fff,
        -.5rem 0 3rem rgba($neon1, 0.4),
        .5rem 0 3rem rgba($neon2, 0.4);
      animation: pulse 1.3s infinite;

      @keyframes pulse {
        0% {
          transform: scale(1.2);
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    }
  }

  &__orb {
    pointer-events: none;
    position: fixed;
    transform-origin: top left;

    div {
      border-radius: 1.5rem;
      transform: translate(-50%, -50%);

      box-shadow:
        inset 0 0 1rem #fff,
        
        inset .2rem 0 .5rem $neon3,
        inset -.2rem 0 .5rem $neon4,
        
        inset 1rem 0 2rem -.5rem $neon3,
        inset -1rem 0 2rem -.5rem $neon4,
        
        0 0 1.5rem #fff,
        -.5rem 0 1rem $neon3,
        .5rem 0 1rem $neon4,
        0 0 3rem 1rem #000;
    }
  }
}
</style>