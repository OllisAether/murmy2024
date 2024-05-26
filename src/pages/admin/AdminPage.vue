<template>
  <VApp>
    <VNavigationDrawer v-model="drawer">
      <VToolbar color="transparent" border="b">
        <VToolbarTitle>
          <VIcon>mdi-gamepad-variant</VIcon>
          Gamemaster
        </VToolbarTitle>
      </VToolbar>

      <VList nav>
        <VListItem to="/admin/dashboard">
          <VListItemTitle>
            <VIcon>mdi-view-dashboard</VIcon>
            Dashboard
          </VListItemTitle>
        </VListItem>
        <VListItem to="/admin/teams">
          <VListItemTitle>
            <VIcon>mdi-account-group</VIcon>
            Teams
          </VListItemTitle>
        </VListItem>
        <VListItem to="/admin/clients">
          <VListItemTitle>
            <VIcon>mdi-account</VIcon>
            Clients
          </VListItemTitle>
        </VListItem>
      </VList>

      <template #append>
        <VList nav>
          <VListItem @click="">
            <VListItemTitle>
              <VIcon>mdi-account-circle</VIcon>
              Tutorial
            </VListItemTitle>

            <VDialog activator="parent" v-model="tutorialDialog" max-width="400">
              <TutorialCard @close="tutorialDialog = false" />
            </VDialog>
          </VListItem>
          <!-- <VDivider />
          <VListItem @click="">
            <VListItemTitle>
              <VIcon>mdi-logout</VIcon>
              Logout
            </VListItemTitle>

            <VDialog activator="parent" max-width="300">
              <VCard>
                <VCardText>
                  Bis du sicher, dass du dich ausloggen möchtest?
                </VCardText>
                <VCardActions>
                  <VBtn>Abbrechen</VBtn>
                  <VBtn variant="tonal" color="primary" @click="auth.logout()">Logout</VBtn>
                </VCardActions>
              </VCard>
            </VDialog>
          </VListItem> -->
        </VList>
      </template>
    </VNavigationDrawer>

    <VAppBar>
      <VToolbarTitle>
        <VBtn icon @click="drawer = !drawer">
          <VIcon>mdi-menu</VIcon>
        </VBtn>
        
        {{ route.meta.title }}
      </VToolbarTitle>

      <VBtn>
        Logout

        <VDialog v-model="logoutDialog" activator="parent" max-width="400">
          <VCard title="Logout">
            <VCardText>
              <p>bist du sicher, dass du dich ausloggen möchtest?</p>
            </VCardText>
            <VCardActions>
              <VBtn @click="logoutDialog = false">Abbrechen</VBtn>
              <VBtn variant="tonal" color="primary" @click="logout">Logout</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VBtn>
    </VAppBar>

    <VMain>
      <VContainer v-if="admin.needsHelp.length > 0" class="pb-0">
        <VAlert
          v-for="help in admin.needsHelp"
          :key="help"
          type="info"
          icon="mdi-help-circle"
          variant="tonal"
        >
          <b>{{ admin.teams.find(team => team.id === help)?.name || 'Unbekanntes Team' }}</b> brauchen Hilfe!

          <template #close>
            <VBtn icon @click="admin.removeHelpRequest(help)">
              <VIcon>mdi-close</VIcon>
            </VBtn>
          </template>
        </VAlert>

      </VContainer>

      <RouterView />
    </VMain>
  </VApp>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useAuthManager } from '../../store/authManager';
import { useAdmin } from '../../store/admin';
import { Role } from '../../../shared/roles';
import { VBtn, VIcon, VNavigationDrawer, VToolbar } from 'vuetify/components';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import TutorialCard from '../../components/admin/TutorialCard.vue';

const route = useRoute();
const drawer = ref(!useDisplay().mdAndDown.value);

const logoutDialog = ref(false);
const tutorialDialog = ref(false);

const auth = useAuthManager();
const admin = useAdmin();

onMounted(() => {
  if (auth.role === Role.Admin) {
    admin.initAdmin();
  }

  document.documentElement.classList.add('admin');
  document.body.classList.add('admin');

  return () => {
    admin.deinitAdmin();
    document.documentElement.classList.remove('admin');
    document.body.classList.remove('admin');
  };
});

async function logout() {
  auth.logout();
  logoutDialog.value = false;
}
</script>
