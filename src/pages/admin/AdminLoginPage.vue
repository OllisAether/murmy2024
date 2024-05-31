<template>
  <VCard class="login-card" max-width="500" min-width="300">
    <VToolbar>
      <VToolbarTitle>
        <VIcon>mdi-shield-account</VIcon>
        Admin Login
      </VToolbarTitle>
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
