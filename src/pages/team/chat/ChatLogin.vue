<template>
  <VThemeProvider theme="light">
    <VLayout class="login-page app-layout">
      <VToolbar app color="transparent" height="0" />

      <VMain>
        <VContainer>
          <div class="login-page__title text-center my-16">
            <VIcon size="48">mdi-chat</VIcon>
            ChatsApp
          </div>
          
          <div class="text-center text-grey-darken-3 mb-8">
            Melde dich an, um mit deinen Freunden zu chatten.
          </div>

          <VTextField
            class="login-page__input mb-4"
            v-model="phone"
            label="Telefonnummer"
            variant="outlined"
            rounded
            hide-details
            :disabled="loading"
          />

          <VTextField
            class="login-page__input mb-4"
            v-model="password"
            label="Passwort"
            type="password"
            variant="outlined"
            rounded
            hide-details
            :disabled="loading"
          />

          <VBtn
            block
            color="green-darken-2"
            rounded
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

const game = useGameManager();

const phone = ref('');
const password = ref('');

const loading = ref(false);
const errorMessage = ref('');
async function login() {
  errorMessage.value = '';
  
  if (!phone.value || !password.value) {
    errorMessage.value = 'Telefonnummer und Passwort sind erforderlich.';
    return;
  }

  loading.value = true;

  const success = await game.loginChat(phone.value, password.value);

  if (!success) {
    errorMessage.value = 'Telefonnummer oder Passwort ist falsch.';
  }

  loading.value = false;
}
</script>

<style scoped lang="scss">
.login-page {
  
  &__title {
    font-size: 2.5rem;
    font-weight: bold;
  }

  &__input :deep(.v-field) {
    border-radius: 999rem;
  }
}
</style>