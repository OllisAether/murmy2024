<template>
  <ScrollView class="history-screen">
    <div class="history-screen__list">
      <div
        class="history-screen__list__item"
        v-for="(call, i) in calls"
        :key="i"
      >
        <div class="history-screen__list__item__info">
          <div class="history-screen__list__item__caller">
            {{ contacts.find(c => c.number === call.number)?.name ?? call.number }}
          </div>
          <div class="history-screen__list__item__time">
            {{ call.timestamp.format('DD. MMM, HH:mm') }}
          </div>
        </div>

        <div class="history-screen__list__item__type-duration">
          <div :class="[
            'history-screen__list__item__type',
            'history-screen__list__item__type--' + call.type
          ]">
            <VIcon v-if="call.type === 'answered'">mdi-phone-incoming</VIcon>
            <VIcon v-else-if="call.type === 'missed'">mdi-phone-missed</VIcon>
            <VIcon v-else>mdi-phone-outgoing</VIcon>
          </div>
          <div v-if="['answered', 'outgoing'].includes(call.type)" class="history-screen__list__item__duration">
            {{ call.duration ?? '--:--' }}
          </div>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script setup lang="ts">
import { contacts } from '../../../../../shared/assets/phone/contacts';
import ScrollView from '../ScrollView.vue';
import { calls } from '@/../shared/assets/phone/calls';
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.history-screen {
  height: 100%;

  &__list {
    display: flex;
    flex-direction: column;
    padding-bottom: 50%;

    &__item {
      display: flex;
      align-items: center;
      padding: 5px * $scale 5px * $scale 5px * $scale 10px * $scale;
      border-bottom: 1px * $scale solid #fff2;
      line-height: 1;

      &__info {
        flex: 1;
      }

      &__type-duration {
        width: 25px * $scale;
      }

      &__caller {
        font-size: 10px * $scale;
        margin-bottom: 2px * $scale;
      }

      &__time {
        color: #aaa;
        font-size: 8px * $scale;
      }

      &__type {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        font-size: 8px * $scale;

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
        font-size: 8px * $scale;
        color: #aaa;
        text-align: center;
      }
    }
  }
}
</style>