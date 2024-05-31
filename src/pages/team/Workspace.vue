<template>
  <VLayout class="workspace">
    <VNavigationDrawer
      :persistent="display.smAndUp.value"
      :permanent="display.smAndUp.value"
      :mobile="display.smAndDown.value"
      width="400"
    >
      <VToolbar color="transparent" border="b">
        <VToolbarTitle>
          00:00 {{ auth.team?.name }}
        </VToolbarTitle>
      </VToolbar>

      <VList nav>
        <VListItem>
          <template #prepend>
            <VImg
              cover
              width="128"
              :aspect-ratio="3/4"
              rounded="lg"
              class="mr-4"
              color="grey-darken-2"
            >
              <div class="d-flex h-100 align-center justify-center">
                <VIcon size="48">mdi-help</VIcon>
              </div>
            </VImg>
          </template>
          John Doe
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VMain class="main">
      <Workarea />
    </VMain>
  </VLayout>
</template>

<script setup lang="ts">
import { useAuthManager } from '../../store/authManager';
import Workarea from '../../components/game/Workarea.vue';
import { useDisplay } from 'vuetify';

const display = useDisplay()
const auth = useAuthManager()
</script>

<style lang="scss" scoped>
.workspace {
  height: 100%;
  overflow: hidden;

  .main {
    height: 100%;
  }
}
</style>
