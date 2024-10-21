<template>
  <Page>
    <template #date>
      19.12.2012
    </template>
    <template #text>
      Mein Tutor hat schon die Hälfte der Woche gefehlt und das ohne Arbeitsauftrag.
      <br>
      <br>
      Gut für mich aber die Sache ist irgendwie 
      <Strike :height="90">
        komisch.
      </Strike>
      <br>
      <br>
      Wenn ich mich nicht irre, hat er eine Tochter hier an der Schule. Ivy oder sowas? Phoebe weiß bestimmt mehr drüber.
      <br>
      <br>
      Oh ich hab gehört dass Montague eine kriminelle Vergangenheit hat, ich muss mal herausfinden was er gemacht hat. Vielleicht hat er ja einige Tipps für mich.
    </template>
  </Page>
</template>

<script setup lang="ts">
import Strike from '../Strike.vue';
import Page from '../Page.vue';
</script>
