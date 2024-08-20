<template>
  <div class="form-card">
    <button @click="showForm = true" class="form-card__content">
      <SkewBox color="#fff2" :corner-cut="12" class="form-card__content__box" />

      <img :src="game.getAsset('dokumente/autopsiebericht.png')?.content">

      <div class="form-card__content__text">
        <div class="form-card__content__text__title">
          Lösungsbogen
        </div>
        <div class="form-card__content__text__description">
          Hier könnt ihr eure Lösungen eintragen.
        </div>
      </div>
    </button>

    <VOverlay
      v-model="showForm"
      attach="parent"
      :z-index="9"
      absolute
      :close-on-content-click="false"
      :close-on-back="true"
      height="100%"
      width="100%"
      transition="fade-transition"
    >
      <div class="form-card__form-display">
        <Form class="form-card__form-display__form" v-model="pageIndex" />

        <div class="form-card__form-display__actions">
          <div class="form-card__form-display__page">
            Seite {{ pageIndex + 1 }} von {{ form.length }}
          </div>
          <VSpacer />
          <Btn
            :disabled="pageIndex === 0"
            @click="pageIndex--"
          >
            <VIcon size="1em" class="mr-2">mdi-arrow-left</VIcon>
            Zurück
          </Btn>
          <Btn
            :disabled="pageIndex === form.length - 1"
            @click="pageIndex++"
          >
            Weiter
            <VIcon size="1em" class="ml-2">mdi-arrow-right</VIcon>
          </Btn>
          <Btn
            @click="showForm = false"
            color="#A23946"
          >
            Schließen
            <VIcon size="1em" class="ml-2">mdi-close</VIcon>
          </Btn>
          <VDialog max-width="300">
            <template #activator="{ props }">
              <Btn color="#006d3e" v-bind="props">
                Absenden
                <VIcon size="1em" class="ml-2">mdi-arrow-top-right</VIcon>
              </Btn>
            </template>
            <template #="{ isActive }">
              <VCard
                color="transparent"
                elevation="0"
                style="overflow: visible;"
              >
                <SkewBox
                  style="
                    position: absolute;
                    inset: -1rem -2rem;
                  "
                  :rounded-corners="8"
                  :skew="5"
                />

                <div style="position: relative; font-size: 1rem;">
                  Möchtet ihr eure Lösungen wirklich absenden?
                </div>
                <VCardActions>
                  <Btn class="mr-4" color="#A23946" @click="isActive.value = false">
                    Nein
                  </Btn>
                  <Btn color="#006d3e">
                    Ja
                  </Btn>
                </VCardActions>
              </VCard>
            </template>
          </VDialog>
        </div>
      </div>
    </VOverlay>
  </div>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import { ref } from 'vue';
import Btn from '../Btn.vue';
import SkewBox from '../SkewBox.vue';
import Form from './form/Form.vue';
import { form } from '../../../shared/assets/form';

const game = useGameManager();

const showForm = ref(false);
const pageIndex = ref(0);
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form-card {
  height: 15rem;

  &__content {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 1rem 3rem;
    text-align: left;

    display: flex;
    align-items: stretch;
    gap: 2rem;

    img {
      position: relative;
      pointer-events: none;
      width: auto;
      height: 100%;
      filter: drop-shadow(0 0 1rem #0007);
    }

    &__box {
      position: absolute;
      top: 4rem;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: .5;
      z-index: -1;
    }

    &__text {
      padding-top: 3rem;
    
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      gap: 0.5rem;

      &__title {
        font-size: 2rem;
      }

      &__description {
        color: #fff8;
      }
    }
  }

  &__form-display {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
    padding-bottom: 3rem;
    padding-top: 4rem;

    &__form {
      flex: 1;
      padding: 0 4rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    &__page {
      color: #fff8;
    }

    &__actions {
      padding: 0 4rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
    }
  }
}
</style>