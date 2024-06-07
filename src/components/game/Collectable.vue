<template>
  <button :class="{
    collectable: true,
    'collectable--active': collectable
  }" @click="collect">
    <div class="collectable__decoration">
      <div />
    </div>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ProfileEntryType } from '@/model/database/suspectProfile';
import { useGameManager } from '@/store/gameManager';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  person?: string;
  type: ProfileEntryType;
  id: string;
  name?: string;
  value: string;
  unlocksSuspect: boolean;
}>(), {
  unlocksSuspect: true,
});

const game = useGameManager();

const collectable = computed(() => {
  if (!props.person) return false;
  if (!props.unlocksSuspect && !game.isSuspectUnlocked(props.person)) return false;

  return !game.getSuspectEntry(props.person, props.type, props.id);
});

function collect() {
  if (!collectable.value) return;
  if (!props.person) return;

  game.addSuspectEntry(props.person, props.type, {
    id: props.id,
    name: props.name,
    value: props.value,
  }, props.unlocksSuspect);
}
</script>

<style scoped lang="scss">
.collectable {
  position: relative;
  display: inline;

  transition: background 0.3s;

  $color: #fc2448;

  &--active {
    background: rgba($color, 0.15)
  }

  &::after {
    position: absolute;
    top: 0;
    right: 0;

    content: '';
    font-size: 0.4em;
    margin-left: 0.5rem;
    background: $color;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    transform: translate(90%, -30%)scale(0);

    transition: transform 0.3s;
  }

  &--active::after {
    transform: translate(90%, -30%)scale(1);
  }

  &__decoration {
    position: absolute;
    inset: 0;
    overflow: hidden;

    & > div {
      position: absolute;
      top: 0;
      left: -101%;
      width: 100%;
      height: 100%;
      background: $color;
      transition: transform 0.3s;

      transition: 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);

      .collectable--active & {
        width: 1rem;
        left: 100%
      }
    }
  }
}
</style>