<template>
  <div class="title">
    <span>(</span>
    <span>
      Murder Mystery<br>
      <span class="night">
        Night
      </span>
    </span>
    <span>)</span>
  </div>
</template>

<style lang="scss" scoped>
@use '../../scss/vars' as *;

.title {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  white-space: nowrap;
  font-size: min(10vh, 5vw);
  text-align: center;
  line-height: 1;

  font-family: $fontDisplay;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.1em;

  .night, &>span:nth-child(1), &>span:nth-child(3) {
    font-size: 2.5em;
  }
}
</style>
