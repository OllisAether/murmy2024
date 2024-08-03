<template>
  <ScreenWrapper :class="['home', {
    'home--info': game.phase.meta.info,
    'home--media': mediaPlaying
  }]">
    <VFadeTransition>
      <div class="home__teamname" v-if="!mediaPlaying">
        {{ auth.team?.name }}
      </div>
    </VFadeTransition>

    <VFadeTransition>
      <template v-if="mediaPlaying">
        <div class="home__media-info">
          <VIcon>mdi-arrow-up</VIcon>
          Achte auf das Board! 📺
          <VIcon>mdi-arrow-up</VIcon>
        </div>
      </template>

      <template v-else-if="game.phase.meta.info">
        <div class="home__carousel">
          <!-- <SkewBox class="home__carousel__skew-box" :skew="0" /> -->

          <Carousel>
            <CarouselItem>
              <template #banner>
                💆
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
                <em class="text-grey">
                  Andere Teams könnten euch ausspionieren~
                </em>
              </p>
            </CarouselItem>

            <CarouselItem>
              <template #banner>
                🤝
              </template>
              <template #title>
                Teamwork makes the dream work!
              </template>

              <p>
                Arbeitet gut zusammen und unterstützt euch gegenseitig.
              </p>
              <p>
                Bindet alle Teammitglieder in eure Entscheidungen ein und hört aufeinander.
              </p>
            </CarouselItem>

            <CarouselItem>
              <template #banner>
                <VIcon>mdi-account-question</VIcon>
              </template>
              <template #title>
                Seid nicht schüchtern, fragt uns!
              </template>

              <p>
                Wenn ihr Fragen habt oder Hilfe benötigt, könnt ihr uns jederzeit
                <br>
                mit dem <b class="text-primary">Hilfe-Button</b> oben rechts erreichen.
              </p>
              <p>
                Wir werden euch keine Hinweise zum Spiel geben, aber wir helfen euch gerne bei technischen Problemen.
              </p>
            </CarouselItem>

          </Carousel>
        </div>
      </template>
    </VFadeTransition>
  </ScreenWrapper>
</template>

<script lang="ts" setup>
import { useAuthManager } from '../../store/authManager';
import { useGameManager } from '@/store/gameManager';
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import Carousel from '@/components/Carousel.vue';
import CarouselItem from '@/components/CarouselItem.vue';
import { computed } from 'vue';

const auth = useAuthManager()
const game = useGameManager()

const mediaPlaying = computed(() => {
  return !!game.currentMedia
})
</script>

<style lang="scss" scoped>
@use '../../scss/vars' as *;

.home {
  // background: $surface;

  &--info {
    .home__teamname {
      top: 0;
      transform: translateY(0);
      margin-top: 4rem;
    }
  }

  &__media-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
  }

  &__teamname {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    padding: 0 10vw;

    font-family: $fontDisplay;
    font-weight: bold;
    font-size: 4rem;
    text-align: center;
  }

  &__carousel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(70vw - 15rem);

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