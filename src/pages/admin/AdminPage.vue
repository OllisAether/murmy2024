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
        <VListItem to="/admin/dashboard" >
          <VListItemTitle>
            <VIcon>mdi-view-dashboard</VIcon>
            Dashboard
          </VListItemTitle>
          <template #append>
            <VBadge
              v-if="admin.needsHelp.length"
              color="error"
              :content="admin.needsHelp.length"
              inline
            />
          </template>
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

    <VMain class="main">
      <div class="alerts-wrapper" v-if="admin.alert.length > 0">
        <div class="alerts">
          <VAlert
            v-for="alert in admin.alerts"
            :key="alert.id"
            :icon="alert.icon ?? undefined"
            :title="alert.title ?? undefined"
            :text="alert.message ?? undefined"
            :type="alert.type === 'default' ? undefined : alert.type"
            @click:close="alert.close?.()"
            :closable="true"
            variant="elevated"
          >
            <TimedProgress v-if="alert.closeAfter" :duration="alert.closeAfter" />
          </VAlert>
        </div>
      </div>

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
import TimedProgress from '../../components/TimedProgress.vue';

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

<style lang="scss" scoped>
.alerts {
  position: absolute;
  top: 1rem;
  right: 1rem;

  @media screen and (max-width: 768px) {
    position: static;
    margin: 1rem 1rem;
  }

  &-wrapper {
    z-index: 100;
    position: relative;
  }
}
</style>
