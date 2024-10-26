<template>
  <Page>
    <template #date>
      12.02.2013
    </template>
    <template #text>
      <br>
      <Collectable entry-id="diary-phoebe-verraeter">
        Phoebe diese scheiß Kuh geht mir gerade so auf die <Strike>nerfn</Strike> Nerven.
        <br>
        Ganz normal wollte ich mit ihr reden, wirklich ich habs nichts getan und plötzlich <Strike>fauht</Strike> faucht sie mich an und sagt mir ich sei ein Verräter?? Wenn jemand ein Verräter ist dann sie. Ich <Strike>hase</Strike> hasse es mit Phoebe zu streiten, und ich weiß sie mag es auch nicht aber manchmal kann sie einen so <Strike>prowoieren</Strike> provozieren.
        <br>
        <br>
        Ja ok vielleicht habe ich paar unschöne dinge zu ihr gesagt, aber hey, wer sagt nicht manchmal Dinge die er nicht meint? Phoebe wird sich wieder einkriegen.
      </Collectable>
    </template>
  </Page>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import Page from '../Page.vue';
import Strike from '../Strike.vue';
</script>
