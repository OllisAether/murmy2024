<template>
  <div
    :class="['diary', {
      'diary--odd': currentPage % 2 === 0,
      'diary--swiping': pageTransitionProgress !== 0,
      'diary--swiping-next': pageTransitionProgress < 0,
      'diary--swiping-prev': pageTransitionProgress > 0,
      'diary--locked': diary.locked,
    }]"
    :style="{
      '--progress': pageTransitionProgress,
      '--progress-abs': Math.abs(pageTransitionProgress),
      '--zoom-scale': zoomScale
    }"
  >
    <div class="diary__pages">
      <template
        v-for="(page, i) in diary.locked ? [Cover, BackCover] : pages"
        :key="i"
      >
        <Transition
          @enter="(el, done) => enter(el, done, i)"
          @leave="(el, done) => leave(el, done, i)"
          :css="false"
        >
          <div
            :class="['diary__page-wrapper', {
              'diary__page-wrapper--odd': i % 2 === 0,
              'diary__page-wrapper--current': i === currentPage,
            }]"
            v-if="Math.ceil(i / 2) === Math.ceil(currentPage / 2)"
          >
            <component :is="page" :pageNumber="i" />
          </div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Transition, watch } from 'vue';
import { pages } from './pages';
import Cover from './pages/Cover.vue';
import BackCover from './pages/BackCover.vue';
import { useMainClue } from '@/store/team/mainClue';

const diary = useMainClue();

const props = defineProps<{
  zoomScale: number,
  currentPage: number,
  pageTransitionProgress: number,
}>();

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
    { transform: `perspective(5000px)rotateY(${isOdd ? '-90deg' : '90deg'})` },
    { transform: 'perspective(5000px)rotateY(0deg)' }
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
    { transform: 'perspective(5000px)rotateY(0deg)' },
    { transform: `perspective(5000px)rotateY(${isOdd ? '90deg' : '-90deg'})` }
  ], {
    duration: leaveDuration,
    easing: 'linear',
    fill: 'both',
  }).addEventListener('finish', done);
}
</script>

<style lang="scss" scoped>
.diary {
  width: 455px * 2;
  height: 588px * 2;
  pointer-events: all;

  &__pages {
    position: relative;
    width: 200%;
    height: 100%;
    transform-origin: 0 0;
    will-change: transform;

    transition: transform 1s cubic-bezier(0.23, 1, 0.320, 1);

    .diary--swiping.diary--swiping-next:not(.diary--odd) & {
      transition: none;
      transform: translateX(calc(var(--progress, 0) / var(--zoom-scale) * 100%));
    }
    .diary--swiping.diary--swiping-prev:not(.diary--odd) & {
      transition: none;
      transform: translateX(calc(var(--progress, 0) / var(--zoom-scale) * 10%));
    }

    .diary--odd.diary--swiping.diary--swiping-prev & {
      transition: none;
      transform: translateX(calc(var(--progress, 0) / var(--zoom-scale) * 100% - 50%));
    }
    .diary--odd.diary--swiping.diary--swiping-next & {
      transition: none;
      transform: translateX(calc(var(--progress, 0) / var(--zoom-scale) * 10% - 50%));
    }

    .diary--odd & {
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
    transform: perspective(5000px);

    will-change: transform;
    .diary:not(.diary--locked) & {
      transition: filter .5s;
    }

    &--odd {
      transform-origin: 0 center;

      left: calc(50% - 2px);
      right: 0;
    }

    .diary--swiping:not(.diary--locked) & {
      transition: none;
    }

    $blur: 2px;
    $brightness: 0.8;
    .diary:not(.diary--locked) & {
      filter: brightness(calc(var(--progress-abs, 0) * 2 * (1 - $brightness) + $brightness))blur(calc((1 - var(--progress-abs, 0) * 2) * $blur));
    }

    .diary--odd.diary--swiping.diary--swiping-next:not(.diary--locked) &,
    .diary--swiping.diary--swiping-prev:not(.diary--odd):not(.diary--locked) & {
      filter: brightness($brightness)blur($blur);
    }

    &--current {
      z-index: 1;

      .diary:not(.diary--locked) & {
        filter: brightness(calc(1 - var(--progress-abs, 0) * 2 * (1 - $brightness)))blur(calc(var(--progress-abs, 0) * 2 * $blur));
      }
      .diary--odd.diary--swiping.diary--swiping-next:not(.diary--locked) &,
      .diary--swiping.diary--swiping-prev:not(.diary--odd):not(.diary--locked) & {
        filter: brightness(1)blur(0);
      }
    }
  }
}
</style>