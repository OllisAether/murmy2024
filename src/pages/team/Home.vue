<template>
  <ScreenWrapper class="home">
    <div class="home__teamname">
      {{ auth.team?.name }}
    </div>

    <template v-if="game.phase.meta.info">
      <div class="home__carousel">
        <!-- <SkewBox class="home__carousel__skew-box" :skew="0" /> -->

        <Carousel>
          <CarouselItem>
            <template #banner>
              <VIcon>mdi-information</VIcon>
            </template>
            <template #title>
              Infos vor dem Beginn
            </template>

            <p>
              Bitte beachtet die folgenden Informationen, bevor wir mit dem Spiel beginnen.
            </p>
          </CarouselItem>

          <CarouselItem>
            <template #banner>
              📱👉🗑️
            </template>
            <template #title>
              Weg mit den Ablenkungen
            </template>

            <p>
              Bitte legt alle Ablenkungen beiseite und konzentriert euch auf das Spiel.
            </p>
            <p>
              Stellt sicher, dass eure <b class="text-primary">Handys auf lautlos</b> gestellt sind.
            </p>
          </CarouselItem>

          <CarouselItem>
            <template #banner>
              🤫
            </template>
            <template #title>
              <span class="text-grey-darken-2">
                <em>*flüsternd*</em> nicht so laut
              </span>
            </template>

            <p>
              Bitte redet während des Spiels nur leise miteinander.
            </p>
            <p>
              Andere Teams könnten euch ausspionieren. 🕵️‍♂️
            </p>
          </CarouselItem>
        </Carousel>
      </div>
    </template>
  </ScreenWrapper>
</template>

<script lang="ts" setup>
import Carousel from '@/components/Carousel.vue';
import { useAuthManager } from '../../store/authManager';
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import { useGameManager } from '@/store/gameManager';
import CarouselItem from '@/components/CarouselItem.vue';

const auth = useAuthManager()
const game = useGameManager()
</script>

<style lang="scss" scoped>
@use '../../scss/vars' as *;

.home {
  // background: $surface;

  &__teamname {
    font-family: $fontDisplay;
    font-size: 4rem;
    text-align: center;
    margin-top: 4rem;
  }

  &__carousel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(80vw - 15rem);

    &__skew-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}
</style>