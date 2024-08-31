<template>
  <div class="form">
    <template v-for="(page, i) in form" :key="i">
      <Transition :name="'form__page' + (transitionDirection === 'next' ? '--next' : '--prev')">
        <div class="form__page" v-if="pageIndex === i">
          <div class="form__page__content">
            <div class="form__page__header">
              <div class="form__page__title">
                <TextContentRenderer :text-content="page.title" />
              </div>
              <div v-if="page.description" class="form__page__description">
                <TextContentRenderer :text-content="page.description" />
              </div>
            </div>
            <FormField v-for="(field, j) in page.fields" :key="j" :field="field" />
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { form } from '@/../shared/assets/form';
import TextContentRenderer from '../../TextContentRenderer.vue';
import { ref, useModel, watch } from 'vue';
import FormField from './FormField.vue';

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [number]
}>()
const pageIndex = useModel(props, 'modelValue')

const transitionDirection = ref<'next' | 'prev' | null>(null)
watch(pageIndex, (newIndex, oldIndex) => {
  if (newIndex > oldIndex) {
    transitionDirection.value = 'next'
  } else {
    transitionDirection.value = 'prev'
  }
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form {
  position: relative;

  &__page {
    border-radius: 0.5rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    position: absolute;
    inset: 0;

    &--next {
      &-enter-active, &-leave-active {
        transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);
      }

      &-enter-from {
        transform: translateX(100%);
      }

      &-leave-to {
        transform: translateX(-100%);
      }
    }
    &--prev {
      &-enter-active, &-leave-active {
        transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);
      }

      &-enter-from {
        transform: translateX(-100%);
      }

      &-leave-to {
        transform: translateX(100%);
      }
    }

    &__header {
      margin-bottom: 2rem;
    }

    &__title {
      font-family: $fontHeading;
      font-size: 3rem;
      font-weight: bold;
    }

    &__description {
      font-size: 1.3rem;
      color: #fff8;
    }

    &__content {
      padding-top: 3rem;
      mask-image: linear-gradient(transparent, black 1rem, black calc(100% - 1rem), transparent);
      height: 0;
      width: calc(100vw - 22rem);
      flex: 1 1 auto;
      overflow-y: auto;
      margin: 0 auto;
      padding: 1rem 4rem;

      display: flex;
      flex-direction: column;
    }
  }
}
</style>