<template>
  <Page>
    <template #date>
      14.12.2012
    </template>
    <template #text>
      <Collectable  entry-id="diary-cassy-verfolgt">
        Nope. Sie verfolgt mich. Diese Cassandra oder wie auch immer sie heißt kann mich einf nicht in ruhe lassen.
      </Collectable>
      Sie und ihr Okkult club. Wäre sie nicht so komisch,
      <br>
      hätte ich mir die AG vielleicht mal angeschaut aber jetzt auf gar keinen 
      <Strike :height="92">Fall...</Strike>
      <br>
      Zu Ivy meinte Phoebe nur dass sie wirklich die Tochter von Montague ist. Wie Cassandra Teil des Okkults.
      <br>
      <br>
      Was auch immer, ich werd die einfach ihr Ding machen lassen aber Cassandra soll aufhören mich zu verfolgen!<br>
      <div style="font-size: 2em; padding: .25em 4rem;">
        <i>
          <Strike behind :thickness="60" color="#fff06daa">Abfuck!</Strike>
        </i>
      </div>
      <Collectable entry-id="diary-phoebe-ignoriert">
        Phoebe sagt, ich soll sie einfach ignorieren und das werd ich auch tun.
        Genauso wie wir uns in der Schule auch ignorieren. Stört mich eigentlich nicht aber, dass es sie
      </Collectable> gar nicht interessiert dass Cassandra mich verfolgt nervt mich schon. Ich weiß dass mir das stinken
      <br>
      <div style="margin-left: 13rem;">
        würde an ihrer Stelle.
      </div>
    </template>
  </Page>
</template>

<script setup lang="ts">
import Collectable from '@/components/Collectable.vue';
import Page from '../Page.vue';
import Strike from '../Strike.vue';
</script>
