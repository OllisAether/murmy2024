<template>
  <div :class="['form-field-connect', {
    'form-field-connect--dragging': currentPair
  }]">
    <div class="form-field-connect__choices form-field-connect__choices--a">
      <div
        v-for="choice in field.choicesA"
        :key="choice.id"
        :class="['form-field-connect__choice', {
          'form-field-connect__choice--active': currentPair ? currentPair.a === choice.id : false,
          'form-field-connect__choice--hover': currentPair ? hoveringA === choice.id && currentPair.a === null : false,
        }]"
        @pointerdown="pointerdownA($event, choice.id)"
        ref="choicesA"
        :data-choice-id="choice.id"
      >
        <TextContentRenderer :text-content="choice.text" />

        <div class="form-field-connect__choice__port"></div>
      </div>
    </div>
    <div class="form-field-connect__connections" ref="root">
      <div
        v-for="pair in computedPairs"
        :key="pair.a"
        class="form-field-connect__connection"
      >
        <svg
          class="form-field-connect__connection__line"
          :viewBox="`0 -10 ${pair.width} ${pair.height + 20}`"
          :style="{
            top: Math.min(pair.aTop, pair.bTop) - 10 + 'px',
            width: pair.width + 'px',
            height: pair.height + 20 + 'px'
          }"
        >
          <path
            :d="pair.aTop < pair.bTop
              ? `M 0 0 C ${pair.width / 2} 0 ${pair.width / 2} ${pair.height} ${pair.width} ${pair.height}`
              : `M 0 ${pair.height} C ${pair.width / 2} ${pair.height} ${pair.width / 2} 0 ${pair.width} 0`"
            stroke="white"
            stroke-width="4"
            fill="none"
          />
        </svg>
      </div>

      <Teleport to="body">
        <div
          v-if="currentPair"
          class="form-field-connect__connection form-field-connect__connection--current"
        >
          <svg
            class="form-field-connect__connection__line"
            :viewBox="`${-currentPair.rootWidth / 4} -10 ${currentPair.width + currentPair.rootWidth * .5} ${currentPair.height + 20}`"
            :style="{
              top: Math.min(currentPair.aPos.y, currentPair.bPos.y) - 10 + 'px',
              left: Math.min(currentPair.aPos.x, currentPair.bPos.x) - currentPair.rootWidth / 4 + 'px',
              width: currentPair.width + currentPair.rootWidth * .5 + 'px',
              height: currentPair.height + 20 + 'px'
            }"
          >
            <path
              :d="currentPair.aPos.y < currentPair.bPos.y
                ? (
                  currentPair.aPos.x < currentPair.bPos.x
                    ? `M 0 0 C ${currentPair.rootWidth / 2} 0 ${currentPair.width - currentPair.rootWidth / 2} ${currentPair.height} ${currentPair.width} ${currentPair.height}`
                    : `M ${currentPair.width} 0 C ${currentPair.width + currentPair.rootWidth / 2} 0 ${-currentPair.rootWidth / 2} ${currentPair.height} 0 ${currentPair.height}`
                )
                : (
                  currentPair.aPos.x < currentPair.bPos.x
                    ? `M 0 ${currentPair.height} C ${currentPair.rootWidth / 2} ${currentPair.height} ${currentPair.width - currentPair.rootWidth / 2} 0 ${currentPair.width} 0`
                    : `M ${currentPair.width} ${currentPair.height} C ${currentPair.width + currentPair.rootWidth / 2} ${currentPair.height} ${-currentPair.rootWidth / 2} 0 0 0`
                )"
              stroke="white"
              stroke-width="4"
              fill="none"
            />
          </svg>
        </div>
      </Teleport>
    </div>
    <div class="form-field-connect__choices form-field-connect__choices--b">
      <div
        v-for="choice in field.choicesB"
        :key="choice.id"
        :class="['form-field-connect__choice', {
          'form-field-connect__choice--active': currentPair ? currentPair.b === choice.id : false,
          'form-field-connect__choice--hover': currentPair ? hoveringB === choice.id && currentPair.b === null : false,
        }]"
        @pointerdown="pointerdownB($event, choice.id)"
        ref="choicesB"
        :data-choice-id="choice.id"
      >
        <TextContentRenderer :text-content="choice.text" />

        <div class="form-field-connect__choice__port"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormFieldConnect, FormFieldConnectValue } from '@/../shared/form';
import TextContentRenderer from '../TextContentRenderer.vue';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  field: FormFieldConnect
  value?: FormFieldConnectValue
}>()

const emit = defineEmits(['setForm'])

const root = ref<HTMLElement | null>(null)
const choicesA = ref<HTMLElement[]>([])
const choicesB = ref<HTMLElement[]>([])

const pairs = ref<FormFieldConnectValue>(props.value ?? [])
watch(pairs, () => emit('setForm', pairs.value), { deep: true })

const computedPairs = computed(() => pairs.value.map(pair => {
  const elA = choicesA.value.find(el => el.dataset.choiceId === pair.a)
  const elB = choicesB.value.find(el => el.dataset.choiceId === pair.b)

  if (!root.value || !elA || !elB) {
    return {
      a: pair.a,
      b: pair.b,
      aTop: 0,
      bTop: 0,
      width: 0,
      height: 0
    }
  }

  const rootRect = root.value.getBoundingClientRect()
  const aRect = elA.getBoundingClientRect()
  const bRect = elB.getBoundingClientRect()

  const aTop = aRect.top - rootRect.top + aRect.height / 2
  const bTop = bRect.top - rootRect.top + bRect.height / 2

  const width = bRect.left - aRect.right
  const height = Math.abs(bTop - aTop)

  return {
    a: pair.a,
    b: pair.b,
    aTop,
    bTop,
    width,
    height
  }
}))

const hoveringA = ref<string | null>(null)
const hoveringB = ref<string | null>(null)

const currentPair = ref<{
  a: string | null,
  b: string | null,
  aPos: { x: number, y: number },
  bPos: { x: number, y: number },
  width: number,
  height: number,
  rootWidth: number,
} | null>(null)

function pointerdownA (event: PointerEvent, choiceId: string) {
  pairs.value = pairs.value.filter(pair => pair.a !== choiceId)
  const choiceEl = choicesA.value.find(el => el.dataset.choiceId === choiceId)

  if (!choiceEl) return

  currentPair.value = {
    a: choiceId,
    b: null,
    aPos: {
      x: choiceEl.getBoundingClientRect().right,
      y: choiceEl.getBoundingClientRect().top + choiceEl.getBoundingClientRect().height / 2
    },
    bPos: {
      x: event.clientX,
      y: event.clientY
    },
    width: 0,
    height: 0,
    rootWidth: root.value?.getBoundingClientRect().width ?? 0
  }

  currentPair.value.width = Math.abs(currentPair.value.bPos.x - currentPair.value.aPos.x)
  currentPair.value.height = Math.abs(currentPair.value.bPos.y - currentPair.value.aPos.y)

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)

  function move (event: PointerEvent) {
    if (!currentPair.value) return

    const choiceEl = choicesB.value.find(el => {
      const rect = el.getBoundingClientRect()
      return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
    })

    hoveringB.value = choiceEl?.dataset.choiceId ?? null

    if (choiceEl) {
      currentPair.value.bPos = {
        x: choiceEl.getBoundingClientRect().left,
        y: choiceEl.getBoundingClientRect().top + choiceEl.getBoundingClientRect().height / 2
      }
    } else {
      currentPair.value.bPos = {
        x: event.clientX,
        y: event.clientY
      }
    }

    currentPair.value.width = Math.abs(currentPair.value.bPos.x - currentPair.value.aPos.x)
    currentPair.value.height = Math.abs(currentPair.value.bPos.y - currentPair.value.aPos.y)
  }

  function up (event: PointerEvent) {
    const choiceEl = choicesB.value.find(el => {
      const rect = el.getBoundingClientRect()
      return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
    })

    const b = choiceEl?.dataset.choiceId

    if (b) {
      addPair(choiceId, b)
    }

    currentPair.value = null
    hoveringA.value = null
    hoveringB.value = null

    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
  }
}

function pointerdownB (event: PointerEvent, choiceId: string) {
  pairs.value = pairs.value.filter(pair => pair.b !== choiceId)
  const choiceEl = choicesB.value.find(el => el.dataset.choiceId === choiceId)

  if (!choiceEl) return

  currentPair.value = {
    a: null,
    b: choiceId,
    aPos: {
      x: event.clientX,
      y: event.clientY
    },
    bPos: {
      x: choiceEl.getBoundingClientRect().left,
      y: choiceEl.getBoundingClientRect().top + choiceEl.getBoundingClientRect().height / 2
    },
    width: 0,
    height: 0,
    rootWidth: root.value?.getBoundingClientRect().width ?? 0
  }

  currentPair.value.width = Math.abs(currentPair.value.bPos.x - currentPair.value.aPos.x)
  currentPair.value.height = Math.abs(currentPair.value.bPos.y - currentPair.value.aPos.y)

  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)

  function move (event: PointerEvent) {
    if (!currentPair.value) return

    const choiceEl = choicesA.value.find(el => {
      const rect = el.getBoundingClientRect()
      return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
    })

    hoveringA.value = choiceEl?.dataset.choiceId ?? null

    if (choiceEl) {
      currentPair.value.aPos = {
        x: choiceEl.getBoundingClientRect().right,
        y: choiceEl.getBoundingClientRect().top + choiceEl.getBoundingClientRect().height / 2
      }
    } else {
      currentPair.value.aPos = {
        x: event.clientX,
        y: event.clientY
      }
    }

    currentPair.value.width = Math.abs(currentPair.value.bPos.x - currentPair.value.aPos.x)
    currentPair.value.height = Math.abs(currentPair.value.bPos.y - currentPair.value.aPos.y)
  }

  function up (event: PointerEvent) {
    const choiceEl = choicesA.value.find(el => {
      const rect = el.getBoundingClientRect()
      return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
    })

    const a = choiceEl?.dataset.choiceId

    if (a) {
      addPair(a, choiceId)
    }

    currentPair.value = null
    hoveringA.value = null
    hoveringB.value = null

    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
}

function addPair (a: string, b: string) {
  if (pairs.value.some(pair => pair.a === a && pair.b === b)) {
    pairs.value = pairs.value.filter(pair => pair.a !== a && pair.b !== b)
    return
  }

  pairs.value = pairs.value.filter(pair => pair.a !== a && pair.b !== b)
  pairs.value.push({ a, b })
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form-field-connect {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  &__choices {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    // &--a {
    // }

    // &--b {
    // }
  }

  &__choice {
    position: relative;
    padding: 1rem;
    border-radius: 1rem;
    background: #393c3fa1;
    border: 1px solid #fff2;
    color: #fff;
    touch-action: none;

    text-align: left;

    & > * {
      pointer-events: none;
    }

    transition: background-color 0.2s, border-color 0.2s;

    &--hover, &--active {
      background: #79ccff44;
      border-color: #79ccff88;
    }

    &__port {
      z-index: 1;
      position: absolute;
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
      background: #73777a;
      border: 1px solid #fff7;

      top: 50%;
      transform: translateY(-50%);

      .form-field-connect__choices--a & {
        right: -.4rem;
      }

      .form-field-connect__choices--b & {
        left: -.4rem;
      }
    }
  }

  &__connections {
    position: relative;
    grid-column: 2 / 3;
  }

  &__connection {
    &__line {
      pointer-events: none;
      position: absolute;
      left: 0;
      filter: drop-shadow(0 0 1rem #fff3);

      .form-field-connect__connection--current & {
        position: fixed;
      }
    }
  }
}
</style>