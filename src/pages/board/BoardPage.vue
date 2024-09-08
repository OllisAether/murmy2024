<template>
  <div class="interact-confirm" v-if="!game.interacted">
    <VIcon size="64" class="mb-8">mdi-gesture-tap</VIcon><br>
    Bitte interagiere mit dem Bildschirm, um fortzufahren.
  </div>

  <template v-else>
    <VFadeTransition mode="out-in">
      <MediaScreen v-if="game.currentMedia !== null" />
      <VoteScreen v-else-if="game.phase.type === Phase.Vote" />
      <ResultsScreen v-if="game.phase.meta.results" />
      <ShownewCluesScreen v-if="game.phase.meta.showNewClues" />
      <TitleScreen v-else />
    </VFadeTransition>
  </template>

  <VDialog v-model="navigationDialog" max-width="500" :persistent="persistent">
    <VCard>
      <VToolbar>
        <VToolbarTitle>
          <VIcon>mdi-television</VIcon>
          Board
        </VToolbarTitle>
        <VBtn icon @click="navigationDialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>

      <VCardText>
        <VExpandTransition>
          <div v-if="volumePanel">
            <VCard class="mb-2 pa-4" color="background" flat>
              <div>
                <VIcon>mdi-volume-high</VIcon>
                Hauptlautstärke
              </div>
              <VSlider
                v-model="audio.masterVolume"
                thumb-size="16"
                step=".01"
                min="0"
                max="1"
                hide-details
                color="primary"
                class="mb-2"
              />

              <VDivider class="mb-4" />

              <div>
                <VIcon>mdi-music</VIcon>
                Music Volume
              </div>
              <VSlider
                v-model="audio.rawMusicVolume"
                thumb-size="16"
                step=".01"
                min="0"
                max="1"
                hide-details
                class="mb-2"
              />
              <div>
                <VIcon>mdi-play-circle</VIcon>
                Media Volume
              </div>
              <VSlider
                v-model="audio.rawMediaVolume"
                thumb-size="16"
                step=".01"
                min="0"
                max="1"
                hide-details
                class="mb-2"
              />
              <div>
                <VIcon>mdi-poll</VIcon>
                Vote Volume
              </div>
              <VSlider
                v-model="audio.rawVoteVolume"
                thumb-size="16"
                step=".01"
                min="0"
                max="1"
                hide-details
              />
            </VCard>
          </div>
        </VExpandTransition>
        
        <VBtn
          variant="text"
          @click="volumePanel = !volumePanel"
          class="w-100 mb-2"
        >
          Lautstärke-Optionen
          <VIcon>{{ volumePanel ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</VIcon>
        </VBtn>

        <VBtn
          variant="tonal"
          color="primary"
          @click="toggleFs"
          class="w-100 mb-2"
        >
          Vollbild an/aus
        </VBtn>
        <VBtn
          variant="tonal"
          color="error"
          @click="logout"
          class="w-100"
        >
          Logout
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue';
import { useAuthManager } from '../../store/authManager';
import { VToolbar } from 'vuetify/components';
import { useGameManager } from '@/store/gameManager';
import { Phase } from '../../../shared/phase';

import TitleScreen from './TitleScreen.vue';
import MediaScreen from './MediaScreen.vue';
import VoteScreen from './VoteScreen.vue';
import ResultsScreen from './ResultsScreen.vue';
import ShownewCluesScreen from './ShownewCluesScreen.vue';
import { useAudio } from '@/store/board/audio';

const auth = useAuthManager()
const game = useGameManager()
const audio = useAudio()

const volumePanel = ref(false)

const navigationDialog = ref(false)

function toggleFs () {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }

}

let taps = 0
useEventListener('pointerdown', tap)

const persistent = ref(false)
function tap () {
  // 3 Taps to open dialog
  if (navigationDialog.value) return

  taps++

  setTimeout(() => {
    taps = 0
  }, 500)

  if (taps === 3) {
    taps = 0

    window.addEventListener('pointerup', () => {
      persistent.value = true
      navigationDialog.value = true

      setTimeout(() => {
        persistent.value = false
      }, 500)
    }, { once: true })
  }
}

function logout () {
  auth.logout()
}

onMounted(() => {
  game.initGameManager()

  onBeforeUnmount(() => {
    game.deinitGameManager()
  })
})

onBeforeMount(() => {
  game.wakelockShouldBeActive = true
})

onUnmounted(() => {
  game.wakelockShouldBeActive = false
})
</script>

<style scoped lang="scss">
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.interact-confirm {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>