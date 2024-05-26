<template>
  <RouterView v-if="ws.status === 'connected'" />
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

useAuthManager()
const ws = useWsClient()
ws.connect()
</script>

<style lang="scss" scoped>
.ws-status {
  position: absolute;
  width: fit-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
