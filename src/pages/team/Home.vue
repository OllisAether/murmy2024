<template>
  <ScreenWrapper :class="['home', {
    'home--info': game.phase.meta.info,
    'home--break': isBreak,
    'home--media': mediaPlaying,
    'home--timer': isTimer
  }]">
    <VFadeTransition>
      <div class="home__teamname" v-if="!mediaPlaying && !isBreak">
        {{ auth.team?.name }}
      </div>
    </VFadeTransition>

    <VFadeTransition>
      <div class="home__media-info" v-if="mediaPlaying">
        <VIcon>mdi-arrow-up</VIcon>
        Achte auf das Board! 📺
        <VIcon>mdi-arrow-up</VIcon>
      </div>

      <div class="home__carousel" v-else-if="game.phase.meta.info">
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
              <span style="color: #fff8;">
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

      <div class="home__break-info" v-else-if="isBreak">
        <div class="home__break-info__emoji">
          ☕
        </div>
        <div class="home__break-info__title">
          Päuschen!
        </div>
        <div class="home__break-info__timer">
          Um
          <span>{{ moment(resumeTime).format('HH:mm') }}</span>
          Uhr geht es weiter!
        </div>
        
        <div class="home__break-info__text">
          Ihr könnt euch entspannen, auf die Toilette gehen oder
          etwas zum knabbern oder trinken am Verkaufsstand holen.
        </div>
      </div>

      <div class="home__timer" v-else-if="isTimer">
        <Timer />
      </div>
    </VFadeTransition>
  </ScreenWrapper>
</template>

<script lang="ts" setup>
import { useAuthManager } from '../../store/authManager';
import { useGameManager } from '@/store/gameManager';
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import Carousel from '@/components/team/Carousel.vue';
import CarouselItem from '@/components/team/CarouselItem.vue';
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import moment from 'moment';
import Timer from '@/components/Timer.vue';

const auth = useAuthManager()
const game = useGameManager()

const mediaPlaying = computed(() => {
  return !!game.currentMedia
})

const resumeTime = computed(() => {
  const timer = game.timer

  return timer.duration + (timer.startTime ?? Date.now())
})

const isTimer = computed(() => {
  return game.timer.state !== 'stopped'
})

const isBreak = computed(() => {
  return game.phase.meta.break ?? false
})

const isEnd = computed(() => {
  return game.phase.meta.end ?? false
})

const wakelockShouldntBeActive = computed(() => {
  return isBreak.value || isEnd.value
})

let wakelockShouldBeActiveBefore: boolean = game.wakelockShouldBeActive
watch(wakelockShouldntBeActive, (wakelockShouldntBeActive) => {
  if (wakelockShouldntBeActive) {
    game.wakelockShouldBeActive = false
  } else {
    game.wakelockShouldBeActive = wakelockShouldBeActiveBefore
  }
})

onMounted(() => {
  if (wakelockShouldntBeActive.value) {
    game.wakelockShouldBeActive = false
  }
})

onBeforeUnmount(() => {
  game.wakelockShouldBeActive = wakelockShouldBeActiveBefore
})
</script>

<style lang="scss" scoped>
@use '../../scss/vars' as *;

.home {
  // background: $surface;

  &--info, &--timer {
    .home__teamname {
      top: calc(40vh - 25rem);
      transform: translateY(0);
    }
  }

  &__media-info, &__break-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
  }

  &__break-info {
    text-align: center;
    padding: 0 1rem;

    &__emoji {
      font-size: 10vw;
      font-family: $fontDisplay;
    }

    &__title {
      font-size: 2rem;
      font-family: $fontHeading;
      margin-bottom: 3rem;
    }

    &__timer {
      font-size: 3rem;
      margin-bottom: 1rem;

      font-family: $fontHeading;

      span {
        font-weight: bold;
        color: #ccb3ff;
        text-shadow: 0 0 1rem #a172ff, 0 0 3rem #9059ff, 0 0 6rem #6213ff;
      }
    }

    &__text {
      font-size: 1.2rem;
    }
  }

  &__teamname {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    padding: 0 10vw;

    font-family: $fontDisplay;
    font-size: 4rem;
    text-align: center;

    transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1), top 1s cubic-bezier(0.19, 1, 0.22, 1);
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

  &__timer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 13vw;
  }

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}
</style>