<template>
  <div class="sus-db__wrapper">
    <Transition name="sus-db">
      <div v-if="open" class="sus-db">
        <div class="sus-db__shapes">
          <VIcon class="sus-db__shapes__icon">mdi-server-security</VIcon>
          <span class="sus-db__shapes__text">Elite</span>
        </div>
        <div class="sus-db__header">
          <Timer class="sus-db__timer"/>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 400 34">
            <path fill="currentColor" d="M186.025 29h-8.72v-2.032h8.72c1.088 0 1.696-.608 1.696-1.52 0-.992-.608-1.504-1.696-1.504h-5.344c-2.192 0-3.552-1.392-3.552-3.312 0-1.872 1.264-3.264 3.584-3.264h8.352V19.4h-8.352c-.928 0-1.472.544-1.472 1.424 0 .88.56 1.408 1.456 1.408h5.328c2.352 0 3.616 1.104 3.616 3.36 0 1.952-1.184 3.408-3.616 3.408Zm15.758-5.136v-6.496h1.984v6.496c0 3.6-1.776 5.296-6.288 5.296-4.48 0-6.272-1.696-6.272-5.296v-6.496h2.096v6.496c0 2.336 1.04 3.296 4.24 3.296s4.24-.96 4.24-3.296ZM214.322 29h-8.72v-2.032h8.72c1.088 0 1.696-.608 1.696-1.52 0-.992-.608-1.504-1.696-1.504h-5.344c-2.192 0-3.552-1.392-3.552-3.312 0-1.872 1.264-3.264 3.584-3.264h8.352V19.4h-8.352c-.928 0-1.472.544-1.472 1.424 0 .88.56 1.408 1.456 1.408h5.328c2.352 0 3.616 1.104 3.616 3.36 0 1.952-1.184 3.408-3.616 3.408Zm13.534-3.232h-4.672V23.8h4.672c1.424 0 2.272-.896 2.272-2.208 0-1.344-.848-2.192-2.272-2.192h-6.16V29h-2.016V17.368h8.176c2.688 0 4.256 1.616 4.256 4.16 0 2.512-1.568 4.24-4.256 4.24ZM243.955 29h-10.4V17.368h10.384V19.4h-8.368v7.568h8.384V29Zm-.448-5.056h-6.448v-1.712h6.448v1.712ZM257.312 29h-6.304c-3.248 0-5.648-2.56-5.648-5.936 0-3.424 2.4-5.696 5.648-5.696h6.304V19.4h-6.304c-2.08 0-3.616 1.552-3.616 3.76 0 2.192 1.519 3.808 3.616 3.808h6.304V29Zm7.409 0h-2.032v-9.6h-4.416v-2.032h10.864V19.4h-4.416V29Zm17.195 0h-6.736V17.368h6.736c3.28 0 5.664 2.32 5.664 5.696S285.196 29 281.916 29Zm-4.72-2.032h4.72c2.096 0 3.632-1.616 3.632-3.808 0-2.192-1.536-3.76-3.632-3.76h-4.72v7.568ZM302.272 29h-2.448l-1.744-2.928h-5.504l.96-1.648h3.568l-2.592-4.352-5.28 8.928h-2.32l6.688-11.136c.24-.4.544-.656.992-.656.448 0 .736.256.976.656L302.272 29Zm4.949 0h-2.032v-9.6h-4.416v-2.032h10.864V19.4h-4.416V29Zm18.144 0h-2.448l-1.744-2.928h-5.504l.96-1.648h3.568l-2.592-4.352-5.28 8.928h-2.32l6.688-11.136c.24-.4.544-.656.992-.656.448 0 .736.256.976.656L325.365 29Zm9.988 0h-8.752V17.368h8.512c2.272 0 3.776 1.024 3.776 3.008 0 1.472-.752 2.208-1.616 2.48 1.056.336 1.824 1.264 1.824 2.624 0 2.128-1.472 3.52-3.744 3.52Zm-.08-5.056h-5.168v-1.712h5.024c1.152 0 1.696-.4 1.696-1.408 0-1.232-.976-1.424-2.48-1.424h-5.712v7.584h5.888c1.456 0 2.512-.4 2.512-1.536 0-.96-.624-1.504-1.76-1.504ZM354.537 29h-2.448l-1.744-2.928h-5.504l.96-1.648h3.568l-2.592-4.352-5.28 8.928h-2.32l6.688-11.136c.24-.4.544-.656.992-.656.448 0 .736.256.976.656L354.537 29Zm9.972 0h-8.72v-2.032h8.72c1.088 0 1.696-.608 1.696-1.52 0-.992-.608-1.504-1.696-1.504h-5.344c-2.192 0-3.552-1.392-3.552-3.312 0-1.872 1.264-3.264 3.584-3.264h8.352V19.4h-8.352c-.928 0-1.472.544-1.472 1.424 0 .88.56 1.408 1.456 1.408h5.328c2.352 0 3.616 1.104 3.616 3.36 0 1.952-1.184 3.408-3.616 3.408Zm15.758 0h-10.4V17.368h10.384V19.4h-8.368v7.568h8.384V29Zm-.448-5.056h-6.448v-1.712h6.448v1.712Z"/>
            <path stroke="currentColor" stroke-width="2" d="M-10 28h147.343a4.002 4.002 0 0 0 2.829-1.172l24.656-24.656A4.003 4.003 0 0 1 167.657 1H685"/>
          </svg>
        </div>
        <div class="sus-db__suspects">
          <div
            v-for="suspect in suspects"
            :key="suspect.id"
            class="sus-db__suspects__suspect"
          >
            <img :src="game.getAsset('sasha')?.content">
            {{ suspect.name }}
          </div>
        </div>

        {{ game.database }}
      </div>
    </Transition>
    <button
      ref="btn"
      :class="['sus-db__expand-collapse-btn', {
        'sus-db__expand-collapse-btn--open': open
      }]" @click="open = !open">
      <VIcon class="sus-db__expand-collapse-btn__icon">mdi-chevron-up</VIcon>
      {{ open ? 'Einklappen' : 'Ausklappen' }}
      <VIcon class="sus-db__expand-collapse-btn__icon">mdi-chevron-up</VIcon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, useModel, watch } from 'vue';
import Timer from '../Timer.vue';
import { useSwipe } from '@vueuse/core';
import { suspects } from '@/assets/suspects';
import { useGameManager } from '@/store/gameManager';

const game = useGameManager()

const props = defineProps<{
  open?: boolean
}>();

const open = useModel(props, 'open');

const btn = ref<HTMLElement | null>(null);

const swipe = useSwipe(btn);

watch(swipe.direction, () => {
  if (swipe.direction.value === 'left') {
    open.value = false;
  } else if (swipe.direction.value === 'right') {
    open.value = true;
  }
});
</script>

<style lang="scss" scoped>
@import '@/scss/vars';

.sus-db {
  background: $surface;
  width: 25rem;
  height: 100%;
  border-right: 1px solid $stroke;
  position: relative;
  
  &__wrapper {
    position: relative;
    box-shadow: 0 0 10rem rgba(0, 0, 0, 0.5);
  }

  &__shapes {
    color: $stroke;
    opacity: .2;

    &__icon {
      position: absolute;
      bottom: 2rem;
      right: 12rem;
      font-size: 17rem;
    }

    &__text {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      font-size: 3.2rem;
      font-family: $fontDisplay;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .25rem .75rem;

    svg {
      position: absolute;
      left: 0;
      right: 0;
      top: 1.8rem;
      width: 100%;
      height: auto;
      color: $stroke;
    }
  }

  &__timer {
    z-index: 999;
    font-size: 2rem;
    font-weight: 300;
    mask-image: linear-gradient(black, rgba(0, 0, 0, 0.25));
  }

  &__expand-collapse-btn {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    cursor: pointer;
    padding: 0 .25rem 0 .25rem;
    height: max(25vh, 10rem);
    font-size: .8rem;
    // opacity: 0.5;
    text-orientation: sideways;
    writing-mode: vertical-rl;
    background: darken($surface, 3);
    border: 1px solid darken($stroke, 10);
    color: $stroke;
    border-left: none;
    border-radius: 0 .5rem .5rem 0;

    &::before {
      content: '';
      position: absolute;
      top: -50rem;
      left: -1rem;
      right: -1rem;
      bottom: -50rem;
    }

    &--open {
      .sus-db__expand-collapse-btn__icon {
        transform: scaleX(-1);
      }
    }
  }

  transform-origin: right;
  &-enter-active, &-leave-active {
    transition: margin-left .75s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &-enter-from, &-leave-to {
    margin-left: -400px;
  }
}
</style>