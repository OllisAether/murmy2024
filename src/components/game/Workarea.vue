<template>
  <div class="workarea">
    <div
      :class="['workarea__phone',
        {
          'workarea__phone--active': route.params.space === 'phone',
        }
      ]"
    >
      <div class="workarea__phone__content" ref="phone">
        <div class="workarea__phone__content__screen" :style="{
          transform: `scale(${screenScale})`,
          height: `${screenHeight}px`
        }">
          <RouterView class="workarea__phone__content__screen__app" />
        </div>

        <div class="workarea__phone__content__status-bar">
          <div class="workarea__phone__content__status-bar__clock">
            {{ time }}
          </div>
          <IPhoneIndicators class="workarea__phone__content__status-bar__indicators" />
        </div>

        <div class="workarea__phone__content__nav"></div>
      </div>
      <IPhone class="workarea__phone__svg" />
    </div>

    <Transition name="workarea__interface">
      <div
        v-if="active === 'files' || active === 'tools'"
        class="workarea__interface"
      >
        <Transition name="workarea__interface__files">
          <FilesPage class="workarea__interface__page" v-if="active === 'files'" />
        </Transition>
        <Transition name="workarea__interface__tools">
          <ToolsPage class="workarea__interface__page" v-if="active === 'tools'" />
        </Transition>
      </div>
    </Transition>

    <AppNav
      @change="change"
      :active="active"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppNav from './AppNav.vue'
import IPhone from '../../assets/IPhone.svg'
import { useEventListener } from '@vueuse/core';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import router from '../../router';
import FilesPage from './files/FilesPage.vue';
import ToolsPage from './tools/ToolsPage.vue';
import IPhoneIndicators from '../../assets/IPhoneIndicators.svg';

const route = useRoute()
const active = computed(() => {
  switch (route.name) {
    case 'workspace':
      return route.params.space as string
    case 'chat':
    case 'chatRoom':
      return 'chat'
    case 'search':
      return 'search'
    case 'mail':
      return 'mail'
  }

  return 'files'
})

const lastPhonePage = ref('off')

onBeforeRouteUpdate((_, __, next) => {
  if ([ 'files', 'tools' ].includes(active.value)) {
    lastPhonePage.value = active.value
  }
  next()
})

function change (name: string) {
  switch (name) {
    case 'files':
      router.push({ name: 'workspace', params: { space: 'files' } })
      break
    case 'chat':
      router.push({ name: 'chat', params: { space: 'phone' } })
      break
    case 'search':
      router.push({ name: 'search', params: { space: 'phone' } })
      break
    case 'mail':
      router.push({ name: 'mail', params: { space: 'phone' } })
      break
    case 'tools':
      router.push({ name: 'workspace', params: { space: 'tools' } })
      break
  }
}

const time = ref('00:00')

function updateTime () {
  const date = new Date()
  time.value = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

onMounted(() => {

  updateTime()
  const interval = setInterval(updateTime, 1000)

  return () => clearInterval(interval)
})

const phone = ref<HTMLElement | null>(null)
const screenScale = ref(1)
const screenHeight = ref(902)
useEventListener('resize', () => {
  setScreen()
})

function setScreen () {
  if (!phone.value) return
  const phoneWidth = phone.value.clientWidth
  const phoneHeight = phone.value.clientHeight
  screenScale.value = phoneWidth / 380
  screenHeight.value = 380 * phoneHeight / phoneWidth
}
onMounted(setScreen)
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.workarea {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding-right: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;

  transition: background 2s cubic-bezier(0.19, 1, 0.22, 1);

  &__phone {
    position: absolute;
    top: 49%;
    left: 0;
    translate: -30%;
    transform: translate(-50%, -50%)translateX(-3rem)scale(1);
    height: min(100vw, 90vh);
    aspect-ratio: 440 / 902;
    filter: blur(0.5rem);
    opacity: 0.5;
    container-type: size;

    will-change: translate, opacity, left, filter;
    transition:
      left 1s cubic-bezier(0.19, 1, 0.22, 1),
      transform 1s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 1s cubic-bezier(0.19, 1, 0.22, 1);

    @media screen and (max-width: 768px) {
      top: calc(50% - 2.5rem);
      height: min(180vw, calc(100% - 10rem));
    }

    &--active {
      left: 50%;
      translate: 0;
      filter: blur(0);
      opacity: 1;

      @media screen and (max-width: 768px) {
        transform: translate(-50%, -50%)scale(1);
      }

      .workarea__phone__content {
        pointer-events: all;
        opacity: 1;
      }
    }

    &__svg {
      display: block;
      position: relative;
      z-index: 1;
      height: 100%;
      pointer-events: none;
    }

    &__content {
      position: absolute;
      inset: 1.6% 4%;
      border-radius: 14cqw;
      background: white;
      color: black;
      overflow: hidden;
      pointer-events: none;
      font-size: 4cqw;
      opacity: 0;

      transition: opacity .2s;

      &__status-bar {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 14cqw;
        color: white;
        mix-blend-mode: difference;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2% 9% 0 11%;

        &__clock {
          font-family: $fontPhoneDisplay, sans-serif;
          font-size: 1em;
          font-weight: bold;
        }

        &__indicators {
          width: 23%;
        }
      }

      &__screen {
        position: absolute;
        inset: 0;
        transform-origin: top left;
        width: 380px;

        &__app {
          // position: absolute;
          // inset: 0;
          // overflow: hidden;
          // border-radius: 14cqw;
        }
      }

      &__nav {
        position: absolute;
        bottom: 0.75cqh;
        width: 40%;
        left: 30%;
        height: 0.6cqh;
        border-radius: 0.375cqh;
        -webkit-backdrop-filter: blur(10rem)invert(0.9);
        backdrop-filter: blur(10rem)invert(0.9);
      }
    }
  }

  &__interface {
    position: absolute;
    inset: 0;

    &__layout {
      height: 100%;
    }

    &__page {
      position: absolute;
      inset: 0;
      padding: 5rem 10rem 5rem 7rem;
      overflow-y: auto;

      @media screen and (max-width: 768px) {
        padding: 5rem 2rem 7rem 2rem;
      }
    }

    &-enter-active, &-leave-active {
      transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1), opacity .5s;
    }

    &-enter-from {
      transform: translateX(100%);
      opacity: 0;
    }

    &-leave-to {
      transform: translateX(150%);
      opacity: 0;
    }

    &__files {
      &-enter-active, &-leave-active {
        transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
      }

      &-enter-from, &-leave-to {
        transform: translateX(100%);
      }
    }

    &__tools {
      &-enter-active, &-leave-active {
        transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
      }

      &-enter-from, &-leave-to {
        transform: translateX(-100%);
      }
    }
  }
}
</style>