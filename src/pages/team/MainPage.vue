<template>
  <div class="main-page">
    <RouterView v-slot="{ Component }">
      <VFadeTransition>
        <component :is="Component" />
      </VFadeTransition>
    </RouterView>

    <div class="controls">
      <VBtn
        v-if="!auth.team?.active"
        icon
        variant="text"
        color="#fff8"
      >
        <VIcon>mdi-cancel</VIcon>

        <VOverlay
          activator="parent"
          width="400"
          location-strategy="connected"
          :scrim="false"
          location="bottom"
        >
          <template #="{ isActive }">
            <VCard rounded="lg">
              <VToolbar color="transparent">
                <VToolbarTitle>
                  <VIcon>mdi-cancel</VIcon>
                  Passives Team
                </VToolbarTitle>
                <VBtn icon @click="isActive.value = false">
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </VToolbar>

              <VCardText style="font-size: 1rem;">
                <p class="mb-3">
                  Euer Team ist <em>passiv</em> und hat nur eingeschränkte Funktionen.
                </p>

                <p>
                  Ihr könnt nicht an Umfragen teilnehmen oder den Lösungsbogen einreichen.
                </p>
              </VCardText>
            </VCard>
          </template>
        </VOverlay>
      </VBtn>
      <VBtn
        icon
        variant="text"
        :color="game.wakelock.isActive
          ? '#fff8'
          : (game.wakelockShouldBeActive
            ? '#df507b'
            : '#fff8')"
      >
        <template v-if="game.wakelock.isActive">
          <VIcon>mdi-eye-lock</VIcon>
        </template>
        <template v-else-if="game.wakelockShouldBeActive">
          <VIcon>mdi-eye-lock-open</VIcon>!
        </template>
        <template v-else>
          <VIcon>mdi-eye-lock-open</VIcon>
        </template>

        <VOverlay
          activator="parent"
          width="400"
          location-strategy="connected"
          :scrim="false"
          location="bottom"
        >
          <template #="{ isActive }">
            <VCard rounded="lg">
              <VToolbar color="transparent">
                <VToolbarTitle>
                  <template v-if="game.wakelock.isActive">
                    <VIcon>mdi-eye-lock</VIcon>
                  </template>
                  <template v-else>
                    <VIcon>mdi-eye-lock-open</VIcon>
                  </template>
                  Bildschirmsperre
                </VToolbarTitle>
                <VBtn icon @click="isActive.value = false">
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </VToolbar>

              <VCardText style="font-size: 1rem;">
                <template v-if="!game.wakelock.isSupported && !game.wakelock.isActive">
                  <p class="mb-3" v-if="!game.wakelock.isSupported">
                    Die Bildschirmsperre konnte nicht aktiviert werden, da der Browser dies nicht unterstützt.
                  </p>
                  <p class="mb-3" v-else-if="!game.wakelock.isActive">
                    Die Bildschirmsperre konnte nicht aktiviert werden.
                  </p>
                  <p class="mb-3">
                    Es kann sein, dass der Bildschirm während des Spiels ausgeht.
                  </p>
                  <p>
                    Um dies zu verhindern, könnt ihr den Bildschirmtimeout in den Einstellungen eures Geräts deaktivieren.
                  </p>
                </template>

                <template v-else-if="!game.wakelock.isActive && game.wakelockShouldBeActive">
                  <p class="mb-3">
                    Die Bildschirmsperre ist deaktiviert, sollte aber aktiviert sein.
                  </p>
                  <p>
                    Um die Bildschirmsperre manuell zu aktivieren, klickt auf den Button unten.
                  </p>
                </template>

                <template v-else-if="game.wakelock.isActive">
                  <p class="mb-3">
                    Die Bildschirmsperre ist <em><b>aktiviert</b></em>.
                  </p>

                  <p>
                    Der Bildschirm wird während des Spiels nicht ausgehen.
                  </p>
                </template>

                <template v-else>
                  <p class="mb-3">
                    Die Bildschirmsperre ist <em><b>deaktiviert</b></em>.
                  </p>

                  <p>
                    Der Bildschirm kann während des Spiels ausgehen.
                  </p>
                </template>
              </VCardText>

              <VCardActions v-if="game.wakelock.isSupported && !game.wakelock.isActive && game.wakelockShouldBeActive">
                <VSpacer />
                <VBtn @click="game.wakelockShouldBeActive && game.wakelock.request('screen')">
                  Aktivieren
                </VBtn>
              </VCardActions>
            </VCard>
          </template>
        </VOverlay>
      </VBtn>

      <Btn
        v-if="game.canFullscreen"
        class="fullscreen-button"
        @click="game.toggleFullscreen"
        square
      >
        <VIcon>{{ game.isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</VIcon>
      </Btn>
      <Btn
        class="help-button"
        square
      >
        <VIcon size="small">mdi-account-question</VIcon>

        <VDialog activator="parent" v-model="helpDialog" max-width="500" transition="scale-transition">
          <VCard color="transparent" elevation="0" style="overflow: visible;">
            <SkewBox
              style="
                position: absolute;
                inset: -1rem -2rem;
              "
              :rounded-corners="8"
              :skew="5"
            />

            <VToolbar color="transparent">
              <VToolbarTitle>
                <VIcon class="mr-2">mdi-account-question</VIcon>
                Hilfe anfordern
              </VToolbarTitle>

              <VBtn icon @click="helpDialog = false" :rounded="false" :ripple="false">
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </VToolbar>
            <VCardText style="position: relative;">
              <p class="mb-2">
                Falls euch das Orakel nicht weiterhelfen kann, z. B. bei technischen Problemen, könnt ihr hier die liebe <b>Technik-Crew</b>💗 um Hilfe bitten.
              </p>
              <p class="mb-8">
                <b>
                  Wir werden euch keine Hinweise zum Spiel geben!
                </b>
              </p>
              <Btn
                class="w-100 mb-4"
                @click="reload()"
              >
                Seite neu laden
              </Btn>
              <Btn
                color="#A23946"
                class="w-100"
                @click="help"
                :loading="helpLoading"
              >
                Hilfe anfordern
              </Btn>
              <p
                v-if="helpMessage"
                :class="{
                  'mt-7': true,
                  'text-error': helpIsError,
                  'text-success': !helpIsError
                }"
              >
                {{ helpMessage }}
              </p>
            </VCardText>
          </VCard>
        </VDialog>
      </Btn>
    </div>

    <VDialog v-model="logoutDialog" max-width="300">
      <VCard>
        <VToolbar>
          <VToolbarTitle>
            <VIcon>mdi-logout</VIcon>
            Logout
          </VToolbarTitle>
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
            autofocus
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
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { useAuthManager } from '../../store/authManager';
import { onBeforeMount, ref, watch, onUnmounted } from 'vue';
import { useGameManager } from '../../store/gameManager';
// import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import Btn from '@/components/Btn.vue';
import SkewBox from '@/components/SkewBox.vue';
import { VOverlay } from 'vuetify/components';
import { VBtn } from 'vuetify/components/VBtn';
import { preventGestures } from '@/main';

// const display = useDisplay()

const router = useRouter()
const auth = useAuthManager()
const game = useGameManager()

const logoutDialog = ref(false)
const helpDialog = ref(false)

function reload () {
  location.reload()
}

watch(helpDialog, () => {
  preventGestures.value = !helpDialog.value
})

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

watch(() => game.phase.type, () => {
  router.replace('/team')
})

onBeforeMount(() => {
  game.wakelockShouldBeActive = true
})

onUnmounted(() => {
  game.wakelockShouldBeActive = false
})

const helpIsError = ref(false)
const helpMessage = ref('')
const helpLoading = ref(false)

watch(helpDialog, () => {
  helpIsError.value = false
  helpMessage.value = ''
})

async function help () {
  helpLoading.value = true
  const res = await game.getHelp()
  
  if (res.success) {
    helpIsError.value = false
    helpMessage.value = 'Hilfe wurde angefordert!'
  } else {
    helpIsError.value = true
    helpMessage.value = res.message!
  }
  helpLoading.value = false
}
</script>

<style scoped lang="scss">
@use '@/scss/vars' as *;

.controls {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  
  display: flex;
  flex-flow: row nowrap;
  gap: .5rem;

  @media screen and (max-width: 768px) {
    top: .5rem;
    right: .5rem;
    transform-origin: top right;
    transform: scale(0.75);
  }
}
</style>