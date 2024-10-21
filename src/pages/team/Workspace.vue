<template>
  <ScreenWrapper>
    <VLayout :class="['workspace', {
      'workspace--tutorial': tutorial.isTutorial,
      'workspace--tutorial-unlockClue': isTutorialUnlockClue
    }]">
      <SuspectDatabase class="workspace__sus-db" v-model:open="databaseExpanded" v-if="!showClue" />

      <div class="workspace__main" ref="workspace">
        <div class="workspace__indicators" v-if="!showClue">
          <div class="workspace__indicators__left">
            <!-- <VExpandXTransition style="transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); transition-duration: .75s;">
              <div class="workspace__timer-wrapper" v-if="!databaseExpanded">
                <Timer class="workspace__timer" />
              </div>
            </VExpandXTransition> -->
            <InvestigationCoinsDisplay class="workspace__ep" />
            <HelpBtn>
              <template #header>
                Ermittlungspunkte
              </template>

              Ermittlungspunkte sind <b class="help-color">Währungseinheiten</b>, die ihr für das Freischalten von Clues benötigt. <br><br>
              Ihr erhaltet <b><VIcon size="1em" style="vertical-align: 0;">mdi-star-four-points-circle</VIcon> 15</b> vor jeder Arbeitsphase<br>
              und <b><VIcon size="1em" style="vertical-align: 0;">mdi-star-four-points-circle</VIcon> 5</b> pro markiertem Hinweis.
            </HelpBtn>
          </div>
          <div class="workspace__indicators__center">
            <span class="workspace__teamname">
              {{ auth.team?.name }}
            </span>
          </div>
        </div>

        <BlurGradient class="workspace__blur-gradient" :steps="2" :blur="10" />

        <div class="workspace__scroller" ref="scroller">
          <div class="workspace__content">
            <MainClueTypeCard class="workspace__main-clue" v-if="game.clues.mainClueType"/>

            <div ref="workspaceTranscript">
              <div class="workspace__content__header">
                Transkripte
                <HelpBtn>
                  <template #header>
                    Transkripte
                  </template>
                  Transkripte sind die verschriftlichten Inhalte der am Board gezeigten Views. Sie können Hinweise auf den Täter oder die Tat enthalten. <br><br>
                  Es lohnt sich, die Transkripte genau zu lesen, da sie oft <b class="help-color">wichtige Informationen</b> enthalten, die <b class="help-color">markiert</b> werden können.
                </HelpBtn>
              </div>
              <div class="workspace__clue-grid mb-8">
                <ClueCard
                  v-for="transcript in game.availableTranscripts"
                  :key="transcript.id"
                  :transcript="transcript"
                  :closable="true"
                />
              </div>

              <div class="workspace__no-clues" v-if="game.availableTranscripts.length === 0">
                Keine Transkripte verfügbar
              </div>
            </div>

            <div ref="workspaceClues">
              <div class="workspace__content__header">
                Clues

                <HelpBtn>
                  <template #header>
                    Clues
                  </template>

                  Clues enthalten <b class="help-color">wichtige Informationen</b> über den Fall, die <b class="help-color">markiert</b> werden können und euch bei der Ermittlung helfen. <br><br>

                  Ihr könnt Clues mit <b class="help-color"><VIcon size="1em">mdi-star-four-points-circle</VIcon> Ermittlungspunkten</b> freischalten.
                </HelpBtn>
              </div>

              <div class="workspace__clue-grid">
                <ClueCard
                  v-for="(clue, i) in game.clues.available"
                  :key="clue"
                  :clueId="clue"
                  :closable="!showClue"
                  v-model:showClue="showClues[clue]"
                  v-model:showBuyConfirmation="showBuyConfirmations[clue]"
                  :highlight="isTutorialUnlockClue && i === 0 && !showClues[clue]"
                  :style="{
                    pointerEvents: isTutorialUnlockClue && i === 0 ? 'all' : undefined
                  }"
                />
              </div>

              <div class="workspace__no-clues" v-if="game.clues.available.length === 0">
                Keine Clues verfügbar
              </div>
            </div>
          </div>
        </div>

        <FormCard class="workspace__form-card" v-if="game.phase.meta?.form" />
      </div>

      <!-- <Teleport to="body"> -->
        <!-- </Teleport> -->
    </VLayout>
    <Transition name="tutorial__highlighted-element">
      <div
        v-if="tutorial.highlightedElementPos"
        :class="['tutorial__highlighted-element', {}]"
        :style="{
          top: tutorial.highlightedElementPos.y + 'px',
          left: tutorial.highlightedElementPos.x + 'px',
          width: tutorial.highlightedElementPos.width + 'px',
          height: tutorial.highlightedElementPos.height + 'px'
        }"
      >
        <div :style="{
          borderRadius: tutorial.highlightedElementPos.borderRadius !== undefined ?
            tutorial.highlightedElementPos.borderRadius + 'px' : undefined,
        }" />
      </div>
    </Transition>
  </ScreenWrapper>
</template>

<script setup lang="ts">
import BlurGradient from '@/components/BlurGradient.vue';
import ScreenWrapper from '@/components/ScreenWrapper.vue';
import ClueCard from '@/components/team/ClueCard.vue';
import FormCard from '@/components/team/FormCard.vue';
import HelpBtn from '@/components/team/HelpBtn.vue';
import InvestigationCoinsDisplay from '@/components/team/InvestigationCoinsDisplay.vue';
import MainClueTypeCard from '@/components/team/MainClueTypeCard.vue';
import SuspectDatabase from '@/components/team/SuspectDatabase.vue';
import { useAuthManager } from '@/store/authManager';
import { useGameManager } from '@/store/gameManager';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useTutorial } from '@/store/team/tutorial';

const databaseExpanded = ref(true);

const game = useGameManager();
const auth = useAuthManager();

const showBuyConfirmations = ref<{
  [clueId: string]: boolean;
}>({});

const showClues = ref<{
  [clueId: string]: boolean;
}>({});

const scroller = ref<HTMLElement | null>(null);

const tutorial = useTutorial();

const workspaceTranscript = ref<HTMLElement | null>(null);
watch(workspaceTranscript, (el) => {
  if (el) {
    tutorial.registerHighlightElement('transcripts', {
      element: el,
      margin: 32
    });
  } else {
    tutorial.unregisterHighlightElement('transcripts');
  }
});

const workspaceClues = ref<HTMLElement | null>(null);
watch(workspaceClues, (el) => {
  if (el) {
    tutorial.registerHighlightElement('clues', {
      element: el,
      margin: 32
    });
  } else {
    tutorial.unregisterHighlightElement('clues');
  }
});

const workspace = ref<HTMLElement | null>(null);
watch(workspace, (el) => {
  if (el) {
    tutorial.registerHighlightElement('workspace', {
      element: el,
      borderRadius: 8,
      margin: -8
    });
  } else {
    tutorial.unregisterHighlightElement('workspace');
  }
});

onBeforeUnmount(() => {
  tutorial.unregisterHighlightElement('workspace');
  tutorial.unregisterHighlightElement('transcripts');
  tutorial.unregisterHighlightElement('clues');
});

// #region Tutorial Unlock Clue
const isTutorialUnlockClue = computed(() => tutorial.state.action === 'unlockClue');
const isTutorialMarkEntry = computed(() => tutorial.state.action === 'markEntry');

const shouldScrollToBottom = computed(() => {
  return isTutorialUnlockClue.value || tutorial.state.highlight === 'clues' || isTutorialMarkEntry.value;
});

const showClue = computed(() => {
  return game.phase.meta.showClue ?? null;
});


onMounted(() => {
  watch(shouldScrollToBottom, (scrollToBottom) => {
    if (scrollToBottom) {
      scroller.value?.scrollTo({
        top: scroller.value.scrollHeight,
        behavior: 'smooth'
      })
    } else {
      setTimeout(() => {
        scroller.value?.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }, 500)
    }
  }, { immediate: true });

  watch([isTutorialMarkEntry, isTutorialUnlockClue], () => {
    if (isTutorialMarkEntry.value || (isTutorialUnlockClue.value && game.clues.unlocked.includes(game.clues.available[0]))) {
      const clue = game.clues.available[0]

      if (!clue) {
        return
      }

      showClues.value = {
        [clue]: true
      }
      showBuyConfirmations.value = {};
    } else if (!isTutorialUnlockClue.value && !isTutorialMarkEntry.value) {
      showClues.value = {};
      showBuyConfirmations.value = {};
    }
  }, { immediate: true, deep: true });

  watch(showClue, (show) => {
    if (show) {
      showClues.value = {
        [show]: true
      }
    }
  }, { immediate: true });
})
// #endregion
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.workspace {
  height: 100%;
  display: flex;

  &--tutorial, &--tutorial > * {
    pointer-events: none !important;
  }

  &__sus-db {
    z-index: 99;
  }

  &__main {
    flex: 1;
    position: relative;
    // overflow-y: auto;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(120% 100% at top left, #62FFFF, transparent),
                  radial-gradient(120% 100% at bottom right, #7BB0FFDD, transparent);
      opacity: 0.15;
      z-index: -1;
    }
  }

  &__indicators {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5rem;

    &__left {
      z-index: 2000;
      position: absolute;
      inset: 1.5rem auto 1.5rem 1.5rem;
      display: flex;
      line-height: 2rem;
    }

    &__center {
      z-index: 2;
      position: absolute;
      top: 1.5rem;
      left: 50%;
      bottom: 1.5rem;
      transform: translateX(-50%);
      line-height: 2rem;
    }
  }

  &__blur-gradient {
    background: linear-gradient(#0008, transparent);
    z-index: 1;
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    height: 6rem;
  }

  &__timer {
    margin-right: 1.5rem;
    font-size: 2rem;
  }

  &__scroller {
    flex: 1;
    overflow-y: auto;
    height: 100%;
  }

  &__content {
    max-width: calc(100vw - 22rem);
    margin: 0 auto;
    padding: 6rem 5rem 15rem;

    &__header {
      margin: 1.5rem 0;
      font-size: 1.5rem;
      font-family: $fontHeading;
      font-weight: 300;
      gap: .5rem;
      align-items: center;
      display: flex;
    }
  }

  &__no-clues {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 3rem;
    padding-bottom: 2rem;
    opacity: 0.5;
  }

  &__main-clue {
    margin-bottom: 3rem;
  }

  &__clue-grid {
    padding: 0 1rem;
    display: grid;
    gap: 3rem;
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    justify-content: center;
  }

  &__teamname {
    font-size: 2rem;
    font-family: $fontDisplay;
    font-weight: 300;
  }
}

.tutorial {
  &__highlighted-element {
    pointer-events: none;

    position: fixed;
    z-index: 9999;
    transition: top 1s, left 1s, width 1s, height 1s;
    transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);

    div {
      position: absolute;
      inset: 0;
      border: 2px solid #fff;
      border-radius: 1rem;

      box-shadow:
        inset 0 0 .5rem #fff,

        inset 1rem 0 2rem -.5rem rgba($neon1, 0.3),
        inset -1rem 0 2rem -.5rem rgba($neon2, 0.3),
        
        0 0 1.5rem #fff,
        -.5rem 0 3rem rgba($neon1, 0.4),
        .5rem 0 3rem rgba($neon2, 0.4),
        0 0 0 max(100vw, 100vh) #000a;

      transition: border-radius 1s cubic-bezier(0.19, 1, 0.22, 1);
    }

    // &--interact div {
    //   box-shadow: 
    //     inset 0 0 .5rem #fff,
        
    //     // inset .2rem 0 .25rem $neon1,
    //     // inset -.2rem 0 .25rem $neon2,
        
    //     inset 1rem 0 2rem -.5rem rgba($neon1, 0.3),
    //     inset -1rem 0 2rem -.5rem rgba($neon2, 0.3),
        
    //     0 0 1.5rem #fff,
    //     -.5rem 0 3rem rgba($neon1, 0.4),
    //     .5rem 0 3rem rgba($neon2, 0.4);
    //   animation: pulse 1.3s infinite;

    //   @keyframes pulse {
    //     0% {
    //       transform: scale(1.2);
    //       opacity: 0;
    //     }
    //     50% {
    //       opacity: 1;
    //     }
    //     100% {
    //       transform: scale(1);
    //       opacity: 0;
    //     }
    //   }
    // }

    &-enter-active, &-leave-active {
      div {
        transition: inset 1s, opacity 1s, border-radius 1s;
        transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
      }
    }

    &-enter-from, &-leave-to {
      div {
        inset: -4rem;
        opacity: 0;
      }
    }
  }
}
</style>
