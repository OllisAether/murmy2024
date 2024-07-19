<template>
  <VCard class="login-card" max-width="500" min-width="300">
    <VToolbar>
      <VToolbarTitle>
        <template v-if="adminLoginRole === Role.Admin">
          <VIcon>mdi-shield-account</VIcon>
          Admin Login
        </template>
        <template v-else>
          <VIcon>mdi-television</VIcon>
          Board Login
        </template>
      </VToolbarTitle>
    </VToolbar>

    <VCardText>
      <p class="mb-4">
        Wenn du ein Spieler bist, bitten wir dich herzlich, diesen Bereich zu verlassen :)
        <br>
        <br>
        <router-link to="/login" class="text-primary">
          Zurück zum Login
          <VIcon>mdi-undo-variant</VIcon>
        </router-link>
      </p>

      <VBtnToggle
        v-model="adminLoginRole"
        :mandatory="true"
        class="mb-4 w-100"
        variant="outlined"
        rounded="lg"
        color="primary"
        :disabled="auth.adminLoginLoading"
      >
        <VBtn class="flex-grow-1" value="admin">
          <VIcon class="mr-2">mdi-shield-account</VIcon>
          Admin
        </VBtn>
        <VBtn class="flex-grow-1" value="board">
          <VIcon class="mr-2">mdi-television</VIcon>
          Board
        </VBtn>
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
        :disabled="auth.adminLoginLoading"
      >
        <template #append>
          <VBtn
            @click="adminLogin"
            :disabled="auth.adminLoginLoading"
            icon
            color="primary"
            variant="text"
          >
            <VIcon>mdi-login-variant</VIcon>
          </VBtn>
        </template>
      </VTextField>

      <p class="text-error">
        &nbsp;{{ auth.adminLoginError }}
      </p>

      <p class="text-small text-grey text-right">
        <em>
          Client-ID: {{ auth.clientId }}
        </em>
      </p>

      <VProgressLinear
        v-if="auth.adminLoginLoading"
        indeterminate
      />
    </VCardText>
  </VCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthManager } from '../../store/authManager'
import { Role } from '../../../shared/roles';

const auth = useAuthManager()

const adminPassword = ref('')
const adminLoginRole = ref<Role.Admin | Role.Board>(Role.Admin)

function adminLogin () {
  if (!adminPassword.value) {
    return
  }

  auth.loginAdmin(adminLoginRole.value, adminPassword.value)
}
</script>

<style lang="scss" scoped>
.login-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% - 2rem);
  transform: translate(-50%, -50%);
}

.team-list {
  background: #151515;
  border-radius: .5rem;
  max-height: 50vh;
}
</style>
