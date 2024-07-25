<template>
  <div class="loading" v-if="!game.assetsProgress.loaded || game.loading">
    <VProgressCircular indeterminate class="mb-1 mr-2"/>
    Lade ({{ game.assetsProgress.loadedAssets }} / {{ game.assetsProgress.totalAssets }})...
  </div>

  <template v-else>
    <div class="interact-confirm" v-if="!game.interacted">
      <VIcon size="64" class="mb-8">mdi-gesture-tap</VIcon><br>
      Bitte interagiere mit dem Bildschirm, um fortzufahren.
    </div>

    <template v-else>
      <MediaScreen v-if="game.phase.type === Phase.Media" />
      <VoteScreen v-else-if="game.phase.type === Phase.Vote" />
      <TitleScreen v-else />
    </template>
  </template>

  <VDialog v-model="navigationDialog" max-width="300" :persistent="persistent">
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
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuthManager } from '../../store/authManager';
import { VToolbar } from 'vuetify/components';
import { useGameManager } from '@/store/gameManager';
import { Phase } from '../../../shared/phase';

import TitleScreen from './TitleScreen.vue';
import MediaScreen from './MediaScreen.vue';
import VoteScreen from './VoteScreen.vue';

const auth = useAuthManager()
const game = useGameManager()

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