<template>
  <div class="clock-app">
    <ScrollView class="clock-app__content">
      <div class="clock-app__time">{{ phone.clock }}</div>
      <div class="clock-app__date">{{ phone.date }}</div>

      <div class="clock-app__alarm">
        <div class="clock-app__alarm__title">
          <VIcon size="1em" class="mr-1">mdi-alarm</VIcon>
          Wecker
        </div>

        <div class="clock-app__alarm__alarm">
          06:00

          <div class="clock-app__alarm__alarm__repeat">
            Mo, Di, Mi, Do, Fr
          </div>
        </div>
        <div class="clock-app__alarm__alarm">
          06:10

          <div class="clock-app__alarm__alarm__repeat">
            Mo, Di, Mi, Do, Fr
          </div>
        </div>
        <div class="clock-app__alarm__alarm">
          06:20

          <div class="clock-app__alarm__alarm__repeat">
            Mo, Di, Mi, Do, Fr
          </div>
        </div>
        <div class="clock-app__alarm__alarm">
          06:25

          <div class="clock-app__alarm__alarm__repeat">
            Mo, Di, Mi, Do, Fr
          </div>
        </div>
        <div class="clock-app__alarm__alarm">
          06:30

          <div class="clock-app__alarm__alarm__repeat">
            Mo, Di, Mi, Do, Fr
          </div>
        </div>
      </div>
    </ScrollView>
  </div>
</template>

<script setup lang="ts">
import { useMainClue } from '@/store/team/mainClue';
import ScrollView from '../ScrollView.vue';

const phone = useMainClue();
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.clock-app {
  background: linear-gradient(#000000, #161616);

  &__content {
    height: 100%;
  }

  &__time {
    margin-top: 20px * $scale;
    font-size: 48px * $scale;
    line-height: 1;
    text-align: center;
  }

  &__date {
    font-size: 8px * $scale;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    margin-bottom: 20px * $scale;
    text-transform: uppercase;
  }

  &__alarm {
    padding-bottom: 50px * $scale;

    &__title {
      padding: 10px * $scale 10px * $scale 5px * $scale;
      font-size: 12px * $scale;
      border-bottom: 1px * $scale solid #fff2;
    }

    &__alarm {
      padding: 5px * $scale 10px * $scale;
      font-size: 10px * $scale;
      border-bottom: 1px * $scale solid #fff1;

      &__repeat {
        font-size: 8px * $scale;
        color: #888;
      }
    }
  }
}
</style>