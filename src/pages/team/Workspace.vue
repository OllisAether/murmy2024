<template>
  <VLayout class="workspace">
    <VNavigationDrawer
      :persistent="display.mdAndUp.value"
      :permanent="display.mdAndUp.value"
      :mobile="display.mdAndDown.value"
      width="400"
    >
      <VToolbar color="transparent" border="b">
        <VToolbarTitle>
          00:00 {{ auth.team?.name }}
        </VToolbarTitle>
      </VToolbar>

      <VList nav>
        <VListItem @pointerdown="pointerdown" class="touch-action-none">
          <VListItemTitle>
            Test
          </VListItemTitle>
        </VListItem>
        
        <VListItem
          v-for="suspect in suspects"
          :key="suspect.id"
        >
          <template #prepend>
            <VImg
              cover
              width="96"
              :aspect-ratio="3/4"
              rounded="lg"
              class="mr-4"
              color="grey-darken-2"
              :src="suspect.person?.suspectImgUrl ? game.getAsset(suspect.person?.id + '-suspectImg')?.content : undefined"
            >
              <div class="d-flex h-100 align-center justify-center">
                <VIcon size="48">mdi-help</VIcon>
              </div>
            </VImg>
          </template>
          <h2>
            {{ suspect.person?.name }}
          </h2>
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
import { useGameManager } from '@/store/gameManager';
import { computed } from 'vue';
import { useDrag } from '@/store/dragStore';

const display = useDisplay()
const auth = useAuthManager()
const game = useGameManager()

const suspects = computed(() => game.suspects.map(suspect => ({
  id: suspect.personId,
  entries: suspect,
  person: game.getPerson(suspect.personId),
})))

const drag = useDrag()
function pointerdown(event: PointerEvent) {
  drag.startDrag('alice.doe@swiftmail.com', event)
}
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
