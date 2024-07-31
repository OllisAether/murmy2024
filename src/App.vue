<template>
  <template v-if="ws.status === 'connected'">
    <VFadeTransition>
      <div
        class="loading"
        v-if="!game.assetsProgress.loaded &&
          game.assetsProgress.loading &&
          auth.role !== Role.Admin
        "
      >
        <div class="d-flex align-center mb-2">
          <span>
            <VProgressCircular indeterminate class="mb-1 mr-2"/>
            Lade {{ loadProgress }}%
          </span>

          <VSpacer />

          <span>
            {{ game.assetsProgress.loadedAssets }} / {{ game.assetsProgress.totalAssets }}
          </span>
        </div>

        <VProgressLinear :model-value="loadProgress" class="mb-1 mr-2 loading__progress" :max="100"/>
      </div>

      <RouterView v-else />
    </VFadeTransition>
  </template>
  <VContainer v-else>
    <VAlert
      class="ws-status"
      :type="ws.status === 'disconnected' || ws.status === 'reconnecting' ? 'error' : undefined"
      :icon="
        ws.status === 'disconnected' ? 'mdi-wifi-off' :
        ws.status === 'reconnecting' ? 'mdi-wifi-strength-alert-outline' :
        ws.status === 'connecting' ? 'mdi-wifi-strength-alert-outline' :
        undefined"
    >
      <template #title>
        <template v-if="ws.status === 'disconnected'">
          Verbindung zum Server verloren
        </template>
        <template v-else-if="ws.status === 'reconnecting'">
          Verbindung zum Server verloren, versuche erneut zu verbinden...
        </template>

        <template v-else-if="ws.status === 'connecting'">
          Verbindung wird hergestellt...
        </template>
      </template>
      <VProgressLinear indeterminate v-if="ws.status === 'connecting' || ws.status === 'reconnecting'" />

      <template #close>
        <VBtn
          @click="ws.connect"
          v-if="ws.status === 'disconnected'"
        >
          <VIcon size="24">mdi-refresh</VIcon>
        </VBtn>
      </template>
    </VAlert>
  </VContainer>
</template>

<script lang="ts" setup>
import { VAlert, VContainer, VProgressLinear } from 'vuetify/components';
import { useAuthManager } from './store/authManager';
import { useWsClient } from './store/wsClient';
import { useGameManager } from './store/gameManager';
import { computed } from 'vue';
import { Role } from '../shared/roles';

const auth = useAuthManager()
const game = useGameManager()
const ws = useWsClient()
ws.connect()

const loadProgress = computed(() => {
  return Math.round(
    (Object.values(game.assetsProgress.progresses)
      .reduce((acc, val) => acc + val, 0) / game.assetsProgress.totalAssets)
    * 100)
})
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.ws-status {
  position: absolute;
  width: calc(100% - 2rem);
  max-width: max-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading {
  font-family: $fontDisplay;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  font-size: 2rem;
  font-weight: bold;

  &__progress {
    transition: none;
  }
}
</style>
