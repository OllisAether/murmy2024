<template>
  <div class="form-field-order">
    <div class="form-field-order__pool">
      <div
        v-for="entry in pool"
        :key="entry.id"
        class="form-field-order__pool__entry"
        @click="order.push(entry.id)"
      >
        <TextContentRenderer :text-content="entry.text" />
      </div>

      <div v-if="!pool.length" class="form-field-order__pool__no-more">
        Keine weiteren Einträge verfügbar.
      </div>
    </div>

    <div class="form-field-order__order">
      <button
        v-for="(entry, i) in computedOrder"
        :key="entry.id"
        @click="order = order.filter(id => id !== entry.id)"
        class="form-field-order__order__entry"
      >
        <span class="form-field-order__order__entry__index">{{ i + 1 }}.</span>

        <TextContentRenderer :text-content="entry.text" />
      </button>

      <div v-if="!computedOrder.length" class="form-field-order__order__no-more">
        Wähle Einträge aus dem Pool aus.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormFieldOrder, FormFieldOrderValue } from '@/../shared/form';
import { computed, ref, watch } from 'vue';
import TextContentRenderer from '../TextContentRenderer.vue';

const props = defineProps<{
  field: FormFieldOrder
  value?: FormFieldOrderValue
}>()

const emit = defineEmits(['setForm'])

const order = ref<FormFieldOrderValue>(props.value ?? [])
watch(order, () => emit('setForm', order.value), { deep: true })

const computedOrder = computed(() => order.value.map(entry => props.field.choices.find(choice => choice.id === entry)).filter(choice => choice) as FormFieldOrder['choices'])

const pool = computed(() => {
  return props.field.choices.filter(choice => !order.value.includes(choice.id))
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form-field-order {
  position: relative;

  &__pool {
    position: sticky;
    top: 0;
    display: flex;
    gap: .5rem;
    background: #393c3fa1;
    border: 1px solid #fff2;
    padding: .5rem;
    border-radius: 1rem;

    -webkit-backdrop-filter: blur(2rem);
    backdrop-filter: blur(2rem);

    &__entry {
      padding: 1rem;
      border-radius: 0.5rem;
      background: #fff1;
      border: 1px solid #fff1;
      color: #fff;
      cursor: pointer;
    }

    &__no-more {
      padding: 1rem;
      color: #fff8;
      text-align: center;
      width: 100%;
    }
  }

  &__order {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    margin-top: 1rem;

    background: #393c3fa1;
    border: 1px solid #fff2;
    padding: .5rem;
    border-radius: 1rem;

    &__entry {
      padding: 1rem;
      border-radius: 0.5rem;
      background: #fff1;
      border: 1px solid #fff1;
      cursor: pointer;
      font-size: 1.2rem;
      text-align: left;
      
      &__index {
        margin-right: 0.5rem;
      }
    }

    &__no-more {
      padding: 1rem;
      font-size: 1.2rem;
      color: #fff8;
      text-align: center;
      width: 100%;
    }
  }
}
</style>