<template>
  <VListItem @click="editDialog = true">
    <VListItemTitle>
      {{ props.client.id }} ({{ userAgent }})
    </VListItemTitle>
    <VListItemSubtitle>
      <template v-if="props.client.type === Role.Admin">
        <VIcon>mdi-account-circle</VIcon>
        Admin
      </template>
      <template v-else-if="props.client.type === Role.Team">
        <VIcon>mdi-account-group</VIcon>
        {{ team?.name ? `${team.name} (${team.id})` : 'Team' }} 
      </template>
      <template v-else-if="props.client.type === Role.Board">
        <VIcon>mdi-television</VIcon>
        Board
      </template>
      <template v-else-if="props.client.type === Role.Unauthorized">
        <VIcon>mdi-account-off</VIcon>
        Unautorisiert
      </template>

      <template v-if="auth.clientId === props.client.id">
        | Du
      </template>
    </VListItemSubtitle>

    <VDialog v-model="editDialog" max-width="400">
      <VCard>
        <VToolbar>
          <VToolbarTitle>
            {{ props.client.id }}
          </VToolbarTitle>
          <VBtn icon @click="editDialog = false">
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </VToolbar>

        <VList nav>
          <VListItem>
            <VListItemTitle>
              ID
            </VListItemTitle>
            <VListItemSubtitle>
              {{ props.client.id }}
            </VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>
              Typ
            </VListItemTitle>
            <VListItemSubtitle>
              <template v-if="props.client.type === Role.Admin">
                <VIcon>mdi-account-circle</VIcon>
                Admin
              </template>
              <template v-else-if="props.client.type === Role.Team">
                <VIcon>mdi-account-group</VIcon>
                {{ team?.name ? `${team.name} (${team.id})` : 'Team' }} 
              </template>
              <template v-else-if="props.client.type === Role.Board">
                <VIcon>mdi-television</VIcon>
                Board
              </template>
              <template v-else-if="props.client.type === Role.Unauthorized">
                <VIcon>mdi-account-off</VIcon>
                Unautorisiert
              </template>
            </VListItemSubtitle>
          </VListItem>
          <VListItem :lines="false">
            <VListItemTitle>
              User-Agent
            </VListItemTitle>
            <VListItemSubtitle>
              {{ props.client.userAgent }}
            </VListItemSubtitle>
          </VListItem>
          <VListItem>
            <VListItemTitle>
              Team
            </VListItemTitle>
            <VListItemSubtitle>
              {{ team?.name ? `${team.name} (${team.id})` : 'Kein Team' }}
            </VListItemSubtitle>
          </VListItem>
        </VList>
        
        <VCardText>
          <VBtn
            class="w-100 mb-2"
            variant="tonal"
            color="error"
            @click="admin.kickClient(props.client.id)"
          >
            Verbindung trennen
          </VBtn>

          <VBtn
            v-if="props.client.type !== Role.Unauthorized"
            class="w-100 mb-2"
            variant="tonal"
            color="error"
            @click="admin.logoutClient(props.client.id)"
          >
            Ausloggen
          </VBtn>

          <VBtn
            v-if="props.client.type === Role.Unauthorized"
            class="w-100 mb-2"
            variant="tonal"
          >
            Autorisieren

            <VDialog
              activator="parent"
              v-model="selectTeamDialog"
              max-width="400"
              scrollable
            >
              <VCard>
                <VToolbar>
                  <VToolbarTitle>
                    Autorisieren
                  </VToolbarTitle>
                  <VBtn icon @click="selectTeamDialog = false">
                    <VIcon>mdi-close</VIcon>
                  </VBtn>
                </VToolbar>
                <VList nav>
                  <VListItem @click="admin.setClientBoard(props.client.id); selectTeamDialog = false">
                    <VListItemTitle>
                      Als Board autorisieren
                    </VListItemTitle>
                  </VListItem>

                  <VDivider>
                    Teams
                  </VDivider>
                  <VListItem
                    v-for="team in admin.teams"
                    :key="team.id"
                    @click="admin.setClientTeam(props.client.id, team.id); selectTeamDialog = false"
                    lines="two"
                  >
                    <VListItemTitle>
                      {{ team.name }}
                    </VListItemTitle>
                    <VListItemSubtitle>
                      ID: {{ team.id }}<br>
                      Code: {{ team.code }}
                    </VListItemSubtitle>
                  </VListItem>
                </VList>
              </VCard>
            </VDialog>
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </VListItem>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useAdmin } from '../../store/admin';
import { Role } from '../../../shared/roles';
import { VIcon } from 'vuetify/components';
import { useAuthManager } from '../../store/authManager';
import UAParser from 'ua-parser-js';
// import ClientCard from './ClientCard.vue';

const editDialog = ref(false);
const selectTeamDialog = ref(false);

const admin = useAdmin();
const auth = useAuthManager();

const props = defineProps<{
  client: {
    id: string
    type: Role
    teamId: string | null
    userAgent: string
  }
}>()

const team = computed(() => admin.teams.find(t => t.id === props.client.teamId));
const userAgent = computed(() => {
  const parser = new UAParser(props.client.userAgent);

  const ua = parser.getResult();

  return `${ua.browser.name} ${ua.browser.version} | ${ua.os.name} ${ua.os.version}`;
})
</script>