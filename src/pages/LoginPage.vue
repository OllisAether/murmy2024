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
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAuthManager } from '../store/authManager'
import { codeLength, codeRegex } from '../../shared/teamcode';
import { useRoute } from 'vue-router';
import { useGameManager } from '../store/gameManager';

const route = useRoute()
const auth = useAuthManager()

const code = ref('')
function setCode (value: string) {
  const _code = value.trim().toUpperCase().slice(0, codeLength)

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
  const success = await auth.loginTeam(code.value)

  if (success) {
    useGameManager().toggleFullscreen()
  } else {
    code.value = ''
  }
}

onMounted(() => {
  const routeCode = route.params.code as string | undefined

  if (routeCode) {
    setCode(routeCode)
    login()
  }
})
</script>

<style lang="scss" scoped>
.login-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
