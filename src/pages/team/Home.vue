<template>
  <ScreenWrapper :class="['home', {
    'home--info': isInfo,
    'home--break': isBreak,
    'home--media': mediaPlaying,
    'home--timer': isTimer && !isBreak,
    'home--results': isResults
  }]">
    <VFadeTransition>
      <div class="home__timer" v-if="isTimer && !isBreak">
        <div class="home__timer__next" v-if="game.phase.meta.next">
          <template v-if="game.phase.meta.next === 'vote'">
            Nächste Viewsrunde beginnt in
          </template>
        </div>

        <Timer />
      </div>
    </VFadeTransition>
    <VFadeTransition>
      <div class="home__teamname" v-if="!mediaPlaying && !isBreak && !isInfo">
        {{ auth.team?.name }}
      </div>
    </VFadeTransition>

    <VFadeTransition>
      <div class="home__media-info" v-if="mediaPlaying">
        <VIcon>mdi-arrow-up</VIcon>
        Achte auf das Board! 📺
        <VIcon>mdi-arrow-up</VIcon>
      </div>

      <div class="home__carousel" v-else-if="isInfo">
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
              Stellt sicher, dass eure <b>Handys auf lautlos</b> gestellt sind.
            </p>
          </CarouselItem>

          <CarouselItem>
            <template #banner>
              🤫
            </template>
            <template #title>
              <span style="opacity: 0.5;">
                <em>*flüsternd*
                  &nbsp;
                </em>
                <TextContentRenderer :text-content="wiggly('Psst, nicht so laut')" />
              </span>
            </template>

            <p>
              Bitte redet während des Spiels nur leise miteinander.
            </p>
            <p>
              <em style="opacity: 0.5;">
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
              mit dem <b>Hilfe-Button</b> oben rechts erreichen.
            </p>
            <p>
              Wir werden euch keine Hinweise zum Spiel geben, aber wir helfen euch gerne bei technischen Problemen.
            </p>
          </CarouselItem>

        </Carousel>
      </div>

      <div class="home__break-info" v-else-if="isBreak">
        <div class="home__break-info__title">
          <span class="home__break-info__emoji">☕</span>
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

      <div class="home__results-info" v-else-if="isResults">
        <VIcon>mdi-arrow-up</VIcon>
        Ihr könnt eure Ergebnisse auf dem Board einsehen! 📺
        <VIcon>mdi-arrow-up</VIcon>
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
import TextContentRenderer from '@/components/TextContentRenderer.vue';
import { wiggly } from '../../../shared/textContent';

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

const isInfo = computed(() => {
  return game.phase.meta.info ?? false
})

const isResults = computed(() => {
  return game.phase.meta.results ?? false
})


const wakelockShouldntBeActive = computed(() => {
  return isBreak.value || isEnd.value || isResults.value || isInfo.value
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
      top: calc(40vh - 22rem);
      transform: translateY(0);
    }
  }

  &--results {
    .home__teamname {
      top: calc(25vh);
    }
  }

  &__media-info, &__break-info, &__results-info {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    padding: 0 4rem;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    text-align: center;
  }

  &__break-info {
    text-align: center;
    padding: 0 1rem;

    &__emoji {
      font-size: 1.4em;
    }
    
    &__title {
      font-size: 7vw;
      font-family: $fontDisplayCursive;
      margin-bottom: 3rem;
      
      text-shadow: 0 0 1rem #fff9ec, 0 0 5rem #ffebc788;
    }

    &__timer {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-family: $fontHeading;

      span {
        font-family: $fontDisplay;
        color: #f4e8ff;
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

    font-family: $fontDisplayCursive;
    font-size: 5vw;
    text-align: center;
    color: #f4e8ff;
    text-shadow: 0 0 1rem #a172ff, 0 0 3rem #9059ff, 0 0 6rem #6213ff;

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
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 10vw;
    font-size: 15vw;
    
    transition: 1s cubic-bezier(0.19, 1, 0.22, 1);

    .home--info & {
      font-size: 5vw;
      top: calc(40vh - 22rem);
      transform: translateX(-50%);
    }

    &__next {
      font-size: 2rem;
      margin-bottom: -4vw;
    }
  }

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}
</style>