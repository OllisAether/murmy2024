<template>
  <TitleScreen />

  <VDialog v-model="navigationDialog" max-width="300">
    <VCard>
      <VToolbar>
        <VToolbarTitle>
          <VIcon>mdi-television</VIcon>
          Board
        </VToolbarTitle>
        <VSpacer />
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
import { ref } from 'vue';
import { useAuthManager } from '../../store/authManager';
import { VToolbar } from 'vuetify/components';
import TitleScreen from './TitleScreen.vue';

const auth = useAuthManager()

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
      setTimeout(() => {
        navigationDialog.value = true
      }, 500)
    }, { once: true })
  }
}

function logout () {
  auth.logout()
}
</script>