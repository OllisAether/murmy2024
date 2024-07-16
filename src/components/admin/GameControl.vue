<template>
  <VCard>
    <VCardText>
      <VLabel class="d-flex">
        Timer
        <VSpacer />

        <template v-if="game.timer.state !== 'stopped'">
          {{ remainingTime }}
        </template>

        <VBtn
          :disabled="timeOverride === null"
          @click="timeOverride = null"
          icon
          size="30"
          variant="text"
          class="ml-2"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
        <VBtn
          :disabled="timeOverride === null"
          @click="applyTimeOverride"
          icon
          size="30"
          variant="text"
          class="ml-2"
        >
          <VIcon>mdi-check</VIcon>
        </VBtn>
        <VBtn
          :disabled="timerState === null"
          icon
          size="30"
          variant="text"
          class="ml-2"
        >
          <VIcon>mdi-timer-edit</VIcon>

          <VDialog v-model="timerDurationEditDialog" max-width="400" activator="parent">
            <VCard>
              <VToolbar>
                <VToolbarTitle>
                  Timerdauer bearbeiten
                </VToolbarTitle>
                <VBtn icon @click="timerDurationEditDialog = false">
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </VToolbar>
              <VCardText>
                <DurationTextField v-model="durationOverride" />

                <VCheckbox
                  v-model="restartOnSave"
                  label="Timer neu starten"
                />
              </VCardText>
              <VCardActions>
                <VBtn
                  @click="applyDurationOverride(); timerDurationEditDialog = false"
                  color="primary"
                >
                  Speichern
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>
        </VBtn>
      </VLabel>
      <VSlider
        v-model="timeSlider"
        :max="game.timer.duration"
        :min="0"
        :step="timeOverride !== null ? 1000 : 100"
        :disabled="timerState === null"
        color="primary"
        :thumb-size="timeOverride !== null ? 16 : 10"
        class="mt-4 no-transition"
      />
      <VBtnToggle
        v-model="timerState"
        :disabled="timerState === null"
        :mandatory="true"
        class="mb-4 w-100"
        variant="outlined"
        color="primary"
      >
        <VBtn class="flex-grow-1" value="running">
          <VIcon class="mr-2">mdi-play</VIcon>
          Laufend
        </VBtn>
        <VBtn class="flex-grow-1" value="paused">
          <VIcon class="mr-2">mdi-pause</VIcon>
          Pause
        </VBtn>
      </VBtnToggle>


      <VLabel class="mb-2 mt-2">
        Record-Steuerung
      </VLabel>

      <VBtnGroup
        class="w-100"
        divided
        variant="outlined"
        color="primary"
      >
      <VBtn
        :disabled="game.timer.state !== 'stopped'"
        class="flex-grow-1"
        @click="admin.startRecord"
      >
        <VIcon>mdi-play-box-outline</VIcon>
      </VBtn>
        <VBtn
          class="flex-grow-1"
          @click="admin.stopRecord"
        >
          <VIcon>mdi-stop-circle-outline</VIcon>
        </VBtn>
        <VBtn
          class="flex-grow-1"
          @click="admin.skipRecord"
        >
          <VIcon>mdi-skip-next</VIcon>
        </VBtn>
      </VBtnGroup>

      <VLabel class="mb-2 mt-4">
        Cue-Steuerung
      </VLabel>

      <VBtnGroup
        class="w-100"
        divided
        variant="outlined"
        color="primary"
      >
        <VBtn
          class="flex-grow-1"
          @click="admin.stopCue"
        >
          <VIcon>mdi-stop-circle-outline</VIcon>
        </VBtn>
        <VBtn
          class="flex-grow-1"
          @click="admin.skipCue"
        >
          <VIcon>mdi-skip-next</VIcon>
        </VBtn>
      </VBtnGroup>
    </VCardText>
  </VCard>
</template>

<script lang="ts" setup>
import { useAdmin } from '@/store/admin';
import { useGameManager } from '@/store/gameManager';
import { useWsClient } from '@/store/wsClient';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DurationTextField from './DurationTextField.vue'

const admin = useAdmin()
const game = useGameManager()
const ws = useWsClient()

const timerState = computed({
  get: () => game.timer.state === 'stopped' ? null : game.timer.state,
  set: (value) => {
    if (value === 'running') {
      admin.resumeTimer()
    } else if (value === 'paused') {
      admin.pauseTimer()
    }
  }
})

const timerDurationEditDialog = ref(false)
const durationOverride = ref<number | null>(null)
watch(timerDurationEditDialog, (value) => {
  if (!value) {
    durationOverride.value = null
    restartOnSave.value = false
  } else {
    durationOverride.value = game.timer.duration
  }
})

const restartOnSave = ref(false)
function applyDurationOverride () {
  if (durationOverride.value !== null) {
    admin.setDuration(durationOverride.value)
    
    if (restartOnSave.value) {
      admin.setTime(-1000)
    }
  }
}

const timeOverride = ref<number | null>(null)
const timeSlider = computed({
  get: () => {
    if (timeOverride.value !== null) {
      return timeOverride.value
    }

    if (game.timer.state === 'stopped') {
      return 0
    }

    return game.timer.currentTime
  },
  set: (value) => {
    timeOverride.value = value
  }
})

const remainingTime = computed(() => {
  const remaining = (game.timer.duration - timeSlider.value) / 1000
  const minutes = Math.floor(remaining / 60)
  const seconds = Math.floor(remaining % 60)

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

function applyTimeOverride () {
  if (timeOverride.value !== null) {
    admin.setTime(timeOverride.value)
  }
}

onMounted(() => {
  const off = ws.onAction('timer', () => {
    timeOverride.value = null
  })

  onBeforeUnmount(() => {
    off()
  })
})
</script>