<template>
  <div class="pin-lock">

    {{ pin }}
    <div class="pin-lock__digits">
      <PinLockDigit v-model="firstDigit" />
      <PinLockDigit v-model="secondDigit" />
      <PinLockDigit v-model="thirdDigit" />
      <PinLockDigit v-model="fourthDigit" />
    </div>

    <button @click="unlock">
      Continue
    </button>

    {{ diary.locked ? 'Locked' : 'Unlocked' }}
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PinLockDigit from './PinLockDigit.vue';
import { useDiary } from '@/store/team/diary';

const diary = useDiary();

const firstDigit = ref<number>(0);
const secondDigit = ref<number>(0);
const thirdDigit = ref<number>(0);
const fourthDigit = ref<number>(0);

const pin = computed(() => `${firstDigit.value}${secondDigit.value}${thirdDigit.value}${fourthDigit.value}`);

function unlock () {
  diary.unlock(pin.value);
}
</script>

<style lang="scss" scoped>
.pin-lock {
  &__digits {
    display: flex;
    gap: .5rem;
  }
}
</style>