<template>
  <div class="form-field-entry">
    <div :class="['form-field-entry__dropzone', {
      'form-field-entry__dropzone--hovering': hovering,
      'form-field-entry__dropzone--drag-error': (field.morePossible ? entries.length >= max : entries.length >= amount) ||
        (entryDrag.draggedEntry && entries.includes(entryDrag.draggedEntry))
    }]" ref="dropzone">
      <div class="form-field-entry__dropzone__entries" v-if="entries.length">
        <div
          v-for="entry in computedEntries"
          :key="entry.id"
          :class="['form-field-entry__dropzone__entry', {
            'form-field-entry__dropzone__entry--has-description': !!entry.description
          }]"
        >
          <div class="form-field-entry__dropzone__entry__content">
            <div class="form-field-entry__dropzone__entry__title">
              {{ suspects.find(suspect => suspect.id === entry.suspectId)?.name ?? 'Allgemein' }} -
              <TextContentRenderer :text-content="entry.title" />
            </div>
            <div v-if="entry.description" class="form-field-entry__dropzone__entry__description">
              <TextContentRenderer :text-content="entry.description" />
            </div>
          </div>

          <button
            @click="entries.splice(entries.indexOf(entry.id), 1)"
            class="form-field-entry__dropzone__entry__close-btn"
          >
            <VIcon>mdi-close</VIcon>
          </button>
        </div>
      </div>
      <div class="form-field-entry__dropzone__hint" v-if="field.morePossible ? entries.length < max : entries.length < amount">
        <template v-if="amount - entries.length <= 0">
          Noch
          {{ max - entries.length }} {{ max - entries.length === 1 ? 'weiterer Eintrag' : 'weitere Einträge' }}
        </template>
        <template v-else>
          Noch
          {{ amount - entries.length }} {{ amount - entries.length === 1 ? 'Eintrag' : 'Einträge' }}
        </template>
        aus der Datenbank hierrein ziehen
        <HelpBtn>
          <template #header>
            Drag & Drop
          </template>

          Ziehe Einträge per Drag & Drop aus der Datenbank links in diesen Bereich, um sie auszuwählen.
        </HelpBtn>
      </div>
    </div>
    <div class="form-field-entry__amount">
      Wähle
      <strong>
        <em>
          {{ field.morePossible ? 'mindestens' : 'genau' }}
          {{ amount }}
        </em>
      </strong>
      {{ amount === 1 ? 'Eintrag' : 'Einträge' }}
      aus der Datenbank.

      <template v-if="field.morePossible">
        <template v-if="field.morePossible.max">
          (max.
          <strong>
            <em>
              {{ field.morePossible.max }}
            </em>
          </strong>)
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormFieldEntry, FormFieldEntryValue } from '@/shared/form';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import HelpBtn from '../HelpBtn.vue';
import { useEntryDrag } from '@/store/team/entryDrag';
import { useGameManager } from '@/store/gameManager';
import { Entry } from '../../../shared/suspectDatabase/entry';
import { suspects } from '../../../shared/assets/suspects';
import TextContentRenderer from '../../TextContentRenderer.vue';

const game = useGameManager()
const entryDrag = useEntryDrag()

const props = defineProps<{
  field: FormFieldEntry
  value?: FormFieldEntryValue
}>()

const emit = defineEmits(['setForm'])

const amount = computed(() => {
  return props.field.amount ?? props.field.solutions.length
})
const max = computed(() => {
  return (props.field.morePossible && props.field.morePossible.max) || amount.value
})

const entries = ref<FormFieldEntryValue>(props.value ?? [])
watch(entries, () => emit('setForm', entries.value), { deep: true })

const computedEntries = computed<Entry[]>(() => entries.value.map(entry => game.allEntries.find(e => e.id === entry)).filter(e => e) as Entry[])

const dropzone = ref<HTMLDivElement | null>(null)

function onDrop(entry: string) {
  if (props.field.morePossible ? entries.value.length < max.value : entries.value.length < amount.value) {
    if (!entries.value.includes(entry)) {
      entries.value.push(entry)
    }
  }
}

const hovering = computed(() => {
  return entryDrag.hoveringDropZone?.el === dropzone.value
})

onMounted(() => {
  if (dropzone.value) {
    entryDrag.registerDropZone(dropzone.value, onDrop)
  }
})

onBeforeUnmount(() => {
  if (dropzone.value) {
    entryDrag.unregisterDropZone(dropzone.value)
  }
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form-field-entry {
  &__amount {
    color: #fff8;
    margin-top: .3rem;
    padding: 0 .4rem;
  }

  &__dropzone {
    border: 1px solid #fff2;
    background: #393c3fa1;
    border-radius: 1rem;
    padding: .5rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    transition: border-color .2s, background .2s;

    &--hovering {
      background: #79ccff44;
      border-color: #79ccff88;

      &.form-field-entry__dropzone--drag-error {
        background: #ff7f7f44;
        border-color: #ff7f7f88;
      }
    }

    &__hint {
      font-size: 1.2rem;
      text-align: center;
      border: 2px dashed #fff4;
      border-radius: 0.5rem;
      padding: 1rem;
      color: #fff8;
    }

    &__entries {
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }

    &__entry {
      position: relative;
      background: #fff1;
      border: 1px solid #fff1;
      border-radius: .5rem;

      display: flex;
      align-items: stretch;
      padding: 0 1rem;

      &__content {
        z-index: 1;
        flex: 1 1 auto;
        width: 0;

        padding: 1rem 0;

        display: flex;
        flex-direction: column;

        .form-field-entry__dropzone__entry--has-description & {
          padding: 1rem 0 0;
        }
      }

      &__title {
        font-family: $fontHeading;
        font-size: 1.2rem;

        .form-field-entry__dropzone__entry--has-description & {
          margin-bottom: .2rem;
        }
      }

      &__description {
        flex: 1 1 auto;

        min-height: 2rem;
        max-height: 2rem;
        margin-right: 1rem;
        margin-bottom: .2rem;

        color: #fff8;
        line-height: 1rem;
        outline-offset: -1px;

        font-size: 1rem;
        mask-image: linear-gradient(to top, transparent, black 1rem);
        hyphens: auto;
        overflow: hidden;
      }

      &__close-btn {
        color: #ff5b5bc2;
        font-size: 1.5rem;
      }
    }
  }
}
</style>