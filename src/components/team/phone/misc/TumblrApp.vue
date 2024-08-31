<template>
  <div class="tumblr-app">
    <div class="tumblr-app__header">
      <img :src="game.getAsset('phone/TumblrLogo.webp')?.content" alt="Tumblr">
    </div>

    <div class="tumblr-app__content">
      <VProgressCircular
        v-if="loading"
        class="tumblr-app__loading"
        color="black"
        indeterminate
      />
      <template v-else>
        <VIcon
        class="tumblr-app__icon"
        >mdi-alert-circle-outline</VIcon>
        <span class="tumblr-app__error">
          Fehler: Keine Internetverbindung
          <br>
          <br>
          Bitte überprüfe deine Internetverbindung.
        </span>
        <button class="tumblr-app__retry" @click="load">
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

.tumblr-app {
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
    border-bottom: 1px * $scale solid #fff7;
    background: #3A4D62;

    & > img {
      display: block;
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
    padding: 5px * $scale 5px * $scale;
    border-radius: 2px * $scale;
    background: #3A4D62;
    color: white;
  }
}
</style>