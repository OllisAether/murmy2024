<template>
  <div class="internet-app">
    <div class="internet-app__toolbar">
      <VIcon size="1.25em">mdi-earth</VIcon>

      <span class="internet-app__toolbar__url">
        {{ url }}
      </span>

      <VIcon size="1.25em">mdi-menu</VIcon>
    </div>
    <div class="internet-app__content">
      <VIcon class="android-icon">mdi-android</VIcon>

      <h2>
        Webpage not available
      </h2>

      <p>
        The webpage at
        <span class="link">{{ url }}</span>
        might be temporarily down or it may have moved permanently to a new web address.
      </p>

      <p>
        <strong>Suggestions:</strong>
      </p>

      <ul>
        <li>Make sure you have a working internet connection</li>
        <li>Refresh the page</li>
        <li>Check the address for typing errors</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const url = 'http://www.google.com/search?q=cat+gifs&hl=de&gl=de&client=android-internet&source=android-home';
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.internet-app {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__toolbar {
    background: linear-gradient(#000, #0f1416);
    display: flex;
    align-items: center;
    padding: 5px * $scale;
    font-size: 10px * $scale;
    color: #aaa;
    border-bottom: 1px * $scale solid #fff2;

    &__url {
      padding: 0 5px * $scale;
      flex: 1;
      text-decoration: line-through;
  
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #444;
    }
  }

  &__content {
    position: relative;
    flex: 1;
    background: #fff;
    color: black;
    font-size: 8px * $scale;
    padding: 22px * $scale 8px * $scale 0px * $scale;

    h2 {
      font-size: 12px * $scale;
      margin-bottom: 8px * $scale;
    }

    p {
      margin-bottom: 8px * $scale;
    }

    ul {
      padding-left: 16px * $scale;
    }

    .link {
      color: #0026ff;
      text-decoration: underline;
      word-break: break-all;
    }

    .android-icon {
      position: absolute;
      top: -8px * $scale;
      left: 6px * $scale;
      font-size: 32px * $scale;
      transform: rotate(180deg);
      color: #6dd13f;
    }
  }
}
</style>