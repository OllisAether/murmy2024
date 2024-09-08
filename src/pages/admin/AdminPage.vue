<template>
  <VApp>
    <VNavigationDrawer
      v-model="drawer"
      mobile-breakpoint="md"
      :permanent="display.mdAndUp.value"
      :persistent="display.mdAndUp.value"
    >
      <VToolbar color="transparent" border="b">
        <VToolbarTitle class="title">
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

        <div class="divider">
          <span>Umfrage</span>
          <VDivider />
        </div>
        
        <VListItem to="/admin/pools">
          <VListItemTitle>
            <VIcon>mdi-vote</VIcon>
            Pools
          </VListItemTitle>
        </VListItem>

        <VListItem to="/admin/candidates">
          <VListItemTitle>
            <VIcon>mdi-account-star</VIcon>
            Kandidaten
          </VListItemTitle>
        </VListItem>

        <div class="divider">
          <span>Spiel</span>
          <VDivider />
        </div>

        <VListItem to="/admin/playbacks">
          <VListItemTitle>
            <VIcon>mdi-filmstrip-box-multiple</VIcon>
            Playbacks
          </VListItemTitle>
        </VListItem>

        <VListItem to="/admin/media">
          <VListItemTitle>
            <VIcon>mdi-movie</VIcon>
            Media
          </VListItemTitle>
        </VListItem>

        <VListItem to="/admin/suspectDatabases">
          <VListItemTitle>
            <VIcon>mdi-database-search</VIcon>
            Verdächtigendatenbanken
          </VListItemTitle>
        </VListItem>

        <VListItem to="/admin/clues">
          <VListItemTitle>
            <VIcon>mdi-magnify</VIcon>
            Hinweise
          </VListItemTitle>
        </VListItem>

        <VListItem to="/admin/forms">
          <VListItemTitle>
            <VIcon>mdi-file-document</VIcon>
            Lösungsbögen
          </VListItemTitle>
        </VListItem>

        <div class="divider">
          <span>Verwaltung</span>
          <VDivider />
        </div>

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
          <VListItem @click="">
            <VListItemTitle>
              <VIcon>mdi-logout</VIcon>
              Logout
            </VListItemTitle>

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
          </VListItem>
        </VList>
      </template>
    </VNavigationDrawer>

    <VAppBar border="b" flat>
      <VToolbarTitle class="title">
        <VBtn 
          icon
          @click="drawer = !drawer"
          v-if="display.smAndDown.value"
        >
          <VIcon>mdi-menu</VIcon>
        </VBtn>

        {{ route.meta.title }}
      </VToolbarTitle>

      <Timer class="mr-4"/>

      <template #extension>
        <div class="px-4">
          <VChip v-if="game.assetsProgress.loading" class="mr-2">
            <VProgressCircular indeterminate class="mr-2" size="16" />
            Lade Assets im Hintergrund
            ({{ game.assetsProgress.loadedAssets }} / {{ game.assetsProgress.totalAssets }})...
          </VChip>

          <VChip class="mr-2">
            Phase: {{ phaseToName(game.phase.type) }}
          </VChip>
        </div>
      </template>
    </VAppBar>

    <VMain class="main">
      <div class="alerts-wrapper" v-if="admin.alerts.length > 0">
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
            variant="outlined"
          >
            <TimedProgress v-if="alert.closeAfter" :duration="alert.closeAfter" />

            <template #text>
              <div class="mt-2">
                <VBtn
                  v-for="action in alert.actions"
                  :key="action.label"
                  @click="action.action()"
                  variant="tonal"
                  >
                  {{ action.label }}
                </VBtn>
              </div>
            </template>
          </VAlert>
        </div>
      </div>

      <RouterView />
    </VMain>
  </VApp>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useAuthManager } from '../../store/authManager';
import { useAdmin } from '../../store/admin/index';
import { Role } from '../../../shared/roles';
import { VBtn, VIcon, VNavigationDrawer, VToolbar } from 'vuetify/components';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import TutorialCard from '../../components/admin/TutorialCard.vue';
import TimedProgress from '../../components/TimedProgress.vue';
import { useGameManager } from '@/store/gameManager';
import Timer from '@/components/Timer.vue';
import { phaseToName } from '../../../shared/phase';

const route = useRoute();
const drawer = ref(!useDisplay().smAndDown.value);
const display = useDisplay();

const logoutDialog = ref(false);
const tutorialDialog = ref(false);

const game = useGameManager();
const auth = useAuthManager();
const admin = useAdmin();

onMounted(() => {
  if (auth.role === Role.Admin) {
    admin.initAdmin();
  }

  document.documentElement.classList.add('admin');
  document.body.classList.add('admin');

  const viewport = document.querySelector('meta[name="viewport"]');

  const minWidth = 500;
  if (window.innerWidth < minWidth && viewport) {
    const before = viewport.getAttribute('content');
    const scale = window.innerWidth / minWidth;
    viewport.setAttribute('content', `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, user-scalable=1`);
  
    onBeforeUnmount(() => {
      before && viewport?.setAttribute('content', before);
    });
  }

  onBeforeUnmount(() => {
    admin.deinitAdmin();
    document.documentElement.classList.remove('admin');
    document.body.classList.remove('admin');
  });
});

async function logout() {
  auth.logout();
  logoutDialog.value = false;
}
</script>

<style lang="scss" scoped>
@use '@/scss/vars' as *;

.alerts {
  // position: absolute;
  // top: 1rem;
  // right: 1rem;

  // @media screen and (max-width: 768px) {
  position: static;
  margin: 1rem 1rem;
  // }

  &-wrapper {
    z-index: 100;
    position: relative;
  }
}

.title {
  font-family: $fontHeading;
}

.divider {
  font-family: $fontHeading;
  margin: 1.5rem 0 .5rem;

  span {
    padding: 0 .5rem;
  }
}
</style>
