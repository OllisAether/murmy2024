<template>
  <div class="form-field-suspect">
    <!-- <button
      v-for="sus in suspects"
      :key="sus.id"
      :class="['form-field-suspect__suspect', {
        'form-field-suspect__suspect--active': sus.id === suspect
      }]"
      @click="toggleSuspect(sus.id)"
    >

      {{ sus.name }}
    </button> -->
    <button
      v-for="suspect in suspects"
      :key="suspect.id"
      :class="['form-field-suspect__suspect', {
        'form-field-suspect__suspect--active': suspect.id === activeSuspect
      }]"
      @click="toggleSuspect(suspect.id)"
    >
      <div class="form-field-suspect__suspect__img">
        <SkewBox
          class="form-field-suspect__suspect__img__skew"
          :img-height-scale="0.7"
          :img="suspect.imageAssetId ? game.getAsset(suspect.imageAssetId)?.content : true"
          :progress-color="suspect.color"
          :progress="suspect.id === activeSuspect ? 1 : 0"
        />

        <VIcon v-if="suspect.id === 'generic'">
          mdi-cards-playing
        </VIcon>
      </div>
      <div class="form-field-suspect__suspect__name">
        <span>
          {{ suspect.name }}
        </span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { suspects } from '../../../../shared/assets/suspects';
import { FormFieldSuspect, FormFieldSuspectValue } from '../../../../shared/form';
import { useGameManager } from '@/store/gameManager';
import SkewBox from '@/components/SkewBox.vue';

const props = defineProps<{
  field: FormFieldSuspect
  value?: FormFieldSuspectValue
}>()

const game = useGameManager()

const emit = defineEmits(['setForm'])

const activeSuspect = ref<FormFieldSuspectValue | null>(props.value ?? null)
watch(activeSuspect, () => emit('setForm', activeSuspect.value), { deep: true })

function toggleSuspect(newSuspect: string) {
  if (activeSuspect.value === newSuspect) {
    activeSuspect.value = null
  } else {
    activeSuspect.value = newSuspect
  }
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;
@use 'sass:math';

.form-field-suspect {
  overflow-y: auto;
  display: flex;
  margin-top: -1rem;
  padding: 0 3rem 1rem;
  gap: 1.5rem;
  mask-image: linear-gradient(90deg, #0000, black 2rem, black calc(100% - 2rem), #0000);

  &__suspect {
    width: 10rem;
    display: flex;
    flex-direction: column;
    font-family: $fontHeading;

    &--active {
      .form-field-suspect__suspect__name {
        color: white;

        &::before {
          background: #f44;
        }
      }

      .form-field-suspect__suspect__img .v-icon {
        transform: translate(-50%, -50%)scale(1.2)translateY(-.25rem);
        color: #fff;
      }
    }

    &__img {
      flex: 0 0 auto;
      position: relative;
      width: 10rem;
      height: 10rem * math.div(9, 5);
      margin-bottom: 1rem;

      &__skew {
        position: absolute;
        inset: 0;
      }

      .v-icon {
        position: absolute;
        top: 67%;
        left: 45%;
        transform: translate(-50%, -50%);

        font-size: 4rem;
        color: #fff3;
        
        mask-image: linear-gradient(black, #0000);
        
        transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1), color 1s cubic-bezier(0.19, 1, 0.22, 1);
      }
    }

    &__name {
      display: flex;

      line-height: 1.2rem;
      text-align: left;
      width: 100%;
      margin-left: -.8rem;
      color: #fff8;

      transition: color .2s;

      & > span {
        mask-image: linear-gradient(black, #0008);
      }

      &::before {
        flex: 0 0 auto;
        content: '';
        width: .3rem;
        height: .3rem;
        margin-top: .25rem;
        margin-right: .4rem;
        border-radius: 50%;
        background: $stroke;

        transition: background .2s;
      }
    }
  }
}
</style>