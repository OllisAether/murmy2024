<template>
  <div class="sus-db__wrapper">
    <Transition name="sus-db">
      <div v-show="open" class="sus-db">
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
        <div class="sus-db__suspects" ref="suspectsScroller">
          <button
            v-for="suspect in suspects"
            :key="suspect.id"
            :class="['sus-db__suspect', {
              'sus-db__suspect--active': suspect.id === activeSuspect,
              'sus-db__suspect--generic': suspect.id === 'generic'
            }]"
            @click="activeSuspect = suspect.id ?? 'generic'"
            ref="suspectBtns"
          >
            <div class="sus-db__suspect__img">
              <SkewBox
                class="sus-db__suspect__img__skew"
                :img-height-scale="0.7"
                :img="suspect.imageAssetId ? game.getAsset(suspect.imageAssetId)?.content : true"
                :progress-color="suspect.color"
                :progress="suspect.id === activeSuspect ? 1 : 0"
              />

              <VIcon v-if="suspect.id === 'generic'">
                mdi-cards-playing
              </VIcon>
            </div>
            <div class="sus-db__suspect__name">
              <span>
                {{ suspect.name }}
              </span>
            </div>
          </button>
        </div>

        <div class="sus-db__entries" ref="entriesList">
          <template v-for="suspect in suspects">
            <Transition :name="'sus-db__entries__tab--' + suspectTransition">
              <div
                v-show="suspect.id === activeSuspect"
                class="sus-db__entries__tab"
                ref="entryTabs"
              >
                <TransitionGroup name="sus-db__entries__entry" @enter="enter" :css="false">
                  <DatabaseEntry
                    class="sus-db__entries__entry"
                    v-for="entry in delayedEntries[suspect.id] ?? []"
                    :key="entry.id"
                    :entry="entry"
                  />
                </TransitionGroup>

                <VFadeTransition>
                  <div v-if="delayedEntries[suspect.id]?.length === 0" class="sus-db__entries__no-entries">
                    <span>
                      Noch keine Hinweise markiert
                    </span>
                  </div>
                </VFadeTransition>
              </div>
            </Transition>
          </template>
        </div>
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

    <Teleport to="body">
      <VFadeTransition>
        <div
          v-if="draggedEntry"
          class="entry-drag"
          :style="{
            top: entryDrag.dragPos.y + 'px',
            left: entryDrag.dragPos.x + 'px'
          }"
        >
          <img
            class="entry-drag__img"
            v-if="draggedEntry.imageAssetId"
            :src="game.getAsset(draggedEntry.imageAssetId)?.content"
          />
          <div class="entry-drag__content">
            <div class="entry-drag__suspect">
              {{ suspects.find(suspect => suspect.id === draggedEntry?.suspectId)?.name ?? 'Allgemein' }}
            </div>
            <div class="entry-drag__title">
              <TextContentRenderer :text-content="draggedEntry.title" />
            </div>
          </div>
        </div>
      </VFadeTransition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useModel, watch } from 'vue';
import Timer from '../Timer.vue';
import { useSwipe } from '@vueuse/core';
import { suspects as allSuspects } from '../../../shared/assets/suspects';
import { useGameManager } from '@/store/gameManager';
import DatabaseEntry from './DatabaseEntry.vue';
import SkewBox from '../SkewBox.vue';
import { Entry } from '../../../shared/suspectDatabase/entry';
import { Suspect } from '../../../shared/suspectDatabase/suspect';
import { useEntryDrag } from '@/store/team/entryDrag';
import TextContentRenderer from './TextContentRenderer.vue';

const game = useGameManager()
const entryDrag = useEntryDrag()

const draggedEntry = computed(() => {
  if (!entryDrag.isDragging) return;

  return game.allEntries.find(entry => entry.id === entryDrag.draggedEntry);
});

const props = defineProps<{
  open?: boolean
}>();

const open = useModel(props, 'open');

const btn = ref<HTMLElement | null>(null);

const swipe = useSwipe(btn, {
  threshold: 50,
  passive: false,
  onSwipeEnd: () => {
    if (swipe.direction.value === 'left') {
      open.value = false;
    } else if (swipe.direction.value === 'right') {
      open.value = true;
    }
  }
});

const suspects = computed<(Suspect & {
  imageAssetId?: string | undefined
})[]>(() => {
  const suspects: (Suspect & {
    imageAssetId?: string | undefined
  })[] = [
    {
      id: 'generic',
      name: 'Allgemein',
      color: '#bdd1d2',
    },
  ]

  Object.keys(entries.value).forEach((suspectId) => {
    const suspect = allSuspects.find(suspect => suspect.id === suspectId);

    if (suspect) {
      suspects.push(suspect);
    }
  });

  return suspects;
});

const entries = computed(() => {
  const suspectEntries: Record<string, Entry[]> = {
    generic: [],
  };

  const entries = game.database.entries
    .map(entry => game.allEntries.find(e => e.id === entry))
    .filter(e => e) as Entry[];

  for (const entry of entries) {
    let id = entry.suspectId;

    if (!id || allSuspects.every(suspect => suspect.id !== id)) {
      id = 'generic';
    }

    if (!suspectEntries[id]) {
      suspectEntries[id] = [];
    }

    suspectEntries[id].push(entry);
  }

  for (const suspectId in suspectEntries) {
    suspectEntries[suspectId].reverse();
  }

  return suspectEntries;
});

watch(entries, (entries, oldEntries) => {
  const flatEntries = Object.values(entries).flat();
  const flatOldEntries = Object.values(oldEntries).flat();

  const newEntries = flatEntries.filter(entry => !flatOldEntries.map(e => e.id).includes(entry.id));

  if (newEntries.length === 1) {
    const suspect = suspects.value.find(suspect => suspect.id === newEntries[0].suspectId)?.id ?? 'generic';

    activeSuspect.value = suspect;
    
    const suspectIndex = suspects.value.findIndex(s => s.id === suspect);

    setTimeout(() => {
      entryTabs.value[suspectIndex]?.scrollTo({
        behavior: 'smooth',
        top: 0,
      });
    })
  }

  setTimeout(() => {
    delayedEntries.value = entries;
  }, 400);
}, { deep: true });

const delayedEntries = ref(entries.value);

watch(swipe.direction, () => {
  if (swipe.direction.value === 'left') {
    open.value = false;
  } else if (swipe.direction.value === 'right') {
    open.value = true;
  }
});

const entriesList = ref<HTMLElement | null>(null);

const entriesSwipe = useSwipe(entriesList, {
  threshold: 50
});

watch(entriesSwipe.direction, () => {
  if (entryDrag.isDragging) return;

  const index = suspects.value.findIndex(suspect => suspect.id === activeSuspect.value);

  if (entriesSwipe.direction.value === 'left') {
    const next = suspects.value[index + 1];

    if (!next) return;

    activeSuspect.value = next.id;
  } else if (entriesSwipe.direction.value === 'right') {
    const prev = suspects.value[index - 1];

    if (!prev) return;

    activeSuspect.value = prev.id;
  }
});

const suspectTransition = ref<'right' | 'left'>('right');
const activeSuspect = ref<string>('generic');

const suspectBtns = ref<HTMLElement[]>([]);
const entryTabs = ref<HTMLElement[]>([]);

const suspectsScroller = ref<HTMLElement | null>(null);

let animationFrame: number | undefined;
watch(activeSuspect, (val, old) => {
  const indexNew = suspects.value.findIndex(suspect => suspect.id === val);
  const indexOld = suspects.value.findIndex(suspect => suspect.id === old);

  if (indexNew > indexOld) {
    suspectTransition.value = 'right';
  } else {
    suspectTransition.value = 'left';
  }

  setTimeout(() => {
    stopAnimation();

    suspectsScroller.value?.addEventListener('wheel', stopAnimation);
    suspectsScroller.value?.addEventListener('pointerdown', stopAnimation);

    const left = suspectBtns.value[indexNew]?.offsetLeft - (suspectsScroller.value?.clientWidth ?? 0) / 2 + suspectBtns.value[indexNew]?.clientWidth / 2
    const leftStart = suspectsScroller.value?.scrollLeft ?? 0;

    const start = Date.now();
    const duration = 1000;
    // exponential Ease out
    const easing = (t: number) => 1 - Math.pow(2, -10 * t);
    step();

    function step () {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const x = easing(progress) * (left - leftStart) + leftStart;

      if (suspectsScroller.value) {
        suspectsScroller.value.scrollLeft = x;
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    }

    function stopAnimation() {
      suspectsScroller.value?.removeEventListener('wheel', stopAnimation);
      suspectsScroller.value?.removeEventListener('pointerdown', stopAnimation);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    }
  });
})
watch(suspects, (val) => {
  if (!val.some(suspect => suspect.id === activeSuspect.value)) {
    activeSuspect.value = 'generic';
  };
}, { deep: true });

function enter(el: Element, done: () => void) {
  const height = el.clientHeight;

  el.classList.add('sus-db__entries__entry--enter-active');
  (el as HTMLElement).style.zIndex = '1';
  requestAnimationFrame(() => {
    el.classList.remove('sus-db__entries__entry--enter-active');
  });

  const animation = el.animate([
    {
      marginBottom: -height + 'px',
      transform: 'translateX(100%)',
      opacity: 0,
      easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    },
    {
      transform: 'translateX(100%)',
      opacity: 0,
      easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
      offset: 0.2,
    },
    {
      opacity: 1,
      transform: 'translateX(0)'
    },
  ], {
    duration: 1000,
  })

  animation.addEventListener('finish', () => {
    (el as HTMLElement).style.zIndex = '';
    done();
  });
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;
@use 'sass:math';

.sus-db {
  background: $surface;
  width: 25rem;
  height: 100%;
  border-right: 1px solid $stroke;
  position: relative;

  display: flex;
  flex-direction: column;

  &__wrapper {
    position: relative;
    box-shadow: 0 0 2rem rgba(0, 0, 0, .5);
  }

  &__shapes {
    color: $stroke;
    opacity: .2;

    &__icon {
      z-index: 0;
      position: absolute;
      bottom: 2rem;
      right: 12rem;
      font-size: 17rem;
    }

    &__text {
      z-index: 0;
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
      left: -.5rem;
      right: -.5rem;
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

  &__suspects {
    z-index: 1;
    overflow-y: auto;
    display: flex;
    padding: .5rem calc(50% - 7rem / 2) 1rem;
    gap: 1rem;
  }

  &__suspect {
    width: 7rem;
    display: flex;
    flex-direction: column;
    font-family: $fontHeading;

    &--active {
      .sus-db__suspect__name {
        color: white;

        &::before {
          background: #f44;
        }
      }

      .sus-db__suspect__img .v-icon {
        transform: translate(-50%, -50%)scale(1.2)translateY(-.25rem);
        color: #fff;
      }
    }

    &__img {
      flex: 0 0 auto;
      position: relative;
      width: 7rem;
      height: 7rem * math.div(5, 3);
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

  &__entries {
    z-index: 1;
    flex: 1 1 auto;
    height: 0;
    position: relative;
    overflow: hidden;

    &__tab {
      position: absolute;
      inset: 0;
      overflow-y: auto;
      padding-bottom: 2rem;
      padding-top: 1rem;

      &--left {
        &-enter-active, &-leave-active {
          transition: transform .75s cubic-bezier(0.19, 1, 0.22, 1);
        }

        &-enter-from {
          transform: translateX(-100%);
        }
        &-leave-to {
          transform: translateX(100%);
        }
      }

      &--right {
        &-enter-active, &-leave-active {
          transition: transform .75s cubic-bezier(0.19, 1, 0.22, 1);
        }

        &-enter-from {
          transform: translateX(100%);
        }
        &-leave-to {
          transform: translateX(-100%);
        }
      }
    }

    &__no-entries {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.5rem 1rem;
      color: #fff8;

      border-radius: 1rem;
      margin: 0 1rem;

      background: #BCD1F111;
      border: 2px dashed #fff1;

      & > span {
        mask-image: linear-gradient(black, #0008);
      }
    }

    &__entry {
      transition:
        opacity .2s,
        border-color 2s cubic-bezier(0.445, 0.05, 0.55, 0.95),
        box-shadow 2s cubic-bezier(0.445, 0.05, 0.55, 0.95);

      &--enter-active {
        transition: opacity .2s;

        $neon1: #00ff7b;
        $neon2: #00b7ff;
        
        border-color: #fff;
        box-shadow:
          inset 0 0 1rem #fff,
          
          inset .2rem 0 .5rem $neon1,
          inset -.2rem 0 .5rem $neon2,
          
          inset 1rem 0 2rem -.5rem $neon1,
          inset -1rem 0 2rem -.5rem $neon2,
          
          0 0 1.5rem #fff,
          -.5rem 0 1rem $neon1,
          .5rem 0 1rem $neon2,
          0 0 3rem 1rem #000;
      }
    }
  }

}

.entry-drag {
  position: fixed;
  z-index: 9999;

  background: #303439cf;
  border-radius: 1rem;
  
  transform: translate(-50%, -100%)translateY(-.5rem);
  font-size: .8rem;
  color: #fff;

  -webkit-backdrop-filter: blur(1rem);
  backdrop-filter: blur(1rem);
  box-shadow: 0 0 1rem rgba(0, 0, 0, .5),
              0 0 0 1px #fff2 inset;

  display: flex;
  align-items: stretch;
  padding: .5rem;
  height: min-content;

  &__content {
    padding: .5rem;
  }

  &__suspect {
    color: #fff8;
  }

  &__title {
    font-weight: 600;
    font-size: 1rem;
    font-family: $fontHeading;
  }

  &__img {
    display: block;
    pointer-events: none;
    height: 100%;
    width: auto;
    height: auto;
    max-width: 5rem;
    max-height: 5rem;
    object-fit: cover;
    border-radius: .5rem;
    margin-right: .5rem;
  }
}
</style>