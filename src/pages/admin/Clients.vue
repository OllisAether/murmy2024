<template>
  <VContainer>
    <VCard>
      <VToolbar>
        <VToolbarTitle>
          <VIcon>mdi-account</VIcon>
          Clients
        </VToolbarTitle>
      </VToolbar>

      <VCardText>
        <VList nav>
          <ClientListItem
            v-if="thisClient"
            :client="thisClient"
          />
          <VDivider>
            Admins
          </VDivider>
          <ClientListItem
            v-for="client in admins"
            :key="client.id"
            :client="client"
          />
          <VListItem
            v-if="admins.length === 0"
            class="text-grey"
          >
            <VListItemTitle>
              Keine Admins
            </VListItemTitle>
          </VListItem>
          <VDivider>
            Board
          </VDivider>
          <ClientListItem
            v-for="client in board"
            :key="client.id"
            :client="client"
          />
          <VListItem
            v-if="board.length === 0"
            class="text-grey"
          >
            <VListItemTitle>
              Kein Board
            </VListItemTitle>
          </VListItem>
          <VDivider>
            Teams
          </VDivider>
          <ClientListItem
            v-for="client in teams"
            :key="client.id"
            :client="client"
          />
          <VListItem
            v-if="teams.length === 0"
            class="text-grey"
          >
            <VListItemTitle>
              Keine Teams
            </VListItemTitle>
          </VListItem>
          <VDivider>
            Unautorisiert
          </VDivider>
          <ClientListItem
            v-for="client in unauthorized"
            :key="client.id"
            :client="client"
          />
          <VListItem
            v-if="unauthorized.length === 0"
            class="text-grey"
          >
            <VListItemTitle>
              Keine unautorisierten Clients
            </VListItemTitle>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Role } from '../../../shared/roles';
import ClientListItem from '../../components/admin/ClientListItem.vue';
import { useAdmin } from '../../store/admin/index';
import { useAuthManager } from '../../store/authManager';

const admin = useAdmin()
const auth = useAuthManager()

const thisClient = computed(() => admin.clients.find(c => c.id === auth.clientId))
const admins = computed(() => admin.clients.filter(c => c.type === Role.Admin && c.id !== auth.clientId))
const board = computed(() => admin.clients.filter(c => c.type === Role.Board))
const teams = computed(() => admin.clients.filter(c => c.type === Role.Team))
const unauthorized = computed(() => admin.clients.filter(c => c.type === Role.Unauthorized))
</script>