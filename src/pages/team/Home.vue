<template>
  <div class="teamname">
    <span>
      Willkommen<br>
    </span>
    {{ auth.team?.name }}
  </div>
</template>

<script lang="ts" setup>
import { useAuthManager } from '../../store/authManager';

const auth = useAuthManager()
</script>

<style lang="scss" scoped>
@use '../../scss/vars' as *;

.teamname {
  font-size: min(20vh, 10vw);
  // font-weight: bold;
  // text-transform: uppercase;
  // font-style: italic;
  font-family: $fontDisplay;

  position: fixed;
  padding: 4rem 8rem;
  top: 50%;
  left: 50%;
  width: fit-content;
  text-align: center;
  line-height: 1.2;
  transform: translate(-50%, -50%)translateY(-0.6em);

  span {
    font-size: 0.3em;
  }
}
</style>