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

  <!-- <VFadeTransition>
    <div
      v-if="drag.currentDrag"
      class="drag-item"
      :style="{
        top: drag.currentDrag.pos.y + 'px',
        left: drag.currentDrag.pos.x + 'px',
      }"
    >
      <VIcon size="16">
        mdi-arrow-collapse-down
      </VIcon>

      <div>
        {{ drag.currentDrag.data }}
      </div>
    </div>
  </VFadeTransition> -->
</template>

<script lang="ts" setup>
import { VAlert, VContainer, VProgressLinear } from 'vuetify/components';
import { useAuthManager } from './store/authManager';
import { useWsClient } from './store/wsClient';
import { useGameManager } from './store/gameManager';
// import { useDrag } from './store/dragStore';

useAuthManager()
useGameManager()
const ws = useWsClient()
ws.connect()

// const drag = useDrag()
</script>

<style lang="scss" scoped>
.ws-status {
  position: absolute;
  width: calc(100% - 2rem);
  max-width: max-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.drag-item {
  position: fixed;
  z-index: 99999;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background: rgba(0, 0, 0, 0.9);
  transform: translate(-50%, -50%);

  pointer-events: none;

  div {
    position: absolute;
    top: 50%;
    left: 50%;
    white-space: nowrap;
    width: max-content;
    box-shadow: 0 0 1rem rgba(black, 0.5);
    transform: translate(-50%, -150%);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: rgba(#111, 0.9);
    color: white;
  }
}
</style>
