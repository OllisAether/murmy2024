<template>
  <div class="carousel">
    <div class="carousel__content" @scroll="scroll" ref="root">
      <slot />
    </div>

    <Btn
      square
      class="carousel__btn carousel__btn--prev"
      @click="scrollTo(value - 1)"
      :disabled="value === 0"
    >
      <VIcon>mdi-chevron-left</VIcon>
    </Btn>

    <Btn
      square
      class="carousel__btn carousel__btn--next"
      @click="scrollTo(value + 1)"
      :disabled="value === items - 1"
    >
      <VIcon>mdi-chevron-right</VIcon>
    </Btn>

    <div v-if="items > 1" class="carousel__indicators">
      <button
        v-for="i in items"
        :key="i"
        :class="['carousel__indicator', {
          'carousel__indicator--active': value === i - 1
        }]"
        @click="scrollTo(i - 1)"
      >
        <svg
          v-if="i === value + 1"
          class="carousel__indicator__progress"
          viewBox="0 0 16 16"
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="8"
            cy="8"
            r="5"
            fill="none"
            stroke="#fff"
            stroke-width="2"
            stroke-dasharray="31.42"
            style="
              transform-origin: 50% 50%;
              transform: rotate(-90deg);
            "
            :stroke-dashoffset="31.42 - 31.42 * (indicatorProgress / 100)"
          />
        </svg>
      </button>
      <VBtn
        icon
        size="1.5rem"
        variant="tonal"
        @click="cycle = !cycle"
        class="carousel__indicator__cycle-btn"
      >
        <VIcon
          size="1rem"
        >{{ cycle ? 'mdi-pause' : 'mdi-play' }}</VIcon>
      </VBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useModel, watch } from 'vue';
import Btn from '../Btn.vue';

const props = withDefaults(defineProps<{
  modelValue?: number
}>(), {
  modelValue: 0
})

const emit = defineEmits(['update:modelValue'])

const items = ref(0)

const value = useModel(props, 'modelValue')

watch(() => props.modelValue, (index) => {
  if (index < 0) {
    value.value = 0
  }

  items.value = root.value?.querySelectorAll('.carousel-item').length ?? 0

  if (index >= items.value) {
    value.value = items.value - 1
  }

  scrollTo(value.value)
})

watch(value, () => {
  if (cycle.value) {
    startInterval()
  }
})

function scrollTo (index: number) {
  if (root.value) {
    // value.value = index
    root.value.scrollTo({
      left: index * root.value.clientWidth,
      behavior: 'smooth'
    })
  }
}

const root = ref<HTMLElement | null>(null)

onMounted(() => {
  scroll()

  items.value = root.value?.querySelectorAll('.carousel-item').length ?? 0
})

const indicatorProgress = ref(0)
const cycle = ref(true)

let animationFrame = 0
function startInterval () {
  let start = Date.now()

  function update () {
    const now = Date.now()

    indicatorProgress.value = (now - start) / 10000 * 100

    if (indicatorProgress.value >= 100) {
      indicatorProgress.value = 0
      start = now
      scrollTo((value.value + 1) % items.value)
      return
    }

    if (!cycle.value) {
      indicatorProgress.value = 0
      return
    }

    animationFrame = requestAnimationFrame(update)
  }

  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  animationFrame = requestAnimationFrame(update)
}

function stopInterval () {
  cancelAnimationFrame(animationFrame)
  indicatorProgress.value = 0
}

watch(cycle, (value) => {
  if (value) {
    startInterval()
  } else {
    stopInterval()
  }
}, { immediate: true })

function scroll () {
  if (!root.value) return

  const scrollLeft = root.value.scrollLeft
  const width = root.value.clientWidth
  const index = Math.round(scrollLeft / width)

  value.value = index
}
</script>

<style lang="scss" scoped>
.carousel {
  position: relative;

  &__content {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
    
    & > * {
      // width: 100%;
      flex: 0 0 100%;
      scroll-snap-align: start;
    }
  }

  &__btn {
    position: absolute;
    top: 50%;

    &--prev {
      right: calc(100% + 2rem);
    }

    &--next {
      left: calc(100% + 2rem);
    }
  }

  &__indicators {
    position: relative;
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 1rem;
    margin: 0 auto;
  }

  &__indicator {
    position: relative;
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
    background: #fff4;
    cursor: pointer;
    transition: background .2s;

    &--active {
      background: #fff;
    }

    &__progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &__cycle-btn {
      position: absolute;
      left: calc(100% + 1rem);
    }
  }
}
</style>