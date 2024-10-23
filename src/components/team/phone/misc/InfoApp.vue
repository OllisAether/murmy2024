<script setup lang="ts">
import ScrollView from '../ScrollView.vue';
</script>

<template>
  <div class="info-app">
    <div class="info-app__header">
      System Info
    </div>

    <ScrollView class="info-app__scroller">
      <div class="info-app__content">
        <b>CrewOS x32</b><br>
        (c) 2012 LS. Technik-Crew<br>
        Alle Rechte vorbehalten.<br><br>

        <b>Version:</b> 1.3.2s<br>
        <b>Build:</b> 2012-12-21<br>
        <b>Kernel:</b> 3.0.31<br>
        <b>API-Level:</b> 8<br>
        <b>Security-Patch:</b> 2012-12-01<br>
        
        <br><br>

        <b>Murder Mystery Team:</b><br><br>
        <b>Olli:</b> Programmierung, Story, Script, Dokumente<br>
        <b>Miri:</b> Executive Writer, Story, Script, Dokumente<br>
        <b>Ari:</b> Story, Script, Dokumente<br>
        <b>Arki:</b> Story, Script, Dokumente<br>
        <b>Mina:</b> Story, Dokumente<br>

        <br><br>

        <b>Cast:</b><br><br>
        <b>Miri:</b> Ermittlungsleiterin<br>
        <b>Hannah:</b> Ivy Delora<br>
        <b>Gabriel:</b> Phineas Musé<br>
        <b>Mara:</b> Cassandra Novak<br>
        <b>Hr. Kegler:</b> Hugo Montague<br>
        <b>Arki:</b> Justin van Bustin<br>
        <b>Mina:</b> Phoebe Blight<br>
        <b>Olli:</b> Das Orakel, Notrufzentrale
        <br><br><br><br><br>
      </div>
    </ScrollView>
  </div>
</template>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.info-app {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: black;
  font-size: 8px * $scale;

  &__header {
    font-size: 10px * $scale;
    padding: 5px * $scale 10px * $scale;
    border-bottom: 1px * $scale solid #ccc;
    background: linear-gradient(#fff, #ddd);
  }

  &__scroller {
    flex-grow: 1;
  }
  
  &__content {
    padding: 5px * $scale;
    font-family: monospace;
  }
}
</style>