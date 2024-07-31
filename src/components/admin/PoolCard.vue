<template>
  <VCard color="background" flat>
    <VToolbar color="transparent" density="compact">
      <VToolbarTitle>
        {{ pool }}
      </VToolbarTitle>
      <VBtn
        variant="tonal"
        color="error"
        size="small"
        class="mr-3"
      >
        <VIcon>mdi-delete</VIcon>
        Pool löschen
        
        <VDialog
          activator="parent"
          v-model="removeDialog"
          max-width="500"
        >
          <VCard>
            <VToolbar>
              <VToolbarTitle>
                <VIcon>mdi-delete</VIcon>
                Pool löschen
              </VToolbarTitle>
            </VToolbar>

            <VCardText>
              <p>
                Möchtest du den Pool wirklich löschen?
              </p>
            </VCardText>

            <VCardActions>
              <VSpacer />
              <VBtn
                @click="removeDialog = false"
              >
                Abbrechen
              </VBtn>
              <VBtn
                color="error"
                @click="admin.removePool(pool)"
              >
                Löschen
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VBtn>
    </VToolbar>

    <VCardText>
      <VList rounded nav>
        <div class="mb-2" v-if="options.length">
          <VListItem
            v-for="(option, i) in options"
            :key="i"
          >
            <div class="d-flex align-center">
              <span class="flex-grow-1">
                {{ game.voteOptions.find(o => o.id === option)?.title }} (ID: {{ option }})
              </span>
              <VBtn
                @click="admin.removeOptionFromPool(pool, option)"
                variant="text"
                color="error"
                size="small"
                icon
              >
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </div>
          </VListItem>
        </div>

        <VListItem @click="" border>
          <VListItemTitle>
            <VIcon>mdi-plus</VIcon>
            <span class="text-body-1">
              Option hinzufügen
            </span>
          </VListItemTitle>

          <VMenu
            activator="parent"
            label="Option"
            class="mr-3"
            variant="outlined"
            density="compact"
          >
            <VList>
              <VListItem
                v-for="(option, i) in game.voteOptions.filter(o => !options.includes(o.id))"
                :key="i"
                @click="admin.addOptionToPool(pool, option.id)"
              >
                <template #prepend>
                  <VAvatar rounded color="background">
                    <VImg v-if="option.image && game.getAsset(option.image)?.content" :src="game.getAsset(option.image)?.content" />
                    <VIcon v-else>mdi-image</VIcon>
                  </VAvatar>
                </template>

                <VListItemTitle>
                  {{ option.title }} (ID: {{ option.id }})
                </VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<script lang="ts" setup>
import { useGameManager } from '@/store/gameManager';
import { useAdmin } from '../../store/admin/index';
import { ref } from 'vue';

const admin = useAdmin()
const game = useGameManager()

defineProps<{
  pool: string,
  options: string[]
}>()

const removeDialog = ref(false)
</script>