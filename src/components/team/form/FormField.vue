<template>
  <div class="form-field">
    <div class="form-field__header">
      <div class="form-field__title">
        <TextContentRenderer :text-content="field.title" />
      </div>
      <div v-if="field.description" class="form-field__description">
        <TextContentRenderer :text-content="field.description" />
      </div>
    </div>

    <FormFieldEntry :field="field" v-if="field.type === 'entry'" />
    <FormFieldChoice :field="field" v-else-if="field.type === 'choice'" />
    <FormFieldOrder :field="field" v-else-if="field.type === 'order'" />
    <FormFieldConnect :field="field" v-else-if="field.type === 'connect'" />
    <FormFieldAssign :field="field" v-else-if="field.type === 'assign'" />
    <FormFieldSuspect :field="field" v-else-if="field.type === 'suspect'" />
  </div>
</template>

<script setup lang="ts">
import { FormField } from '@/../shared/form';
import TextContentRenderer from '../TextContentRenderer.vue';
import FormFieldEntry from './FormFieldEntry.vue';
import FormFieldChoice from './FormFieldChoice.vue';
import FormFieldOrder from './FormFieldOrder.vue';
import FormFieldSuspect from './FormFieldSuspect.vue';
import FormFieldConnect from './FormFieldConnect.vue';
import FormFieldAssign from './FormFieldAssign.vue';

defineProps<{
  field: FormField
}>()
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form-field {
  border-bottom: 1px solid #fff2;
  padding-bottom: 3rem;
  margin-bottom: 2rem;

  &__header {
    margin-bottom: 2rem;
  }

  &__title {
    font-family: $fontHeading;
    font-size: 2rem;
    font-weight: bold;
  }

  &__description {
    color: #fff8;
  }
}
</style>