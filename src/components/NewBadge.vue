<template>
  <div class="new-badge">
    <span>
      Neu
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.new-badge {
  padding: 0 .5em;
  background-color: #2b183ed5;
  border: 1px solid #d8b1ff;
  border-radius: .5em;
  color: #d8b1ff;
  text-shadow: 0 0 .3em #c184ff99, 0 0 .5em #9123ff;
  box-shadow:
    0 0 .5em #d8b1ff77 inset,
    0 0 1em #9123ff55 inset;
  -webkit-backdrop-filter: blur(.2em);
  backdrop-filter: blur(.2em);

  font-family: $fontDisplayCursive;
  font-size: 1rem;

  span {
    font-size: 1.25em;
  }
}
</style>