<template>
  <div :class="['form-field-choice', {
    'form-field-choice--multiple': field.multiple
  }]">
    <div class="form-field-choice__choices">
      <button
        v-for="choice in field.choices"
        :key="choice.id"
        :class="['form-field-choice__choice', {
          'form-field-choice__choice--active': activeChoices.includes(choice.id)
        }]"
        @click="toggleChoice(choice.id)"
      >
        <div
          class="form-field-choice__choice__check"
          v-if="field.multiple"
        >
          <VIcon v-if="activeChoices.includes(choice.id)">mdi-check</VIcon>
        </div>

        <div class="form-field-choice__choice__content">
          <TextContentRenderer :text-content="choice.text" />
        </div>
      </button>
    </div>

    <div v-if="max > 1" class="form-field-choice__hint">
      <template v-if="max === field.choices.length">
        Ihr könnt mehrere Optionen auswählen.
      </template>
      <template v-else>
        Wählt
        <strong>
          <em>
            {{ max }}
          </em>
        </strong>
        Optionen aus.
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormFieldChoice } from '@/../shared/form';
import TextContentRenderer from '../TextContentRenderer.vue';
import { computed, ref } from 'vue';

const props = defineProps<{
  field: FormFieldChoice
}>()

const activeChoices = ref<string[]>([])

const max = computed(() =>{
  if (props.field.multiple === true) {
    return props.field.choices.length
  } else if (props.field.multiple) {
    return props.field.multiple.max
  } else {
    return 1
  }
})

function toggleChoice(choiceId: string) {
  if (activeChoices.value.includes(choiceId)) {
    activeChoices.value = activeChoices.value.filter(id => id !== choiceId)
  } else {
    activeChoices.value.push(choiceId)

    if (activeChoices.value.length > max.value) {
      activeChoices.value.shift()
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form-field-choice {
  &__choices {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: .5rem;
  }

  &__choice {
    padding: 1rem;
    background-color: #393c3fa1;
    border: 1px solid #fff2;
    font-size: 1.2rem;
    text-align: left;
    border-radius: 1rem;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
    display: flex;
    align-items: center;

    .form-field-choice--multiple & {
      padding: 1rem;
    }

    &--active {
      background-color: #79ccff44;
      border-color: #79ccff88;
    }

    &__check {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: .4rem;
      background-color: #fff1;
      border: 1px solid #fff2;
      margin-right: .75rem;

      & > :deep(.v-icon) {
        font-size: 1.3rem;
        color: #79ccff;
      }
    }
  }

  &__hint {
    color: #fff8;
    margin-top: 1rem;
  }
}
</style>