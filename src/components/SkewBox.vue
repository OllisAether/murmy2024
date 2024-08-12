<template>
  <div
    class="skew-box"
    ref="root"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :viewBox="[
        -padding,
        -padding,
        width + padding * 2,
        rawHeight + padding * 2
      ].join(' ')"
      :width="`${width + padding * 2}px`"
      :height="`${rawHeight + padding * 2}px`"
      :style="{
        transform: `skew(-${skew}deg)`,
        inset: `-${padding}px`
      }"
    >
      <g
        class="skew-box__content"
        :style="{
          clipPath: (progress !== undefined) ? `inset(${-padding}px ${-padding}px ${(height + padding * 2) * progress - padding / 2}px ${-padding}px)` : undefined
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
          :fill="`url(#skew-box-fill-${id})`"
          :stroke="`url(#skew-box-stroke-${id})`"
          :stroke-width="strokeWidth"
          :style="{
            transform: img ? `translateY(${rawHeight * (1 - imgHeightScale)}px)` : ''
          }"
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
          :stroke="color.lighten(Math.max(-.2, 1 - color.lightness() / 100 * 4)).string()"
          :stroke-width="shadowStrokeWidth"
          stroke-linecap="round"
          fill="none"
          :style="{
            transform:  img ? `translateY(${rawHeight * (1 - imgHeightScale)}px)` : ''
          }"
        />
      </g>

      <g
        v-if="hasProgress"
        class="skew-box__progress"
        :style="{
          clipPath: `inset(${(height + padding * 2) * (1 - progress!) - padding / 2}px ${-padding}px ${-padding}px ${-padding}px)`
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
          :fill="`url(#skew-box-progress-fill-${id})`"
          :stroke="`url(#skew-box-progress-stroke-${id})`"
          :stroke-width="strokeWidth"
          :style="{
            transform: img ? `translateY(${rawHeight * (1 - imgHeightScale)}px)` : ''
          }"
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
          :stroke="progressColor.lighten(Math.max(-.2, 1 - progressColor.lightness() / 100 * 4)).string()"
          :stroke-width="shadowStrokeWidth"
          stroke-linecap="round"
          fill="none"
          :style="{
            transform:  img ? `translateY(${rawHeight * (1 - imgHeightScale)}px)` : '',
          }"
        />
      </g>

      <g :mask="`url(#skew-box-path-${id})`">
        <g class="skew-box__image-scale"
          :style="{
            transformOrigin: 'bottom center',
            transform: `scale(${
              hasProgress
                ? progress! * (1 - progressScale) + progressScale
                : 1
            })`
          }"
        >
          <image
            v-if="img && img !== true"
            :href="img"
            :xlink:href="img"
            :x="-Math.tan(skew * Math.PI / 180) * rawHeight / 2 - (hasProgress ? width * (1 - progressScale): 0)"
            :y="-1"
            :width="Math.tan(skew * Math.PI / 180) * rawHeight + width + 2 + (hasProgress ? width * (1 - progressScale) * 2 : 0)"
            :height="rawHeight + 2"
            preserveAspectRatio="xMidYMid slice"
            :style="{
              transformOrigin: 'center',
              transform: `skew(${skew}deg)`
            }"
            :filter="hasProgress ? `url(#desaturate-${id})` : ''"
          />
        </g>
      </g>

      <defs>
        <linearGradient :id="`skew-box-fill-${id}`" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" :stop-color="color.string()" stop-opacity="60%"/>
          <stop offset="100%" :stop-color="color.rotate(-20).darken(0.4).string()" stop-opacity="40%" />
        </linearGradient>
        <linearGradient :id="`skew-box-stroke-${id}`" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" :stop-color="color.rotate(10).lighten(Math.max(0, 1 - color.lightness() / 100 * 2)).string()" />
          <stop offset="100%" :stop-color="color.rotate(10).darken(.2).string()" />
        </linearGradient>

        <template v-if="hasProgress">
          <linearGradient :id="`skew-box-progress-fill-${id}`" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" :stop-color="progressColor.string()" stop-opacity="60%"/>
            <stop offset="100%" :stop-color="progressColor.rotate(-20).darken(0.4).string()" stop-opacity="40%" />
          </linearGradient>
          <linearGradient :id="`skew-box-progress-stroke-${id}`" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" :stop-color="progressColor.rotate(10).lighten(Math.max(0, 1 - progressColor.lightness() / 100 * 2)).string()" />
            <stop offset="100%" :stop-color="progressColor.rotate(10).darken(.2).string()" />
          </linearGradient>

          <filter :id="`desaturate-${id}`">
            <feColorMatrix
              type="saturate"
              :values="`${hasProgress ? Math.min(1, progress! * 2) : 1}`"
            />
          </filter>
        </template>

        <mask v-if="img" :id="`skew-box-path-${id}`">
          <path
            :d="`
              M 0 0
              L${width} 0 ${width} ${rawHeight - cornerCut - roundedCorners * sqrtEighth}
              
              A${roundedCorners} ${roundedCorners} 0 0 1 ${width - roundedCorners * sqrtEighth} ${rawHeight - cornerCut + roundedCorners * sqrtEighth}
              L${width - cornerCut + roundedCorners * sqrtEighth} ${rawHeight - roundedCorners * sqrtEighth}
              A${roundedCorners} ${roundedCorners} 0 0 1 ${width - cornerCut - roundedCorners * sqrtEighth} ${rawHeight}
              L${roundedCorners} ${rawHeight}
              A${roundedCorners} ${roundedCorners} 0 0 1 0 ${rawHeight - roundedCorners} Z
            `"
            fill="white"
            stroke="white"
            :stroke-width="strokeWidth"
          />
        </mask>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { idGen } from '../../shared/random';
import Color from 'color';

const root = ref<HTMLElement | null>(null)
const sqrtEighth = Math.sqrt(0.125)

const props = withDefaults(defineProps<{
  cornerCut?: number
  displaceDistance?: number
  roundedCorners?: number
  color?: string
  skew?: number
  img?: string | true
  imgHeightScale?: number
  
  progress?: number
  progressColor?: string
  progressScale?: number

  strokeWidth?: number
  shadowStrokeWidth?: number,
  padding?: number
}>(), {
  cornerCut: 16,
  roundedCorners: 4,
  displaceDistance: 6,
  color: '#1E2023',
  skew: 10,
  imgHeightScale: 0.8,
  strokeWidth: 2,
  shadowStrokeWidth: 3,
  padding: 8,
  progressScale: 0.85
})

const bigCorner = computed(() => props.displaceDistance + props.roundedCorners)
const hasProgress = computed(() => props.progress !== undefined)

const width = ref(100)
const height = computed(() => {
  if (props.img) {
    return rawHeight.value * props.imgHeightScale
  }
  return rawHeight.value
})

const color = computed(() => {
  return Color(props.color)
})
const progressColor = computed(() => {
  return Color(props.progressColor ?? props.color)
})

const rawHeight = ref(100)

const id = idGen()

onMounted(() => {
  const observer = new ResizeObserver(() => {
    if (!root.value) return

    const w = root.value.clientWidth
    const h = root.value.clientHeight

    width.value = w
    rawHeight.value = h
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
  }

  &__content {
    will-change: clip-path;
    transition: clip-path 1s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &__progress {
    will-change: clip-path;
    transition: clip-path 1s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &__image-scale {
    will-change: transform;
    transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
  }
}
</style>