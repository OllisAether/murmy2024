<template>
  <div class="form-field-suspect">
    <button
      v-for="sus in suspects"
      :key="sus.id"
      :class="['form-field-suspect__suspect', {
        'form-field-suspect__suspect--active': sus.id === suspect
      }]"
      @click="toggleSuspect(sus.id)"
    >
      {{ sus.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { suspects } from '../../../../shared/assets/suspects';
import { FormFieldSuspect, FormFieldSuspectValue } from '../../../../shared/form';

const props = defineProps<{
  field: FormFieldSuspect
  value?: FormFieldSuspectValue
}>()

const emit = defineEmits(['setForm'])

const suspect = ref<FormFieldSuspectValue | null>(props.value ?? null)
watch(suspect, () => emit('setForm', suspect.value), { deep: true })

function toggleSuspect(newSuspect: string) {
  if (suspect.value === newSuspect) {
    suspect.value = null
  } else {
    suspect.value = newSuspect
  }
}
</script>

<style lang="scss" scoped>
.form-field-suspect {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .5rem;

  &__suspect {
    padding: .5rem 1rem;
    border-radius: .5rem;
    font-size: 1.2rem;
    text-align: left;
    background-color: #fff1;
    color: #fff;

    transition: background-color 0.2s, box-shadow 0.2s;

    &--active {
      background-color: #79ccff44;
      box-shadow: 0 0 0 2px #79ccff88;
    }
  }
}
</style>