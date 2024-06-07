<template>
  <div class="teamname">
    <span>
      Willkommen<br>
    </span>
    {{ auth.team?.name }}

  </div>
  <Timer />
</template>

<script lang="ts" setup>
// import { useGameManager } from '@/store/gameManager';
import Timer from '@/components/Timer.vue';
import { useAuthManager } from '../../store/authManager';

const auth = useAuthManager()
// const game = useGameManager()
</script>

<style lang="scss" scoped>
@use '../../scss/vars' as *;

.teamname {
  font-size: min(20vh, 10vw);
  font-family: $fontDisplay;

  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
  line-height: 1.2;
  transform: translateY(-60%);

  span {
    font-size: 0.3em;
  }
}
</style>