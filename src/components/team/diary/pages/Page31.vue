<template>
  <Page blank class="page31">
    <div class="page31__credits">
      <b>Murder Mystery Team:</b><br><br>
      Olli - Programmierung, Story, Script, Dokumente<br>
      Miri - Executive Writer, Story, Script, Dokumente<br>
      Ari - Story, Script, Dokumente<br>
      Arki - Story, Script, Dokumente<br>
      Mina - Story, Dokumente<br>

      <br><br>

      <b>Cast:</b><br><br>
      Miri - Ermittlungsleiterin<br>
      Hannah - Ivy Delora<br>
      Gabriel - Phineas Musé<br>
      Mara - Cassandra Novak<br>
      Hr. Kegler - Hugo Montague<br>
      Arki - Justin van Bustin<br>
      Mina - Phoebe Blight<br>
      Olli - Das Orakel, Notrufzentrale<br>

      <br>

      © 2012 LS. Technik-Crew
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '../Page.vue';
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.page31 {
  &__credits {
    color: #b0957c;
    position: absolute;
    bottom: 4rem;
    left: 5rem;
  }
}
</style>