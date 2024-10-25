<template>
  <VCard>
    <VTabs v-model="tab" grow>
      <VTab>
        Passwörter im überblick
      </VTab>
    </VTabs>

    <VTabsWindow v-model="tab">
      <VTabsWindowItem>
        <VCardText>
          <h2>
            Team ausloggen
          </h2>

          <p>
            Um dich als Team auszuloggen, musst du innehalb von 5 Sekunden folgende Sequenz tippen:
          </p>

          <p>
            Oben Links<br />
            Oben Rechts<br />
            Oben Links<br />
            Unten Links<br />
            Unten Rechts<br />
            Unten Links
          </p>

          <p>
            Dann gebe den Code 3010 ein.
          </p>

          <h2>
            Admin & Board Login
          </h2>
          <p>
            Um dich als Admin oder Board einzuloggen, geh auf die Seite /admin.
          </p>
          <p>
            Danach kannst du dich mit folgenden Daten einloggen:
          </p>
          <p>
            Admin: murmy2.0
            <br />
            Board: boulder
          </p>

          <h2>
            Board Logout
          </h2>

          <p>
            Um dich als Board auszuloggen, 3x auf den Bildschirm tippen.
          </p>
        </VCardText>
      </VTabsWindowItem>
      <VTabsWindowItem>
        <VCardText>
          Tab 2 content
        </VCardText>
      </VTabsWindowItem>
    </VTabsWindow>

    <VCardActions>
      <VSpacer />
      <VBtn color="primary" @click="emit('close')">
        Schließen
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['close']);

const tab = ref(0);
</script>

<style scoped lang="scss">
h2 {
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1.5rem;
}
</style>