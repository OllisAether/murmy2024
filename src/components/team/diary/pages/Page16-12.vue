<template>
  <Page>
    <template #date>
      16.12.2012
    </template>
    <template #text>
      <Collectable entry-id="diary-cassy-verfolgt">
        Cassandra verfolgt mich immer noch.
      </Collectable>
      Diesmal hat sie sogar angefangen Papierkugeln auf mich zu werfen.
      Aus Neugier hab ich eins aufgehoben und was seh ich?
      <br>
      <br>
      <i>
        „Phiny, du bist perfekt, ich brauche dich unbedingt.“
      </i> <Strike behind :thickness="30" color="#ce5cff44">?!?  </Strike>
      <br>
      Bitte lass das ein schlechter Albtraum sein.
      <br>
      <br>
      <Collectable entry-id="diary-cassy-rituale">
        Sie spricht ständig über irgendwelche Rituale, für die sie mich opfern will??
      </Collectable>
      <br>
      Ständig Bilder von irgendwelchen Ritualen mit diesem Orakel,
      <Collectable inline entry-id="diary-cassy-gore">
        irgendwelche Gore-Sachen??
      </Collectable>
      <br>
      Okay, manche sehen cool aus und deswegen hab ich sie noch nicht geblockt, aber trotzdem.
    </template>
  </Page>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import Page from '../Page.vue';
import Strike from '../Strike.vue';
</script>
