<template>
  <ScrollView class="calls-app-history">
    <div class="calls-app-history__list">
      <div
        class="calls-app-history__list__item"
        v-for="(call, i) in calls"
        :key="i"
      >
        <div class="calls-app-history__list__item__name">{{ call.caller }}</div>
        <div class="calls-app-history__list__item__number">{{ call.number }}</div>
        <div class="calls-app-history__list__item__time">{{ call.timestamp }}</div>
        
        <div :class="[
          'calls-app-history__list__item__type',
          'calls-app-history__list__item__type--' + call.type
        ]">
          <VIcon v-if="call.type === 'answered'">mdi-phone-incoming</VIcon>
          <VIcon v-else-if="call.type === 'missed'">mdi-phone-missed</VIcon>
          <VIcon v-else>mdi-phone-outgoing</VIcon>
        </div>
        <div class="calls-app-history__list__item__duration">{{ call.duration ?? '--:--' }}</div>
      </div>
    </div>
  </ScrollView>
</template>

<script setup lang="ts">
import ScrollView from '../ScrollView.vue';
import { calls } from '@/../shared/assets/phone/calls';
</script>

<style lang="scss" scoped>
.calls-app-history {
  height: 100%;

  &__list {
    display: flex;
    flex-direction: column;

    &__item {
      display: grid;
      grid-template-columns: 1fr 20px;
      grid-template-rows: repeat(2, auto);
      padding: 5px 10px;
      border-bottom: 1px solid #fff2;
      color: white;
      line-height: 1.2;

      &__number {
        color: #aaa;
        font-size: 10px;
      }

      &__time {
        color: #aaa;
        font-size: 8px;
      }

      &__type {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        font-size: 8px;

        grid-column: 2 / 3;
        grid-row: 1 / 3;

        &--answered {
          color: #4dccff;
        }

        &--missed {
          color: #888;
        }

        &--outgoing {
          color: #4dccff;
        }
        &--rejected {
          color: #888;
        }
      }

      &__duration {
        grid-column: 2 / 3;
        grid-row: 3 / 4;
        font-size: 8px;
        color: #aaa;
        text-align: center;
      }
    }
  }
}
</style>