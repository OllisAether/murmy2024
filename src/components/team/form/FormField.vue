<template>
  <div class="form-field">
    <div class="form-field__header">
      <div class="form-field__points">
        <VIcon size="1em">mdi-star-four-points</VIcon>
        {{ getMaxPoints(field) }} Punkte
      </div>
      <div class="form-field__title">
        <TextContentRenderer :text-content="field.title" />
      </div>
      <div v-if="field.description" class="form-field__description">
        <TextContentRenderer :text-content="field.description" />
      </div>
    </div>

    <FormFieldEntry
      v-if="field.type === 'entry'"
      :value="(fieldValue as FormFieldEntryValue)"
      :field="field"
      @setForm="setForm"
    />
    <FormFieldChoice
      v-else-if="field.type === 'choice'"
      :value="(fieldValue as FormFieldChoiceValue)"
      :field="field"
      @setForm="setForm"
    />
    <FormFieldOrder
      v-else-if="field.type === 'order'"
      :value="(fieldValue as FormFieldOrderValue)"
      :field="field"
      @setForm="setForm"
    />
    <FormFieldConnect
      v-else-if="field.type === 'connect'"
      :value="(fieldValue as FormFieldConnectValue)"
      :field="field"
      @setForm="setForm"
    />
    <FormFieldAssign
      v-else-if="field.type === 'assign'"
      :value="(fieldValue as FormFieldAssignValue)"
      :field="field"
      @setForm="setForm"
    />
    <FormFieldSuspect
      v-else-if="field.type === 'suspect'"
      :value="(fieldValue as FormFieldSuspectValue)"
      :field="field"
      @setForm="setForm"
    />
  </div>
</template>

<script setup lang="ts">
import { FormField, FormFieldAssignValue, FormFieldChoiceValue, FormFieldConnectValue, FormFieldEntryValue, FormFieldOrderValue, FormFieldSuspectValue, FormFieldValue, getMaxPoints } from '@/../shared/form';
import TextContentRenderer from '../../TextContentRenderer.vue';
import FormFieldEntry from './FormFieldEntry.vue';
import FormFieldChoice from './FormFieldChoice.vue';
import FormFieldOrder from './FormFieldOrder.vue';
import FormFieldSuspect from './FormFieldSuspect.vue';
import FormFieldConnect from './FormFieldConnect.vue';
import FormFieldAssign from './FormFieldAssign.vue';
import { useGameManager } from '@/store/gameManager';

const game = useGameManager()

const props = defineProps<{
  field: FormField
}>()

const fieldValue: FormFieldValue | undefined = game.form[props.field.id]

function setForm (value: FormFieldValue) {
  game.setFieldValue(props.field.id, value)
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form-field {
  border-top: 1px solid #fff2;
  padding-top: 2rem;
  margin-bottom: 3rem;

  &__header {
    margin-bottom: 2rem;
  }

  &__title {
    font-family: $fontHeading;
    font-size: 2rem;
    font-weight: bold;
  }

  &__points {
    float: right;
    font-size: 1.2rem;
    color: #fff8;
  }

  &__description {
    color: #fff8;
  }
}
</style>