<template>
  <VContainer>
    <VCard>
      <VToolbar>
        <VToolbarTitle>Pools</VToolbarTitle>
        <VBtn>
          <VIcon>mdi-plus</VIcon>
          Neuer Pool

          <VDialog
            activator="parent"
            v-model="addDialog"
            max-width="500"
          >
            <VCard>
              <VToolbar>
                <VToolbarTitle>
                  Neuer Pool
                </VToolbarTitle>
                <VBtn icon @click="addDialog = false">
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </VToolbar>

              <VCardText>
                <VTextField
                  v-model="newPool"
                  label="Poolname"
                  variant="outlined"
                  hide-details
                />
              </VCardText>

              <VCardActions>
                <VSpacer />
                <VBtn
                  @click="addDialog = false"
                >
                  Abbrechen
                </VBtn>
                <VBtn
                  color="primary"
                  @click="admin.addPool(newPool); addDialog = false"
                >
                  Hinzufügen
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>
        </VBtn>
      </VToolbar>

      <VCardText>
        <PoolCard
          v-for="(options, pool, i) in game.vote.pools"
          :key="pool"
          :class="{
            'mt-2': i > 0,
          }"
          :pool="pool"
          :options="options"
        />
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import { useAdmin } from '../../store/admin/index';
import { ref, watch } from 'vue';
import PoolCard from '@/components/admin/PoolCard.vue';

const admin = useAdmin()
const game = useGameManager()

const addDialog = ref(false)
const newPool = ref('')

watch(addDialog, (val) => {
  if (!val) {
    newPool.value = ''
  }
})
</script>