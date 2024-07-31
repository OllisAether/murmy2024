<template>
  <VSelect
    v-model="value"
    @update:model-value="(val: string) => {
      value = value
      emit('update:modelValue', val)
    }"
    :label="label"
    :clearable="nullable !== undefined"
    :items="assets.map(asset => ({
      title: `${asset.name}`,
      value: asset.name
    }))"
    variant="outlined"
    :density="density"
  >
    <template #prepend>
      <VAvatar rounded color="background">
        <VImg v-if="imageAsset" :src="imageAsset?.content" />
        <VIcon v-else>mdi-image</VIcon>

        <VDialog
          v-if="imageAsset?.content"
          activator="parent"
          v-model="imageDialog"
          max-width="600"
          scrollable
        >
          <VCard>
            <VToolbar color="transparent">
              <VToolbarTitle>
                {{ imageAsset?.name }}
              </VToolbarTitle>
              <VBtn icon @click="imageDialog = false">
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </VToolbar>

            <VCardText>
              <VCard color="background">
                <VCardTitle>
                  Metadaten
                </VCardTitle>
                <VCardText>
                  <pre>{{ imageAsset?.metadata }}</pre>
                </VCardText>
              </VCard>
            </VCardText>

            <VImg
              :src="imageAsset?.content"
              contain
            />
          </VCard>
        </VDialog>
      </VAvatar>
    </template>

    <template #item="{ item, props }">
      <VListItem v-bind="props" title="">
        <template #prepend>
          <VAvatar rounded color="background">
            <VImg
              v-if="
                game.getAsset(item.value)?.content &&
                game.getAsset(item.value)?.metadata?.mime?.startsWith?.('image')"
              :src="game.getAsset(item.value)?.content"
            />
            <VIcon v-else>mdi-image-off</VIcon>
          </VAvatar>
        </template>
        
        <VListItemTitle>
          {{ item.title }}
        </VListItemTitle>
      </VListItem>
    </template>
  </VSelect>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useGameManager } from '@/store/gameManager'
import { Asset } from '@/../shared/asset'

const game = useGameManager()

const props = defineProps<{
  modelValue: string | undefined,
  assets: Asset[],
  nullable?: boolean,
  label?: string,
  density?: null | 'default' | 'comfortable' | 'compact'
}>()

console.log(props)

const emit = defineEmits(['update:modelValue'])

const value = ref(props.modelValue)
watch(() => props.modelValue, (val) => value.value = val)

const imageDialog = ref(false)
const imageAsset = computed(() => value.value ? game.getAsset(value.value) : null)
</script>