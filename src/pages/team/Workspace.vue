<template>
  <VLayout class="workspace">
    <SuspectDatabase class="workspace__sus-db" v-model:open="databaseExpanded" />

    <div class="workspace__main">
      <div class="workspace__tl-indicators">
        <VExpandXTransition style="transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); transition-duration: .75s;">
          <div class="workspace__timer-wrapper" v-if="!databaseExpanded">
            <Timer class="workspace__timer" />
          </div>
        </VExpandXTransition>
        <span class="workspace__ep">
          <VIcon size="1em">
            mdi-star-four-points-circle
          </VIcon> {{ game.clues.investigationCoins }}
        </span>
      </div>

      <div class="workspace__content">
        <VBtn @click="addEntry" color="primary">
          Eintrag hinzufügen
        </VBtn>

        {{ game.clues }}

        <div
          v-for="id in game.clues.available"
          :key="id"
        >
          {{ clues.find(c => c.id === id) }}
          <img
            v-if="game.clues.unlocked.includes(id)"
            style="width: 15rem;"
            :src="game.getAsset(clues.find(c => c.id === id)?.image?.assetId ?? '')?.content"
          >

          <VBtn>
            Open Dialog
            <VDialog activator="parent">

              <VCard>
                <VCardTitle>
                  {{ clues.find(c => c.id === id)?.title }}
                </VCardTitle>
                <VCardText>
                  {{ clues.find(c => c.id === id)}}
                  <img
                    v-if="game.clues.unlocked.includes(id)"
                    style="width: 100%;"
                    :src="game.getAsset(clues.find(c => c.id === id)?.image?.assetId ?? '')?.content"
                  >
                </VCardText>
              </VCard>
            </VDialog>
          </VBtn>
          <VBtn @click="game.unlockClue(id)" color="primary">
            Freischalten
          </VBtn>
        </div>
      </div>
    </div>
  </VLayout>
</template>

<script setup lang="ts">
import SuspectDatabase from '@/components/SuspectDatabase.vue';
import Timer from '@/components/Timer.vue';
import { useGameManager } from '@/store/gameManager';
import { ref } from 'vue';
import { clues } from '@/../shared/assets/clues';

const databaseExpanded = ref(true);

const game = useGameManager();

function addEntry () {
  game.addDatabaseEntry({
    matterId: 'test',
    suspectId: 'sasha.monterero',
    title: 'Testeintrag',
  });
}
</script>

<style lang="scss" scoped>
@import '@/scss/vars';

.workspace {
  height: 100%;
  display: flex;

  &__sus-db {
    z-index: 99;
  }

  &__main {
    flex: 1;
    position: relative;
    overflow-y: auto;

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

  &__tl-indicators {
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    display: flex;
  }

  &__timer {
    margin-right: 1.5rem;
    font-size: 2rem;
  }

  &__timer-wrapper {
    transform: translateY(-.4rem);
  }

  &__ep {
    font-size: 1.5rem;
    font-family: $fontDisplay;
  }

  &__content {
  }
}
</style>
