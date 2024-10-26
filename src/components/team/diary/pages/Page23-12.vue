<template>
  <Page>
    <template #date>
      23.12.2012
    </template>
    <template #text>
      <br>
      <Collectable entry-id="justin-villager">
        Er hat mir geschrieben, er hätte sich einen neuen Spitznamen für mich ausgedacht "Villager" wie die Villager aus <i>Minecraft</i>.
      </Collectable>
      Es reicht nicht, dass er mich in der Schule nicht in Ruhe lässt. 
      Jetzt terrorisiert er mich auch online. Von wem hat er überhaupt meine Nummer?!
      <br>
      <br>
      <Collectable entry-id="phineas-nummer-phoebe" inline>Keiner außer Phoebe hat meine Nummer</Collectable>
      und sie würde ihm die niemals geben, dafür hasst sie ihn zu sehr.
    </template>
  </Page>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import Page from '../Page.vue';
</script>
