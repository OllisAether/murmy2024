<template>
  <RouterView />

  <VBtn
    class="help-button"
    icon
  >
    <VIcon>mdi-account-question</VIcon>

    <VDialog activator="parent" v-model="helpDialog" max-width="500">
      <VCard>
        <VToolbar>
          <VToolbarTitle>
            <VIcon>mdi-account-question</VIcon>
            Hilfe anfordern
          </VToolbarTitle>
          <VSpacer />
          <VBtn icon @click="helpDialog = false">
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </VToolbar>

        <VCardText>
          <p class="mb-2">
            Falls ihr <b>technische Probleme</b> habt, könnt ihr hier die Spielleitung zu eurem Tisch rufen.
          </p>

          <p class="mb-2">
            <b>
              Wir werden dir keine Hinweise zum Spiel geben!
            </b>
          </p>

          <VBtn
            variant="tonal"
            color="primary"
            class="w-100"
            @click="help"
            :loading="helpLoading"
          >
            Hilfe anfordern
          </VBtn>

          <p
            v-if="helpMessage"
            :class="{
              'mt-2': true,
              'text-error': helpIsError,
              'text-success': !helpIsError
            }"
          >
            {{ helpMessage }}
          </p>
        </VCardText>
      </VCard>
    </VDialog>
  </VBtn>

  <VDialog v-model="logoutDialog" max-width="300">
    <VCard>
      <VToolbar>
        <VToolbarTitle>
          <VIcon>mdi-logout</VIcon>
          Logout
        </VToolbarTitle>
        <VSpacer />
        <VBtn icon @click="logoutDialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>

      <VCardText>
        <p>
          Team: {{ auth.team?.name }}<br>
          Team-ID: {{ auth.team?.id }}
        </p>

        <VOtpInput
          v-model="otp"
          :length="4"
          :type="'number'"
          :error="!!logoutError"
        />

        <p class="mb-2 text-error">
          {{ logoutError }}
        </p>

        <VBtn
          :disabled="otp.length !== 4"
          variant="tonal"
          color="error"
          @click="logout"
          class="w-100"
        >
          Logout
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { useAuthManager } from '../../store/authManager';
import { onMounted, ref, watch } from 'vue';
import { useGameManager } from '../../store/gameManager';

const auth = useAuthManager()
const game = useGameManager()

const logoutDialog = ref(false)
const helpDialog = ref(false)

const logoutOtp = import.meta.env.VITE_TEAM_LOGOUT_PASSCODE ?? '0000'
const otp = ref('')
watch(logoutDialog, () => {
  otp.value = ''
})

const cornerPadding = 300
const sequence = '010232'
let typedSequence = ''
let clearSequenceTimeout: number
useEventListener('pointerdown', (event) => {
  if (logoutDialog.value) return

  let corner: string

  if (event.clientX < cornerPadding && event.clientY < cornerPadding) {
    corner = '0'
  } else if (event.clientX > window.innerWidth - cornerPadding && event.clientY < cornerPadding) {
    corner = '1'
  } else if (event.clientX < cornerPadding && event.clientY > window.innerHeight - cornerPadding) {
    corner = '2'
  } else if (event.clientX > window.innerWidth - cornerPadding && event.clientY > window.innerHeight - cornerPadding) {
    corner = '3'
  } else {
    typedSequence = ''
    return
  }
  
  // console.log('Click:', event.clientX, event.clientY, corner)

  typedSequence += corner
  typedSequence = typedSequence.slice(-sequence.length)

  if (typedSequence === sequence) {
    window.addEventListener('pointerup', () => {
      logoutDialog.value = true
    }, { once: true })
  }

  // console.log('Sequence:', sequenceIndex, corner)

  clearTimeout(clearSequenceTimeout)
  clearSequenceTimeout = setTimeout(() => {
    typedSequence = ''
  }, 1000) as unknown as number
})

useEventListener('keydown', (event) => {
  if (logoutDialog.value) return

  if (event.key === 'L' && event.ctrlKey && event.shiftKey) {
    logoutDialog.value = true
  }
})

const logoutError = ref('')
function logout () {
  if (otp.value !== logoutOtp) {
    logoutError.value = 'Ungültiger Code'
    return
  }

  auth.logout()
}

onMounted(() => {
  useGameManager().initGameManager()

  return () => {
    useGameManager().deinitGameManager()
  }
})

const helpIsError = ref(false)
const helpMessage = ref('')
const helpLoading = ref(false)

watch(helpDialog, () => {
  helpIsError.value = false
  helpMessage.value = ''
})

async function help () {
  helpIsError.value = false
  helpMessage.value = ''

  helpLoading.value = true
  const res = await game.getHelp()
  console.log(res)

  if (res.success) {
    helpMessage.value = 'Hilfe wurde angefordert!'
  } else {
    helpIsError.value = true
    helpMessage.value = res.message!
  }
  helpLoading.value = false
}
</script>

<style scoped lang="scss">
.help-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
}
</style>