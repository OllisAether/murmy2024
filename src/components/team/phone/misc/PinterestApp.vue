<template>
  <div class="pinterest-app">
    <div class="pinterest-app__header">
      <img :src="game.getAsset('phone/PinterestLogo.webp')?.content" alt="Pinterest">
    </div>

    <div class="pinterest-app__content">
      <VProgressCircular
        v-if="loading"
        class="pinterest-app__loading"
        color="black"
        indeterminate
      />
      <template v-else>
        <VIcon
        class="pinterest-app__icon"
        >mdi-alert-circle-outline</VIcon>
        <span class="pinterest-app__error">
          Fehler: Keine Internetverbindung
          <br>
          <br>
          Bitte überprüfe deine Internetverbindung.
        </span>
        <button class="pinterest-app__retry" @click="load">
          Erneut versuchen <VIcon size="1em">mdi-refresh</VIcon>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { onMounted, ref } from 'vue';

const game = useGameManager();

const loading = ref(true);

function load() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
}

onMounted(() => {
  load();
});
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.pinterest-app {
  display: flex;
  flex-direction: column;
  background: #fff;
  color: black;
  font-size: 8px * $scale;

  &__loading {
    width: 20px * $scale;
    height: 20px * $scale;
  }
  
  &__header {
    display: flex;
    align-items: center;
    gap: 2px * $scale;
    font-size: 10px * $scale;
    padding: 5px * $scale 10px * $scale;
    border-bottom: 1px * $scale solid #ccc;
    background: linear-gradient(#fff, #ddd);

    & > img {
      display: block;
      margin: 0 auto;
      height: 20px * $scale;
    }
  }

  &__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px * $scale;

    & > * {
      margin: 5px * $scale 0;
    }
  }

  &__icon {
    line-height: 1;
    font-size: 3em;
  }

  &__error {
    text-align: center;
  }

  &__retry {
    color: #ce1313;
  }
}
</style>