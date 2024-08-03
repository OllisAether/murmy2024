<template>
  <VCard flat color="grey-darken-3">
    <VToolbar color="transparent" density="compact">
      <VBtn
        variant="flat"
        icon
        :color="admin.currentPlaybackIndex === index ? 'primary' : 'grey-darken-2'"
        size="2rem"
        class="mr-2 ml-4"
        @click="play"
      >
        <VIcon v-if="admin.currentPlaybackIndex !== index">mdi-circle-double</VIcon>
        <VIcon v-else-if="admin.currentCueIndex === -1">mdi-motion-play-outline</VIcon>
        <VIcon v-else>mdi-skip-next</VIcon>
      </VBtn>
      <VChip
        :color="playback.trigger === 'auto' ? 'secondary' : 'grey-darken-2'"
        variant="flat"
        :size="0"
        class="pa-1 mr-2"
      >
        <VIcon>mdi-flag-triangle</VIcon>
      </VChip>

      <VToolbarTitle class="mx-0">
        {{ playback.name }}
      </VToolbarTitle>

      <VChip
        :color="admin.currentPlaybackIndex === index ? 'primary' : 'grey-darken-2'"
        variant="flat"
        class="mr-2"
        size="small"
      >
        <template v-if="admin.currentPlaybackIndex === index">
          {{ admin.currentCueIndex + 1 }}
        </template>
        <template v-else>0</template>
        / {{ playback.cues.length }}
      </VChip>
      <VBtn
        icon
        class="mr-2"
        size="3rem"
        @click="showDetails = !showDetails"
      >
        <VIcon>{{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</VIcon>
      </VBtn>
    </VToolbar>


    <div class="d-flex flex-wrap px-4 mb-1" v-if="Object.keys(playback.fields).length">
      <VChip
        v-for="(value, key) in playback.fields"
        :key="key"
        class="mr-2 mb-1"
        size="small"
        >
        {{ key }}: {{ JSON.stringify(value).length > 15 ? JSON.stringify(value).slice(0, 15) + '...' : JSON.stringify(value) }}
      </VChip>
    </div>

    <VExpandTransition>
      <div v-if="showDetails" class="bg-background">
        <VCardText>
          <VBtnToggle
            v-model="trigger"
            :mandatory="true"
            class="mb-4 w-100"
            variant="outlined"
            color="primary"
          >
            <VBtn class="flex-grow-1" value="auto">
              <VIcon class="mr-2">mdi-motion-play-outline</VIcon>
              Automatisch
            </VBtn>
            <VBtn class="flex-grow-1" value="manual">
              <VIcon class="mr-2">mdi-hand-back-left</VIcon>
              Manuell
            </VBtn>
          </VBtnToggle>

          <VList class="mb-4" rounded>
            <VListItem
              v-for="(_, i) in fieldEntries"
              :key="i"
            >
                <div class="d-flex align-center">
                <VTextField
                  v-model="fieldEntries[i][0]"
                  label="Feldname"
                  class="mr-2"
                  hide-details
                  autocomplete="off"
                  autocapitalize="off"
                  autocorrect="off"
                />
                <VTextField
                  v-model="fieldEntries[i][1]"
                  label="Wert (JSON)"
                  hide-details
                  autocomplete="off"
                  autocapitalize="off"
                  autocorrect="off"
                  
                />
                <VBtn
                  icon
                  variant="tonal"
                  class="ml-2"
                  size="small"
                  @click="removeField(i)"
                >
                  <VIcon>mdi-minus</VIcon>
                </VBtn>
              </div>
            </VListItem>

            <VListItem v-if="error.length > 0">
              <VAlert
                v-for="e in error"
                :key="e"
                type="error"
                density="compact"
                variant="outlined"
              >
                {{ e }}
              </VAlert>
            </VListItem>

            <VListItem>
              <div class="d-flex flex-wrap">
                <VBtn
                  variant="tonal"
                  @click="addField"
                >
                  <VIcon>mdi-plus</VIcon>
                  Feld hinzufügen
                </VBtn>
                <div class="d-flex flex-grow-1">
                  <VSpacer />
                  <VBtn
                    variant="tonal"
                    color="error"
                    @click="resetFields"
                    class="mr-2"
                    :disabled="!changedFields"
                  >
                    <VIcon>mdi-close</VIcon>
                    Zurücksetzen
                  </VBtn>
                  <VBtn
                    variant="tonal"
                    color="primary"
                    :disabled="error.length > 0 || !changedFields"
                    @click="applyFields"
                  >
                    <VIcon>mdi-check</VIcon>
                    Übernehmen
                  </VBtn>
                </div>
              </div>
            </VListItem>
          </VList>

          <CueCard
            v-for="(cue, i) in playback.cues"
            :key="i"
            :playback="playback"
            :index="i"
            :cue="cue"
            :active="admin.delayedCurrentPlaybackIndex === index && admin.delayedCurrentCueIndex === i"
          />
        </VCardText>
      </div>
    </VExpandTransition>
  </VCard>
</template>

<script setup lang="ts">
import { Playback } from '@/../shared/playback/Playback';
import CueCard from './CueCard.vue';
import { useAdmin } from '@/store/admin/index';
import { computed, ref, watch } from 'vue';
import { JsonContent } from '../../../../shared/json';

const admin = useAdmin()
const showDetails = ref(false)

const props = defineProps<{
  index: number
  playback: Playback
}>()

const trigger = computed({
  get: () => props.playback.trigger,
  set: (value: 'auto' | 'manual') => {
    admin.setPlaybackTrigger(props.index, value)
  }
})

function play () {
  if (admin.currentPlaybackIndex !== props.index) {
    admin.setCurrentPlayback(props.index)
  } else {
    admin.nextCue()
  }
}

const fieldEntries = ref<[string, string][]>(Object.entries(props.playback.fields).map(([key, value]) => [key, JSON.stringify(value)]) as [string, string][])
watch(() => props.playback.fields, () => {
  fieldEntries.value = Object.entries(props.playback.fields).map(([key, value]) => [key, JSON.stringify(value)]) as [string, string][]
}, { deep: true })

const changedFields = computed(() => {
  const keys = Object.keys(props.playback.fields)

  if (keys.length !== fieldEntries.value.length) {
    return true
  }

  for (let i = 0; i < keys.length; i++) {
    if (fieldEntries.value[i] === undefined) {
      return true
    }

    if (keys[i] !== fieldEntries.value[i][0] || JSON.stringify(props.playback.fields[keys[i]]) !== fieldEntries.value[i][1]) {
      return true
    }
  }


  return false
})

const error = ref<string[]>([])
const computedFields = ref<Record<string, JsonContent>>({})

watch(fieldEntries, () => {
  error.value = []

  const fields: Record<string, JsonContent> = {}
  const fieldKeys = fieldEntries.value.map(([key]) => key)
  const fieldValues = fieldEntries.value.map(([_, value]) => value)

  fieldKeys.forEach((key, i) => {
    if (key.match(/[^a-zA-Z0-9_]/) || key === '') {
      error.value.push(`Der Feldname "${key}" enthält ungültige Zeichen`)
      return
    }

    if (fieldKeys.indexOf(key) !== i) {
      error.value.push(`Der Feldname "${key}" ist doppelt vorhanden`)
      return
    }

    try {
      fields[key] = JSON.parse(fieldValues[i]
        .replace(/[\u2014]/g, "--")
        .replace(/[\u2022]/g, "*")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"'))
    } catch (e) {
      error.value.push(`Fehler beim Parsen des Wertes für das Feld "${key}"`)
    }
  })

  computedFields.value = fields
}, { deep: true, immediate: true })

function addField () {
  fieldEntries.value.push(['', ''])
}

function removeField (index: number) {
  fieldEntries.value.splice(index, 1)
}

function resetFields () {
  fieldEntries.value = Object.entries(props.playback.fields).map(([key, value]) => [key, JSON.stringify(value)]) as [string, string][]
}

function applyFields () {
  if (error.value.length > 0 || !changedFields.value) {
    return
  }

  admin.setPlaybackFields(props.index, computedFields.value)
}
</script>