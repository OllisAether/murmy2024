<template>
  <VThemeProvider theme="light">
    <VLayout class="login-page app-layout" v-bind="$attrs">
      <VToolbar app color="transparent">
        <VToolbarTitle>
          <VIcon color="deep-purple-accent-2" size="48">mdi-email</VIcon>
          Swiftmail
        </VToolbarTitle>
      </VToolbar>

      <VMain>
        <VContainer>
          <div class="login-page__title text-center mt-16 mb-8">
            Willkommen!
          </div>

          <div class="text-center text-grey-darken-3 mb-16">
            Bitte melden Sie sich an, um fortzufahren.
          </div>

          <VDivider class="mb-8 mx-4" />

          <TextField
            class="login-page__input mb-4"
            v-model="email"
            label="E-Mail"
            entry-type="email"
            variant="outlined"
            hide-details
            :disabled="loading"
          />

          <TextField
            class="login-page__input mb-4"
            v-model="password"
            label="Passwort"
            type="password"
            entry-type="accounts"
            variant="outlined"
            hide-details
            :disabled="loading"
          />

          <VBtn
            block
            color="deep-purple-accent-2"
            flat
            size="large"
            @click="login"
            :loading="loading"
          >
            Anmelden
          </VBtn>
          <p v-if="errorMessage.length > 0" class="text-red-darken-2 text-center mt-4">
            {{ errorMessage }}
          </p>
        </VContainer>
      </VMain>
    </VLayout>
  </VThemeProvider>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { ref } from 'vue';
import TextField from '@/components/game/TextField.vue';

const game = useGameManager();

const email = ref('');
const password = ref('');

const loading = ref(false);
const errorMessage = ref('');

async function login() {
  errorMessage.value = '';
  
  if (!email.value || !password.value) {
    errorMessage.value = 'E-Mail und Passwort sind erforderlich.';
    return;
  }

  loading.value = true;

  const success = await game.loginEmail(email.value, password.value);

  if (!success) {
    errorMessage.value = 'E-Mail oder Passwort ist falsch.';
  }

  loading.value = false;
}
</script>

<style scoped lang="scss">
.login-page {
  
  &__title {
    font-size: 2rem;
    font-weight: bold;
  }
}
</style>