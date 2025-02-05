<template>
  <div class="form-card">
    <button @click="!game.formSubmitted && (showForm = true)" :class="['form-card__content', {
      'form-card__content--open': showForm && !game.formSubmitted
    }]">
      <VIcon class="form-card__content__icon" v-if="!game.formSubmitted">
        mdi-open-in-new
      </VIcon>
      <div class="form-card__content__text">
        <div class="form-card__content__text__title">
          Lösungsbogen
          <template v-if="game.formSubmitted">
            abgeschickt
          </template>
        </div>
        <div class="form-card__content__text__description">
          <template v-if="game.formSubmitted">
            Ihr könnt euch entspannen, bis die anderen Teams auch fertig sind.
          </template>
          <template v-else>
            Hier könnt ihr eure Lösungen eintragen.
          </template>
        </div>
      </div>
    </button>

    <VOverlay
      v-if="!game.formSubmitted"
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
          <VDialog v-if="pageIndex < form.length - 1" max-width="400">
            <template #activator="{ props }">
              <Btn v-bind="props">
                Weiter
                <VIcon size="1em" class="ml-2">mdi-arrow-right</VIcon>
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

                <VCardTitle style="position: relative; font-size: 1.2em" class="px-0 text-red">
                  <span style="font-size: 1.5em">
                    <VIcon size="1em" class="mr-2">mdi-alert</VIcon>
                    Ihr könnt nicht zurück!
                  </span>
                </VCardTitle>

                <!-- <div style="position: relative; font-size: 1rem;"> -->
                  <VCardText style="position: relative;" class="px-0">
                    Nach dem Weitergehen könnt ihr eure Antworten nicht mehr ändern.
                  </VCardText>
                <!-- </div> -->
                <VCardActions>
                  <Btn class="mr-4" color="#A23946" @click="isActive.value = false">
                    Abbrechen
                  </Btn>
                  <Btn color="#006d3e" @click="game.nextPage(); isActive.value = false">
                    Weiter
                  </Btn>
                </VCardActions>
              </VCard>
            </template>
          </VDialog>
          <VDialog max-width="400" v-else>
            <template #activator="{ props }">
              <Btn color="#006d3e" v-bind="props">
                Absenden
                <VIcon size="1em" class="ml-2">mdi-arrow-right</VIcon>
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

                <VCardTitle style="position: relative;" class="px-0 text-red">
                  <span style="font-size: 1.5em">
                    <VIcon size="1em" class="mr-2">mdi-alert</VIcon>
                    Ihr könnt nicht zurück!
                  </span>
                </VCardTitle>

                <!-- <div style="position: relative; font-size: 1rem;"> -->
                  <VCardText style="position: relative;" class="px-0">
                    Nach dem Absenden könnt ihr eure Antworten nicht mehr ändern.
                  </VCardText>
                <!-- </div> -->
                <VCardActions>
                  <Btn class="mr-4" color="#A23946" @click="isActive.value = false">
                    Abbrechen
                  </Btn>
                  <Btn color="#006d3e" @click="submit">
                    Absenden
                  </Btn>
                </VCardActions>
              </VCard>
            </template>
          </VDialog>
          <Btn
            @click="showForm = false"
            color="#A23946"
          >
            Schließen
            <VIcon size="1em" class="ml-2">mdi-close</VIcon>
          </Btn>
        </div>
      </div>
    </VOverlay>
  </div>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import { computed, ref } from 'vue';
import Btn from '../Btn.vue';
import SkewBox from '../SkewBox.vue';
import Form from './form/Form.vue';
import { form } from '../../shared/assets/form';

const game = useGameManager();

const showForm = ref(false);
const pageIndex = computed(() => game.formPage);

function submit() {
  game.submitForm();
  showForm.value = false;
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.form-card {
  &__content {
    background: #393c3fa1;
    border: 1px solid #fff2;
    border-radius: 1rem 1rem 0 0;

    -webkit-backdrop-filter: blur(2rem);
    backdrop-filter: blur(2rem);

    position: absolute;
    right: 2rem;
    bottom: -5rem;

    width: 30rem;
    // box-shadow: 0 0 4rem #000;

    padding: 1.5rem 2rem 7rem;

    text-align: left;

    transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1), opacity .5s;

    &--open {
      transform: translateY(-5rem);
      opacity: 0;
    }

    &__icon {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
    }

    &__text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
      gap: .5rem;

      &__title {
        font-size: 1.5rem;
        font-family: $fontHeading;
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