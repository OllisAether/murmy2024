<template>
  <div :class="['form-field-assign', {
    'form-field-assign--multiple': field.multiple,
    'form-field-assign--dragging': currentEntry
  }]">
    <div class="form-field-assign__pool" ref="poolEl">
      <div
        v-for="entry in pool"
        :key="entry.id"
        :class="['form-field-assign__pool__entry', {
          'form-field-assign__pool__entry--dragging': currentEntry?.entry.id === entry.id
        }]"
        @pointerdown="pointerdown($event, entry.id)"
      >
        <TextContentRenderer :text-content="entry.text" />
      </div>

      <div v-if="!pool.length" class="form-field-assign__pool__no-more">
        Keine weiteren Einträge verfügbar.
      </div>
    </div>

    <div v-if="field.multiple" class="form-field-assign__hint">
      Du kannst mehrere Einträge zur gleichen Auswahl hinzufügen.
    </div>

    <div class="form-field-assign__pairs">
      <template
        v-for="(pair) in computedPairs"
        :key="pair.a.id"
      >
        <div class="form-field-assign__pairs__a">
          <TextContentRenderer :text-content="pair.a.text" />
        </div>

        <div
          :class="['form-field-assign__pairs__b', {
            'form-field-assign__pairs__b--hovering': hovering === pair.a.id
          }]"
          :data-choice-id="pair.a.id"
          ref="choices"
        >
          <button
            :class="['form-field-assign__pairs__b__entry', {
              'form-field-assign__pairs__b__entry--dragging': currentEntry?.entry.id === entry.id
            }]"
            v-for="entry in pair.b"
            :key="entry.id"
            @click="removePair(pair.a.id, entry.id)"
            @pointerdown="pointerdown($event, entry.id)"
          >
            <TextContentRenderer :text-content="entry.text" />

            <VIcon size="1em">mdi-close</VIcon>
          </button>
        </div>
      </template>
    </div>

    <Teleport to="body">
      <VFadeTransition>
        <div
          v-if="currentEntry"
          class="form-field-assign__current-entry"
          :style="{
            top: `${currentEntry.y}px`,
            left: `${currentEntry.x}px`
          }"
        >
          <TextContentRenderer :text-content="currentEntry.entry.text" />
        </div>
      </VFadeTransition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { FormFieldAssign, FormFieldAssignValue } from '@/shared/form';
import { computed, ref, watch } from 'vue';
import TextContentRenderer from '../../TextContentRenderer.vue';

const props = defineProps<{
  field: FormFieldAssign,
  value?: FormFieldAssignValue
}>()

const emit = defineEmits(['setForm'])

const choices = ref<HTMLDivElement[]>([])
const poolEl = ref<HTMLDivElement | null>(null)

const pairs = ref<FormFieldAssignValue>(props.value ?? [])
watch(pairs, () => emit('setForm', pairs.value), { deep: true })

const computedPairs = computed(() => props.field.choicesA.map(choice => {
  return {
    a: choice,
    b: (pairs.value.find(pair => pair.a === choice.id)?.b ?? [])
      .map(id => props.field.choicesB.find(choice => choice.id === id)).filter(choice => choice) as FormFieldAssign['choicesB']
  }
}))

const pool = computed(() => {
  return props.field.choicesB.filter(choice => !pairs.value.map(pair => pair.b).flat().includes(choice.id))
})

function addPair (a: string, b: string) {
  removeEntry(b)

  const pair = pairs.value.find(pair => pair.a === a)

  if (!props.field.multiple) {
    pairs.value = pairs.value.filter(pair => pair.a !== a)

    if (pair) {
      removeEntry(pair.b[0])
    }

    pairs.value.push({ a, b: [b] })
  }

  if (pair) {
    pair.b.push(b)
  } else {
    pairs.value.push({ a, b: [b] })
  }
}

function removePair (a: string, b: string) {
  const pair = pairs.value.find(pair => pair.a === a)

  if (pair) {
    pair.b = pair.b.filter(id => id !== b)

    if (!pair.b.length) {
      pairs.value = pairs.value.filter(pair => pair.a !== a)
    }
  }
}

function removeEntry (b: string) {
  pairs.value = pairs.value.map(pair => {
    pair.b = pair.b.filter(id => id !== b)
    return pair
  }).filter(pair => pair.b.length)
}

const hovering = ref<string | null>(null)

const currentEntry = ref<{
  entry: FormFieldAssign['choicesB'][0],
  x: number,
  y: number
} | null>(null)
function pointerdown (event: PointerEvent, b: string) {
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)

  const start = { x: event.clientX, y: event.clientY }

  let thresholdSurpassed = false
  function move (event: PointerEvent) {
    const distance = Math.sqrt((event.clientX - start.x) ** 2 + (event.clientY - start.y) ** 2)

    if (!thresholdSurpassed && distance > 10) {
      const entry = props.field.choicesB.find(choice => choice.id === b)

      if (!entry) {
        return
      }

      thresholdSurpassed = true
      currentEntry.value = {
        entry,
        x: event.clientX,
        y: event.clientY
      }
    } else if (!thresholdSurpassed) {
      return
    }

    if (currentEntry.value) {
      currentEntry.value.x = event.clientX
      currentEntry.value.y = event.clientY

      const choiceEl = choices.value.find(el => {
        const rect = el.getBoundingClientRect()
        return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
      })

      const a = choiceEl?.dataset.choiceId

      let hoveringPool = false
      const poolRect = poolEl.value?.getBoundingClientRect()
      if (poolRect && event.clientX >= poolRect.left && event.clientX <= poolRect.right && event.clientY >= poolRect.top && event.clientY <= poolRect.bottom) {
        hoveringPool = true
      }

      if (a && !hoveringPool) {
        hovering.value = a
      } else {
        hovering.value = null
      }
    }
  }

  function up (event: PointerEvent) {
    const choiceEl = choices.value.find(el => {
      const rect = el.getBoundingClientRect()
      return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
    })

    const a = choiceEl?.dataset.choiceId

    let hoveringPool = false
    const poolRect = poolEl.value?.getBoundingClientRect()
    if (poolRect && event.clientX >= poolRect.left && event.clientX <= poolRect.right && event.clientY >= poolRect.top && event.clientY <= poolRect.bottom) {
      hoveringPool = true
    }

    console.log(a, hoveringPool)

    if (a && !hoveringPool) {
      if (!(pairs.value.find(p => p.a === a)?.b.includes(b) ?? false)) {
        addPair(a, b)
      }
    } else {
      removeEntry(b)
    }

    hovering.value = null
    currentEntry.value = null

    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form-field-assign {
  position: relative;

  &__pool {
    z-index: 1;
    position: sticky;
    top: 0;
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    background: #282c2f;
    border: 1px solid #fff2;
    padding: .5rem 4rem .5rem .5rem;
    border-radius: 1rem;
    max-height: 20rem;
    overflow-x: auto;

    &__entry {
      padding: .25rem .5rem;
      border-radius: 0.5rem;
      background: #fff1;
      border: 1px solid #fff1;
      color: #fff;

      touch-action: none;

      transition: opacity 0.2s;

      &--dragging {
        opacity: 0.2;
      }
    }

    &__no-more {
      padding: .5rem .75rem;
      color: #fff8;
      text-align: center;
      width: 100%;
    }
  }

  &__hint {
    color: #fff8;
    margin-top: .3rem;
    padding: 0 .4rem;
  }

  &__pairs {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;

    &__a {
      align-self: center;
      padding: 0 .5rem;
      text-align: right;
      font-size: 1.2rem;
    }

    &__b {
      padding: .5rem;
      border-radius: 1rem;
      background: #393c3fa1;
      border: 1px solid #fff2;
      min-height: 4rem;
      line-height: 1rem;
      display: flex;
      gap: .5rem;
      flex-wrap: wrap;

      transition: background-color 0.2s, border-color 0.2s;

      &--hovering {
        background: #79ccff44;
        border-color: #79ccff88;
      }

      &__entry {
        padding: .5rem .75rem;
        border-radius: 0.5rem;
        background: #fff1;
        border: 1px solid #fff1;

        display: flex;
        width: 100%;
        gap: .5rem;
        justify-content: space-between;
        align-items: center;

        touch-action: none;
        transition: opacity 0.2s;

        .form-field-assign--multiple & {
          width: auto;
        }

        &--dragging {
          opacity: 0.2;
        }
      }
    }
  }

  &__current-entry {
    position: fixed;
    padding: .5rem .75rem;
    border-radius: 0.5rem;
    background: #fff1;
    border: 1px solid #fff1;
    transform: translate(-50%, -100%);

    display: flex;
    width: max-content;
    gap: .5rem;
    align-items: center;

    pointer-events: none;

    -webkit-backdrop-filter: blur(2rem);
    backdrop-filter: blur(2rem);
  }
}
</style>