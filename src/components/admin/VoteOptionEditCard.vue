<template>
  <VForm @submit.prevent="submit">
    <VCard>
      <VToolbar>
        <VToolbarTitle>
          <VIcon>mdi-vote</VIcon>
          {{ option ? 'Umfrageoption bearbeiten' : 'Umfrageoption hinzufügen' }}
        </VToolbarTitle>
        <VBtn @click="emit('close')" icon>
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>

      <VCardText>
        <template v-if="option">
          Umfrageoption-ID: {{ id }}
        </template>
        <VTextField
          v-else
          v-model="id"
          label="ID"
          required
          variant="outlined"
          :rules="[
            (v: string) => !!v || 'ID darf nicht leer sein',
          ]"
        />

        <VTextField
          class="mb-4 mt-4"
          v-model="title"
          label="Titel"
          variant="outlined"
          :rules="[
            (v: string) => !!v || 'Titel darf nicht leer sein',
          ]"
        />

        <AssetSelect
          v-model="image"
          label="Bild (aus Shared Assets)"
          :assets="admin.assets.shared"
        />

        <VTextarea
          v-model="description"
          label="Beschreibung"
          variant="outlined"
        />

        <VDivider class="mt-4 mb-4">
          Wenn diese Option gewählt wird
        </VDivider>

        <VCheckbox
          v-model="removeSelf"
          label="Entfernt sich aus dem Pool"
          hide-details
        />

        <VList
          bg-color="background"
          rounded
          nav
          density="compact"
          class="my-4"
          style="margin: 0 -.5rem;"
        >
          <VListItem>
            <VListItemTitle class="text-body-1">
              Hinweise zum freischalten
            </VListItemTitle>
          </VListItem>

          <VListItem
            v-for="(_, i) in availableClues"
            :key="i"
          >
            <div class="d-flex align-center pt-2">
              <VSelect
                density="compact"
                variant="outlined"
                v-model="availableClues[i]"
                :items="clues.map(clue => ({
                  title: `${clue.title} (ID: ${clue.id})`,
                  value: clue.id
                }))"
                label="Hinweis"
                outlined
                hide-details
                class="mr-3"
              />
              <VBtn
                icon
                @click="availableClues.splice(i, 1)"
                flat
                color="error"
                variant="tonal"
                size="small"
              >
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </div>
          </VListItem>
          <VListItem
            @click="availableClues.push(undefined)"
          >
            <VListItemTitle>
              <VIcon>mdi-plus</VIcon>
              <span class="text-body-1">
                Hinweis hinzufügen
              </span>
            </VListItemTitle>
          </VListItem>
        </VList>

        <VList
          bg-color="background"
          rounded
          nav
          density="compact"
          style="margin: 0 -.5rem;"
          class="my-4"
        >
          <VListItem>
            <VListItemTitle class="text-body-1">
              Umfrageoptionen zum hinzufügen
            </VListItemTitle>
          </VListItem>

          <VListItem
            v-for="(_, i) in flattendOptions"
            :key="i"
          >
            <div class="d-flex">
              <div class="pt-2 flex-grow-1">
                <VTextField
                  v-model="flattendOptions[i].pool"
                  @update:model-value="(value: string) => {
                    const newOptions = [...flattendOptions]
                    newOptions[i].pool = value
                    flattendOptions = newOptions
                  }"
                  label="Pool"
                  outlined
                  hide-details
                  class="mr-3 mb-4"
                  variant="outlined"
                  density="compact"
                />
                <VSelect
                  v-model="flattendOptions[i].option"
                  :items="game.voteOptions.map(option => ({
                    title: `${option.title} (ID: ${option.id})`,
                    value: option.id
                  }))"
                  label="Option"
                  outlined
                  hide-details
                  class="mr-3"
                  variant="outlined"
                  density="compact"
                />
              </div>
              <VBtn
                icon
                @click="flattendOptions.splice(i, 1)"
                flat
                color="error"
                variant="tonal"
                size="small"
              >
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </div>
          </VListItem>
          <VListItem
            @click="flattendOptions.push({ pool: '', option: '' })"
          >
            <VListItemTitle>
              <VIcon>mdi-plus</VIcon>
              <span class="text-body-1">
                Hinweis hinzufügen
              </span>
            </VListItemTitle>
          </VListItem>
        </VList>

        <AssetSelect
          v-model="media"
          label="Spielt Medien (aus Board/Shared Assets)"
          :assets="[
            ...admin.assets.shared,
            ...admin.assets.board
          ]"
        />

        <p v-if="error" class="text-error">
          {{ error }}
        </p>
      </VCardText>

      <VCardActions>
        <VBtn
          v-if="option"
          color="error"
        >
          Löschen

          <VDialog
            activator="parent"
            v-model="removeDialog"
            max-width="500"
          >
            <VCard>
              <VToolbar color="transparent">
                <VToolbarTitle>
                  Umfrageoption löschen
                </VToolbarTitle>
                <VBtn icon @click="removeDialog = false">
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </VToolbar>

              <VCardText>
                Bist du sicher, dass du die Umfrageoption löschen möchtest?
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
                  @click="emit('remove')"
                >
                  Löschen
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>
        </VBtn>
        <VBtn color="primary" type="submit" :loading="loading">
          {{ option ? 'Speichern' : 'Hinzufügen' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VForm>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { VoteOption } from '../../../shared/vote';
import { idGen } from '../../../shared/random';
import { clues } from '../../../shared/assets/clues';
import { useAdmin } from '@/store/admin/index';
import AssetSelect from './AssetSelect.vue';
import { useGameManager } from '@/store/gameManager';

const admin = useAdmin()
const game = useGameManager()

const props = defineProps<{
  option?: VoteOption,
  submitFn: (option: VoteOption) => Promise<{
    success: boolean
    message?: string
  }>
}>()

const emit = defineEmits<{
  'close': []
  'remove': []
}>()

const removeDialog = ref(false)

const id = ref(props.option?.id ?? idGen())
const title = ref(props.option?.title ?? '')
const image = ref(props.option?.image)
const description = ref(props.option?.description ?? '')

const removeSelf = ref(props.option?.removeSelf ?? true)
const availableClues = ref<(string | undefined)[]>(props.option?.availableClues ?? [])

const options = computed(() => {
  const res: Record<string, string[]> = {}

  for (const { pool, option } of flattendOptions.value) {
    if (pool === '' || option === '') {
      continue
    }

    if (!res[pool]) {
      res[pool] = []
    }

    res[pool].push(option)
  }

  return res
})
const flattendOptions = ref<{
  pool: string,
  option: string
}[]>(Object.entries(props.option?.options ?? {})
  .map(([pool, options]) => options.map(option => ({
    pool,
    option
  })))
  .flat() ?? [])

const media = ref(props.option?.media)

const loading = ref(false)
const error = ref<string | null>(null)

async function submit () {
  loading.value = true

  const res = await props.submitFn({
    id: id.value,
    title: title.value,
    image: image.value,
    description: description.value.length ? description.value : undefined,
    removeSelf: removeSelf.value,
    availableClues: availableClues.value.filter(clue => !!clue) as string[],
    options: options.value,
    media: media.value
  })

  if (res.success) {
    emit('close')
  } else {
    error.value = res.message!
  }

  loading.value = false
}
</script>

<style lang="scss" scoped>
.list-move {
  transition: transform 0.3s;
}
</style>