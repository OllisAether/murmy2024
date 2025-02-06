<template>
  <VDialog :scrim="false" scrollable v-model="gamedeck" persistent no-click-animation transition="slide-x-transition" content-class="gamedeck">
    <VCard width="500" :style="{
      marginLeft: gamedeckPosition === 'l' ? '0' : 'auto',
    }">
      <VToolbar>
        <VToolbarTitle>
          <VIcon>mdi-cog</VIcon>
          Debug
        </VToolbarTitle>
        <VBtn icon @click="gamedeckPosition = gamedeckPosition === 'l' ? 'r' : 'l'">
          <VIcon>{{ 
            gamedeckPosition === 'l'
              ? 'mdi-arrow-right'
              : 'mdi-arrow-left'
            }}</VIcon>
        </VBtn>
        <VBtn icon @click="gamedeck = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>

      <VCardText>
        <GameControl color="surface-light" />

        <template
          v-for="(playback, i) in Game.get().cueManager.getPlaybacks()"
          :key="i"
        >
          <div v-if="playback.divider" class="mt-4 mb-2">
            <VDivider>
              {{ playback.divider }}
            </VDivider>
          </div>

          <PlaybackCard
            v-else
            :playback="(playback as Playback)"
            :index="Game.get().cueManager.getPlaybacks().filter(p => !p.divider).indexOf(playback)"
            :class="{
              'mt-1': i !== 0,
            }"
          />
        </template>
      </VCardText>
    </VCard>
  </VDialog>

  <div class="interact-confirm" v-if="!game.interacted && !game.phase.meta.info">
    <VIcon size="64" class="mb-8">mdi-gesture-tap</VIcon><br>
    Bitte interagiere mit dem Bildschirm, um fortzufahren.
  </div>

  <div class="main-page" v-else>
    <template v-if="!game.phase.meta.board">
      <RouterView v-slot="{ Component }">
        <VFadeTransition>
          <component :is="Component" />
        </VFadeTransition>
      </RouterView>
    </template>

    <VFadeTransition>
      <div v-show="game.phase.meta.board">
        <VFadeTransition mode="out-in">
          <MediaScreen v-if="game.currentMedia !== null" />
          <VoteScreen v-else-if="game.phase.type === Phase.Vote" />
          <ResultsScreen v-if="game.phase.meta.results" />
          <ShownewCluesScreen v-if="game.phase.meta.showNewClues" />
          <TitleScreen v-else />
        </VFadeTransition>
      </div>
    </VFadeTransition>

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

      <VExpandXTransition>
        <Btn
          v-if="game.phase.type === Phase.Work && !useTutorial().isTutorial"
          @click="Game.get().cueManager.nextCue()"
          small
          nowrap
          color="#A23946"
          >
          Überspringen
          <VIcon>
            mdi-arrow-right
          </VIcon>
        </Btn>
      </VExpandXTransition>

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
        <VIcon size="small">mdi-cog</VIcon>

        <VDialog activator="parent" v-model="helpDialog" max-width="500" transition="scale-transition">
          <VCard flat>
            <VToolbar>
              <VToolbarTitle>
                <VIcon class="mr-2">mdi-cog</VIcon>
                Einstellungen
              </VToolbarTitle>

              <VBtn icon @click="helpDialog = false">
                <VIcon>mdi-close</VIcon>
              </VBtn>
            </VToolbar>
            <VCardText>
              <!-- <p class="mb-2">
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
              </p> -->

              <div class="mb-2">
                <VBtn icon variant="tonal" @click="playpause" class="mr-2">
                  <VIcon>mdi-play-pause</VIcon>
                </VBtn>
                <VBtn icon variant="tonal" @click="audio.nextTrack()" class="mr-2">
                  <VIcon>mdi-skip-next</VIcon>
                </VBtn>

                <span>{{ audio.currentTrack?.src.split('/').pop() }}</span>
              </div>

              <VCard class="mb-2 pa-4" color="background" flat>
                <div>
                  <VIcon>mdi-volume-high</VIcon>
                  Hauptlautstärke
                </div>
                <VSlider
                  v-model="audio.masterVolume"
                  thumb-size="16"
                  step=".01"
                  min="0"
                  max="1"
                  hide-details
                  color="primary"
                  class="mb-2"
                />

                <VDivider class="mb-4" />

                <div>
                  <VIcon>mdi-music</VIcon>
                  Music Volume
                </div>
                <VSlider
                  v-model="audio.rawMusicVolume"
                  thumb-size="16"
                  step=".01"
                  min="0"
                  max="1"
                  hide-details
                  class="mb-2"
                />
                <div>
                  <VIcon>mdi-play-circle</VIcon>
                  Media Volume
                </div>
                <VSlider
                  v-model="audio.rawMediaVolume"
                  thumb-size="16"
                  step=".01"
                  min="0"
                  max="1"
                  hide-details
                  class="mb-2"
                />
                <div>
                  <VIcon>mdi-poll</VIcon>
                  Vote Volume
                </div>
                <VSlider
                  v-model="audio.rawVoteVolume"
                  thumb-size="16"
                  step=".01"
                  min="0"
                  max="1"
                  hide-details
                />
              </VCard>

              <VBtn class="w-100 mb-2" variant="tonal" @click="gamedeck = !gamedeck; helpDialog = false">
                Debug
                <span class="d-inline-block ml-2">
                  <VKbd :style="{
                    background: '#040404'
                  }">Ctrl</VKbd> <VKbd :style="{
                    background: '#040404'
                  }">Shift</VKbd> <VKbd :style="{
                    background: '#040404'
                  }">D</VKbd>
                </span>
              </VBtn>

              <VBtn class="w-100" color="error" variant="tonal">
                Demo von vorne starten

                <VDialog max-width="300" activator="parent">
                  <template #default="{isActive}">
                    <VCard>
                      <VToolbar>
                        <VToolbarTitle>
                          <VIcon>mdi-restart</VIcon>
                          Demo zurücksetzen
                        </VToolbarTitle>
                        <VBtn icon @click="isActive.value = false">
                          <VIcon>mdi-close</VIcon>
                        </VBtn>
                      </VToolbar>

                      <VCardText>
                        <p class="mb-2">
                          Möchtest du die Demo wirklich zurücksetzen?
                        </p>

                        <VBtn
                          color="error"
                          variant="tonal"
                          @click="reload()"
                          class="w-100"
                        >
                          Demo zurücksetzen
                        </VBtn>
                      </VCardText>
                    </VCard>
                  </template>
                </VDialog>
              </VBtn>
            </VCardText>
          </VCard>
        </VDialog>
      </Btn>
    </div>

    <!-- <VDialog v-model="logoutDialog" max-width="300">
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
    </VDialog> -->
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
import { VKbd, VOverlay } from 'vuetify/components';
import { VBtn } from 'vuetify/components/VBtn';
import { preventGestures } from '@/main';
import { Phase } from '@/shared/phase';
import ShownewCluesScreen from '../board/ShownewCluesScreen.vue';
import TitleScreen from '../board/TitleScreen.vue';
import ResultsScreen from '../board/ResultsScreen.vue';
import VoteScreen from '../board/VoteScreen.vue';
import MediaScreen from '../board/MediaScreen.vue';
import { Game } from '@/server/game/game';
import { useTutorial } from '@/store/team/tutorial';
import { useAudio } from '@/store/board/audio';
import PlaybackCard from '@/components/admin/playbacks/PlaybackCard.vue';
import { Playback } from '@/shared/playback/Playback';
import GameControl from '@/components/admin/GameControl.vue';

// const display = useDisplay()

const router = useRouter()
const auth = useAuthManager()
const game = useGameManager()
const audio = useAudio()

const gamedeck = ref(false)
const gamedeckPosition = ref<'l' | 'r'>('l')

function playpause () {
  if (audio.currentTrack?.paused) {
    audio.currentTrack?.play()
  } else {
    audio.currentTrack?.pause()
  }
}

// const logoutDialog = ref(false)
const helpDialog = ref(false)

function reload () {
  localStorage.clear()
  location.reload()
}

watch(helpDialog, () => {
  preventGestures.value = !helpDialog.value
})

// const logoutOtp = import.meta.env.VITE_TEAM_LOGOUT_PASSCODE ?? '0000'
// const otp = ref('')
// watch(logoutDialog, () => {
//   otp.value = ''
// })

// const cornerPadding = 300
// const sequence = '010232'
// let typedSequence = ''
// let clearSequenceTimeout: number
// useEventListener('pointerdown', (event) => {
//   if (logoutDialog.value) return

//   let corner: string

//   if (event.clientX < cornerPadding && event.clientY < cornerPadding) {
//     corner = '0'
//   } else if (event.clientX > window.innerWidth - cornerPadding && event.clientY < cornerPadding) {
//     corner = '1'
//   } else if (event.clientX < cornerPadding && event.clientY > window.innerHeight - cornerPadding) {
//     corner = '2'
//   } else if (event.clientX > window.innerWidth - cornerPadding && event.clientY > window.innerHeight - cornerPadding) {
//     corner = '3'
//   } else {
//     typedSequence = ''
//     return
//   }
  
//   // console.log('Click:', event.clientX, event.clientY, corner)

//   typedSequence += corner
//   typedSequence = typedSequence.slice(-sequence.length)

//   if (typedSequence === sequence) {
//     window.addEventListener('pointerup', () => {
//       logoutDialog.value = true
//     }, { once: true })
//   }

//   clearTimeout(clearSequenceTimeout)
//   clearSequenceTimeout = setTimeout(() => {
//     typedSequence = ''
//   }, 1000) as unknown as number
// })

useEventListener('keydown', (event) => {
  if (event.key === 'D' && event.ctrlKey && event.shiftKey) {
    gamedeck.value = !gamedeck.value
  }
})

// const logoutError = ref('')
// function logout () {
//   if (otp.value !== logoutOtp) {
//     logoutError.value = 'Ungültiger Code'
//     return
//   }

//   auth.logout()
// }

watch(() => game.phase.type, () => {
  router.replace('/team')
})

onBeforeMount(() => {
  game.wakelockShouldBeActive = true
})

onUnmounted(() => {
  game.wakelockShouldBeActive = false
})
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

:deep(.gamedeck) {
  pointer-events: none;

  .v-card {
    pointer-events: auto;
  }
}

.interact-confirm {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>