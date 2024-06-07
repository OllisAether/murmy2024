<template>
  <VThemeProvider theme="light">
    <VLayout class="search-page">
      <VToolbar
        color="white"
        class="search-page__toolbar"
        height="0"
      >
      
      </VToolbar>

      <VMain class="search-page__content d-flex justify-center align-center">
        <VContainer class="">
          <VRow align="center">
            <VCol>
              <div class="search-page__logo text-center">
                <span class="text-blue-darken-1">G</span>
                <span class="text-yellow-darken-2">o</span>
                <span class="text-red">o</span>
                <span class="text-blue-darken-1">g</span>
                <span class="text-green-darken-2">z</span>
              </div>
            </VCol>
          </VRow>
          <VRow align="center">
            <VCol>
              <VTextField
                v-model="query"
                variant="solo-filled"
                placeholder="Suchen..."
                bg-color="grey-lighten-3"
                hide-details
                flat
                rounded
                clearable
                clear-icon="mdi-close"
              >
                <template #prepend-inner>
                  <VIcon size="24">mdi-magnify</VIcon>
                </template>

                <template #append-inner>
                  <VBtn
                    icon
                    size="small"
                    variant="text"
                    @click="search"
                    v-if="query"
                  >
                    <VIcon size="24">mdi-arrow-right</VIcon>
                  </VBtn>
                </template>
              </VTextField>
            </VCol>
          </VRow>
        </VContainer>
      </VMain>
    </VLayout>
  </VThemeProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const query = ref('');

function search() {
  console.log('Searching for:', query.value);
}
</script>

<style scoped lang="scss">
@use '@/scss/vars' as *;

.search-page {
  height: 100%;
  font-family: $fontPhoneText, sans-serif;

  &__toolbar {
    z-index: 1;
    position: absolute;
    top: 0;
    padding-top: 4rem;
  }

  &__content {
    padding-top: 5rem;
    padding-bottom: 50%;
  }

  &__logo {
    font-family: 'Times New Roman', Times, serif;
    font-size: 6rem;
    color: black;
  }
}
</style>