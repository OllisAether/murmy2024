<template>
  <div
    :class="['book', {
      'book--odd': currentPage % 2 === 0,
      'book--swiping': pageTransitionProgress !== 0,
      'book--swiping-next': pageTransitionProgress < 0,
      'book--swiping-prev': pageTransitionProgress > 0,
      'book--filter': filter,
    }]"
    :style="{
      '--progress': pageTransitionProgress,
      '--progress-abs': Math.abs(pageTransitionProgress),
      '--zoom-scale': zoomScale
    }"
  >
    <div class="book__pages">
      <template
        v-for="(page, i) in pages"
        :key="i"
      >
        <Transition
          @enter="(el, done) => enter(el, done, i)"
          @leave="(el, done) => leave(el, done, i)"
          :css="false"
        >
          <div
            :class="['book__page-wrapper', {
              'book__page-wrapper--odd': i % 2 === 0,
              'book__page-wrapper--current': i === currentPage,
            }]"
            v-if="Math.ceil(i / 2) === Math.ceil(currentPage / 2)"
          >
            <template v-if="pageComponents">
              <component :is="page" :pageNumber="i" />
            </template>
            <template v-else>
              <img
                :src="page?.content"
                class="book__page-wrapper__image"
              />
              <template
                v-for="(entry, index) in entries?.filter(e => (e.index !== undefined && e.index !== null) ? e.index === i : true)"
                :key="index"
              >
                <Collectable
                  class="book__collectable"
                  :highlight="isTutorialMarkEntry && i === 0"
                  v-if="(entry.entryId ?? entry.entry?.id) && currentPage === entry.index"
                  :entryId="(entry.entryId ?? entry.entry?.id)!"
                  :style="{
                    pointerEvents: tutorial.isTutorial && !(isTutorialMarkEntry && i === 0) ? 'none' : '',
                    'left': entry.rect.x * 100 + '%',
                    'top': entry.rect.y * 100 + '%',
                    'width': entry.rect.width * 100 + '%',
                    'height': entry.rect.height * 100 + '%',
                    transform: entry.rect.transform,
                  }"
                />
            </template>
            </template>
          </div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { Asset } from '../../../shared/asset';
import Collectable from '../Collectable.vue';
import { useTutorial } from '@/store/team/tutorial';
import { ImageEntry } from '../../../shared/clue';

const props = defineProps<{
  zoomScale: number,
  currentPage: number,
  pageTransitionProgress: number,
  pageComponents?: any[],
  pageAssets?: Asset[],
  filter?: boolean,
  entries?: ImageEntry[],
}>();

const pages = computed(() => props.pageComponents ?? props.pageAssets);

const enterDuration = 750;
const leaveDuration = 250;

function enter (el: Element, done: () => void, i: number) {
  if (Math.abs(i - props.currentPage) >= 1) {
    done();
    return;
  }

  const isOdd = props.currentPage % 2 === 0;

  (el as HTMLElement).style.opacity = '0';

  const timeout = setTimeout(() => {
    (el as HTMLElement).style.opacity = '';
  }, leaveDuration);

  const animation = el.animate([
    { transform: `perspective(10000px)rotateY(${isOdd ? '-90deg' : '90deg'})` },
    { transform: 'perspective(10000px)rotateY(0deg)' }
  ], {
    duration: enterDuration,
    delay: leaveDuration,
    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)',
    fill: 'both',
  })

  animation.addEventListener('finish', done);

  const unwatch = watch(() => props.currentPage, () => {
    if (Math.abs(i - props.currentPage) >= 1) {
      animation.cancel();
      (el as HTMLElement).style.opacity = '';
      clearTimeout(timeout);
      done();
      unwatch();
    }
  });

  animation.addEventListener('finish', () => {
    timeout && clearTimeout(timeout);
    (el as HTMLElement).style.opacity = '';
    unwatch();
    done();
  });
}

function leave (el: Element, done: () => void, i: number) {
  if (Math.abs(i - props.currentPage) > 1) {
    const unwatch = watch(() => props.currentPage, () => {
      if (Math.abs(i - props.currentPage) > 2) {
        clearTimeout(timeout);
        done();
        unwatch();
      }
    });

    const timeout = setTimeout(() => {
      unwatch();
      done();
    }, enterDuration + leaveDuration);
    return;
  }

  const isOdd = props.currentPage % 2 === 0;

  el.animate([
    { transform: 'perspective(10000px)rotateY(0deg)' },
    { transform: `perspective(10000px)rotateY(${isOdd ? '90deg' : '-90deg'})` }
  ], {
    duration: leaveDuration,
    easing: 'linear',
    fill: 'both',
  }).addEventListener('finish', done);
}

// #region Tutorial
const tutorial = useTutorial()
const isTutorialMarkEntry = computed(() => tutorial.state.action === 'markEntry');
// #endregion
</script>

<style lang="scss" scoped>
.book {
  &__collectable {
    position: absolute;
    pointer-events: all;
  }

  &__pages {
    position: relative;
    width: 200%;
    height: 100%;
    transform-origin: 0 0;
    will-change: transform;

    transition: transform 1s cubic-bezier(0.23, 1, 0.320, 1);

    .book--swiping.book--swiping-next:not(.book--odd) & {
      transition: none;
      transform: translateX(calc(var(--progress, 0) / var(--zoom-scale) * 100%));
    }
    .book--swiping.book--swiping-prev:not(.book--odd) & {
      transition: none;
      transform: translateX(calc(var(--progress, 0) / var(--zoom-scale) * 10%));
    }

    .book--odd.book--swiping.book--swiping-prev & {
      transition: none;
      transform: translateX(calc(var(--progress, 0) / var(--zoom-scale) * 100% - 50%));
    }
    .book--odd.book--swiping.book--swiping-next & {
      transition: none;
      transform: translateX(calc(var(--progress, 0) / var(--zoom-scale) * 10% - 50%));
    }

    .book--odd & {
      transform: translateX(-50%);
    }
  }

  &__page-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;

    left: 0;
    right: calc(50% - 2px);

    transform-origin: 100% center;

    transform-style: preserve-3d;
    transform: perspective(10000px);

    will-change: transform;
    .book--filter & {
      transition: filter .5s;
    }

    &--odd {
      transform-origin: 0 center;

      left: calc(50% - 2px);
      right: 0;
    }

    .book--swiping.book--filter & {
      transition: none;
    }

    $blur: 2px;
    $brightness: 0.8;
    .book--filter & {
      filter: brightness(calc(var(--progress-abs, 0) * 2 * (1 - $brightness) + $brightness))blur(calc((1 - var(--progress-abs, 0) * 2) * $blur));
    }

    .book--odd.book--swiping.book--swiping-next.book--filter &,
    .book--swiping.book--swiping-prev:not(.book--odd).book--filter & {
      filter: brightness($brightness)blur($blur);
    }

    &:not(.book__page-wrapper--current) {
      pointer-events: none;
    }

    &--current {
      z-index: 1;

      .book--filter & {
        filter: brightness(calc(1 - var(--progress-abs, 0) * 2 * (1 - $brightness)))blur(calc(var(--progress-abs, 0) * 2 * $blur));
      }
      .book--odd.book--swiping.book--swiping-next.book--filter &,
      .book--swiping.book--swiping-prev:not(.book--odd).book--filter & {
        filter: brightness(1)blur(0);
      }
    }
  }
}
</style>