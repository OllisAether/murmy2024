<template>
  <div
    class="skew-box"
    ref="root"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="[
        -8,
        -8,
        width + displaceDistance * 2 + 8,
        height + displaceDistance * 2 + 8
      ].join(' ')"
      :width="`${width + displaceDistance * 2}px`"
      :height="`${height + displaceDistance * 2}px`"
      :style="{
        color: props.color,
        transform: `skew(-${props.skew}deg)`
      }"
    >
      <path
        :d="`
          M${width - roundedCorners} 0
          A${roundedCorners} ${roundedCorners} 0 0 1 ${width} ${roundedCorners}

          L${width} ${height - cornerCut - roundedCorners * sqrtEighth}
          
          A${roundedCorners} ${roundedCorners} 0 0 1 ${width - roundedCorners * sqrtEighth} ${height - cornerCut + roundedCorners * sqrtEighth}
          L${width - cornerCut + roundedCorners * sqrtEighth} ${height - roundedCorners * sqrtEighth}
          A${roundedCorners} ${roundedCorners} 0 0 1 ${width - cornerCut - roundedCorners * sqrtEighth} ${height}
          L${roundedCorners} ${height}
          A${roundedCorners} ${roundedCorners} 0 0 1 0 ${height - roundedCorners}
          L0 ${cornerCut + roundedCorners * sqrtEighth}
          A${roundedCorners} ${roundedCorners} 0 0 1 ${roundedCorners * sqrtEighth} ${cornerCut - roundedCorners * sqrtEighth}
          L${cornerCut - roundedCorners * sqrtEighth} ${roundedCorners * sqrtEighth}
          A${roundedCorners} ${roundedCorners} 0 0 1 ${cornerCut + roundedCorners * sqrtEighth} 0
          Z
        `"
        :fill="`url(#skew-box-fill-${color})`"
        :stroke="`url(#skew-box-stroke-${color})`"
        stroke-width="2"
      />
      <path
        :d="`
          M${displaceDistance + roundedCorners} ${height + displaceDistance}
          L${width - cornerCut + displaceDistance / 2 - bigCorner * sqrtEighth} ${height + displaceDistance}
          A${bigCorner} ${bigCorner} 0 0 0 ${width - cornerCut + displaceDistance / 2 + bigCorner * sqrtEighth} ${height + displaceDistance - bigCorner * sqrtEighth}
          L${width + displaceDistance - bigCorner * sqrtEighth} ${height - cornerCut + displaceDistance / 2 + bigCorner * sqrtEighth}
          A${bigCorner} ${bigCorner} 0 0 0 ${width + displaceDistance} ${height - cornerCut + displaceDistance / 2 - bigCorner * sqrtEighth}
          L${width + displaceDistance} ${displaceDistance + roundedCorners}
        `"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        fill="none"
      />

      <defs>
        <linearGradient :id="`skew-box-fill-${color}`" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="70%"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="30%" />
        </linearGradient>
        <linearGradient :id="`skew-box-stroke-${color}`" x1="0" x2="0" y1="-3" y2="1">
          <stop offset="0%" stop-color="white" />
          <stop offset="100%" stop-color="currentColor" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const root = ref<HTMLElement | null>(null)
const sqrtEighth = Math.sqrt(0.125)

const props = withDefaults(defineProps<{
  cornerCut: number
  displaceDistance: number
  roundedCorners: number
  color: string
  skew: number
}>(), {
  cornerCut: 16,
  roundedCorners: 4,
  displaceDistance: 6,
  color: '#1E2023',
  skew: 10
})

const bigCorner = computed(() => props.displaceDistance + props.roundedCorners)

const width = ref(100)
const height = ref(100)

onMounted(() => {
  const observer = new ResizeObserver(() => {
    if (!root.value) return

    const w = root.value.clientWidth
    const h = root.value.clientHeight

    width.value = w
    height.value = h
  })

  if (root.value) {
    observer.observe(root.value)
  }

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})
</script>

<style lang="scss" scoped>
.skew-box {
  position: relative;
  border-radius: 3px;

  svg {
    position: absolute;
    inset: -4px;
  }
}
</style>