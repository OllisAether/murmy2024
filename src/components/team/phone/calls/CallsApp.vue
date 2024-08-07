<template>
  <div class="calls-app">
    <div class="calls-app__tabs">
      <button :class="['calls-app__tabs__tab', {
        'calls-app__tabs__tab--active': phone.isPath(),
      }]" @click="phone.setPath()">
        <VIcon>mdi-phone</VIcon>
      </button>
      <button :class="['calls-app__tabs__tab', {
        'calls-app__tabs__tab--active': phone.isPath('history'),
      }]" @click="phone.setPath('history')">
        <VIcon>mdi-clock-outline</VIcon>
      </button>
      <button :class="['calls-app__tabs__tab', {
        'calls-app__tabs__tab--active': phone.isPath('contacts'),
      }]" @click="phone.setPath('contacts')">
        <VIcon>mdi-account</VIcon>
      </button>
    </div>
    <div class="calls-app__content">
      <ContactsScreen v-if="phone.isPath('contacts')" />
      <HistoryScreen v-else-if="phone.isPath('history')" />
      <NumpadScreen v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePhone } from '@/store/team/phone';
import ContactsScreen from './ContactsScreen.vue';
import HistoryScreen from './HistoryScreen.vue';
import NumpadScreen from './NumpadScreen.vue';

const phone = usePhone();
</script>

<style lang="scss" scoped>
.calls-app {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__tabs {
    background: linear-gradient(#000, #0f1416);
    display: flex;
    border-bottom: 1px solid #fff2;
  }

  &__tabs__tab {
    flex: 1;
    display: block;
    padding: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 10px;

    &--active {
      padding-bottom: 3px;
      border-bottom: 2px solid #4dccff;
    }
  }

  &__content {
    height: 0;
    flex: 1 1 auto;
    background: linear-gradient(#061217, #1f3841);
    position: relative;
  }
}
</style>