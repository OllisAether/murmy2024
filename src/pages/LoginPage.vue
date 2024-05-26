<template>
  <VCard class="login-card" max-width="350" width="100%" rounded="lg">
    <VToolbar>
      <VToolbarTitle>
        <VIcon>mdi-account-group</VIcon>
        Team Login
      </VToolbarTitle>
    </VToolbar>

    <VCardText>
      <p class="mb-4">
        Auf deinem Einführungsbogen findest du einen 6-stelligen Code, den du hier eingeben kannst.
      </p>

      <VOtpInput
        :disabled="auth.loginLoading"
        @update:model-value="setCode"
        :model-value="code"
        :length="codeLength"
        :error="auth.loginError !== null"
        @finish="login"
        autofocus
        type="text"
      />

      <p class="text-error mb-2">
        {{ auth.loginError }}
      </p>

      <p class="text-small text-grey text-right">
        <em>
          Client-ID: {{ auth.clientId }}
        </em>
      </p>

      <!-- <VBtn variant="tonal" color="primary" @click="login" class="w-100">
        Login
        <VIcon class="ml-2">
          mdi-arrow-right
        </VIcon>
      </VBtn> -->
      <VProgressLinear
        v-if="auth.loginLoading"
        indeterminate
      />
    </VCardText>
  </VCard>

  <VDialog v-model="adminDialog" max-width="500">
    <VCard>
      <VToolbar>
        <VToolbarTitle>
          <VIcon>mdi-shield-account</VIcon>
          Admin Login
        </VToolbarTitle>
        <VBtn icon @click="adminDialog = false">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>

      <VCardText v-if="!auth.adminLoginLoading">
        <p class="mb-4">
          Wenn du ein Spieler bist, bitten wir dich herzlich, diesen Bereich zu verlassen :)
        </p>

        <VBtnToggle
          v-model="adminLoginRole"
          :mandatory="true"
          class="mb-4 w-100"
          variant="outlined"
          color="primary"
        >
          <VBtn class="flex-grow-1" value="admin">Admin</VBtn>
          <VBtn class="flex-grow-1" value="board">Board</VBtn>
        </VBtnToggle>

        <p class="mb-4">
          Bitte gib das {{ adminLoginRole === 'admin' ? 'Admin-Passwort' : 'Board-Passwort' }} ein.
        </p>

        <VTextField
          v-model="adminPassword"
          :label="adminLoginRole === 'admin' ? 'Admin-Passwort' : 'Board-Passwort'"
          type="password"
          variant="outlined"
          @keydown.enter="adminLogin"
        />

        <p class="text-error">
          &nbsp;{{ auth.adminLoginError }}
        </p>
      </VCardText>
      <VCardText v-else>
        <VProgressLinear indeterminate />
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn variant="tonal" color="primary" @click="adminLogin">
          Login
          <VIcon class="ml-2">
            mdi-arrow-right
          </VIcon>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthManager } from '../store/authManager'
import { useEventListener } from '@vueuse/core'
import { Role } from '../../shared/roles';
import { codeLength, codeRegex } from '../../shared/teamcode';

const auth = useAuthManager()

const code = ref('')
function setCode (value: string) {
  const _code = value.trim().toUpperCase()

  if (_code.length === 0) {
    code.value = ''
    return
  }

  const valid = codeRegex.test(_code)

  if (valid) {
    code.value = _code
  }
}

async function login () {
  await auth.loginTeam(code.value)
}

// #region Admin Login
const adminDialog = ref(false)
const adminPassword = ref('')
const adminLoginRole = ref<Role.Admin | Role.Board>(Role.Admin)

let shortcutPressed = 0
useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  // Triple Ctrl + Shift + A
  if (e.key === 'A' && e.ctrlKey && e.shiftKey) {
    shortcutPressed++

    if (shortcutPressed === 3) {
      shortcutPressed = 0
      adminDialog.value = true
      return
    }

    setTimeout(() => {
      shortcutPressed = 0
    }, 500)
  }
}, { passive: true })

useEventListener(window, 'touchstart', (e: TouchEvent) => {
  let timeout = setTimeout(() => {
    if (e.touches.length === 3) {
      adminDialog.value = true
    }
  }, 1000)

  window.addEventListener('touchend', () => {
    clearTimeout(timeout)
  }, { once: true })
})

function adminLogin () {
  if (!adminPassword.value) {
    return
  }

  auth.loginAdmin(adminLoginRole.value, adminPassword.value)
}
// #endregion
</script>

<style lang="scss" scoped>
.login-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.team-list {
  background: #151515;
  border-radius: .5rem;
  max-height: 50vh;
}
</style>
