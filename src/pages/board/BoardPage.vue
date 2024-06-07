<template>
  <div class="loading" v-if="!game.assetsProgress.loaded">
    <VProgressCircular indeterminate class="mb-1 mr-2"/>
    Lade ({{ game.assetsProgress.loadedAssets }} / {{ game.assetsProgress.totalAssets }})...
  </div>

  <TitleScreen />

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
import TitleScreen from './TitleScreen.vue';
import { useGameManager } from '@/store/gameManager';

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