<template>
  <div class="phone">
    <div class="phone__screen">
      <div class="phone__statusbar">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="5" height="9" fill="none" viewBox="0 0 5 9">
            <path fill="currentColor" d="M5 8.5H0v-7h1.5v-1h2v1H5v7Z"/>
          </svg>
          {{ clock }}
        </div>
      </div>

      <div class="phone__content">
        <Transition name="phone__content__lockscreen">
          <PhoneLockScreen class="phone__content__lockscreen" v-if="phone.locked" :clock="clock" />
        </Transition>

        <div class="phone__content__main" v-if="!phone.locked">
          <HomeScreen v-if="phone.currentApp === 'home'" />
        </div>
      </div>

      <VFadeTransition>
        <div class="phone__navbar" v-if="!phone.locked">
          <button
            class="phone__navbar__button phone__navbar__button--home"
            @click="phone.backBtn()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" fill="none" viewBox="0 0 18 12">
              <path stroke="currentColor" d="M4.5 1.5 1 5l3.5 3.5"/>
              <path stroke="currentColor" d="M1 5h13.5a2.5 2.5 0 0 1 0 5h-6"/>
            </svg>
          </button>
          <button
            class="phone__navbar__button phone__navbar__button--home"
            @click="phone.homeBtn()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" fill="none" viewBox="0 0 18 12">
              <path stroke="currentColor" d="M17.5 10H.5V4.5L9 1l8.5 3.5V10Z"/>
            </svg>
          </button>
          <button
            class="phone__navbar__button phone__navbar__button--menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" fill="none" viewBox="0 0 18 12">
              <path stroke="currentColor" d="M5 2.5h12.5V8m-16 2V5h13v5h-13Z"/>
            </svg>
          </button>
        </div>
      </VFadeTransition>
    </div>

    <img :src="game.getAsset('Phone.png')?.content" class="phone__image">
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { usePhone } from '@/store/team/phone';
import moment from 'moment';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import PhoneLockScreen from './PhoneLockScreen.vue';
import HomeScreen from './home/HomeScreen.vue';

const game = useGameManager();
const phone = usePhone();

const clock = ref(moment().format('HH:mm'));

onMounted(() => {
  const interval = setInterval(() => {
    clock.value = moment().format('HH:mm');
  }, 1000);

  onBeforeUnmount(() => {
    clearInterval(interval);
  });
});
</script>

<style lang="scss" scoped>
.phone {
  position: relative;
  width: 213px;
  height: 418px;

  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;

  &__image {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__screen {
    pointer-events: all;
    position: absolute;
    top: 53px;
    left: 16px;
    width: 180px;
    height: 320px;
    background: black;

    display: flex;
    flex-direction: column;
  }

  &__statusbar {
    height: 12px;
    background: linear-gradient(#242424, #000000);
    font-size: 8px;
    color: white;

    & > div {
      display: flex;
      align-items: center;
      justify-content: right;
      gap: 3px;
      padding: 0 3px;

      mask-image: linear-gradient(transparent, white 40%, transparent);
    }
  }

  &__content {
    position: relative;
    flex: 1;
    background: black;
    overflow: hidden;

    &__lockscreen {
      position: absolute;
      inset: 0;

      &-leave-active {
        transition: transform 0.3s ease, opacity 0.3s;
        z-index: 1;
      }

      &-leave-to {
        opacity: 0;
        transform: scale(1.5);
      }
    }

    &__main {
      position: absolute;
      inset: 0;

      & > * {
        position: absolute;
        inset: 0;
      }
    }
  }

  &__navbar {
    display: flex;
    justify-content: space-between;
    height: 20px;
    background: #000;

    &__button {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      padding: 0;
      height: 100%;
      color: #888;

      &:active {
        background: radial-gradient(#fff3 50%, transparent 50%);
        background-size: 80px 80px;
        background-position: center;
        background-repeat: no-repeat;
      }

      &--menu {
        pointer-events: none;
      }
    }

    &-enter-active, &-leave-active {
      transition: opacity 0.3s;
    }

    &-enter-to, &-leave-to {
      opacity: 0;
    }
  }
}
</style>