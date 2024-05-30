<template>
  <VContainer>
    <VRow>
      <VCol :cols="12" :md="4">
        <VCard class="mb-4">
          <VToolbar>
            <VToolbarTitle>
              <VIcon>mdi-account-question</VIcon>
              Hilfe anfragen
            </VToolbarTitle>

            <VBadge
              class="mr-2"
              v-if="admin.needsHelp.length > 0"
              :content="admin.needsHelp.length"
              color="error"
              inline
            />
          </VToolbar>

          <VList nav>
            <VListItem
              v-if="admin.needsHelp.length === 0"
            >
              <VListItemTitle>
                Keine Hilfe anfragen
              </VListItemTitle>
            </VListItem>

            <VListItem
              v-for="help in admin.needsHelp"
              :key="help"
            >
              <VListItemTitle>
                {{ admin.teams.find(t => t.id === help)?.name }} ({{ help }})
              </VListItemTitle>
              <template #append>
                <VBtn
                  @click="admin.removeHelpRequest(help)"
                  icon
                  size="30"
                  variant="text"
                >
                  <VIcon>
                    mdi-check
                  </VIcon>
                </VBtn>
              </template>
            </VListItem>
          </VList>
        </VCard>
        <VCard>
          <VToolbar>
            <VToolbarTitle>
              <VIcon>mdi-account-group</VIcon>
              Teams
            </VToolbarTitle>
          </VToolbar>
  
          <VList nav>
            <VListItem
              v-if="admin.teams.length === 0"
            >
              <VListItemTitle>
                Keine Teams
              </VListItemTitle>
            </VListItem>
  
            <VListItem
              v-for="team in admin.teams"
              :key="team.id"
            >
              <VListItemTitle>
                {{ team.name }} ({{ team.id }})
              </VListItemTitle>
  
              <template #append>
                <VBadge
                  v-if="admin.clients.find(c => c.teamId === team.id)"
                  icon="mdi-check"
                  inline
                  color="success"
                />
              </template>
            </VListItem>
          </VList>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts" setup>
import { useAdmin } from '../../store/admin';

const admin = useAdmin()
</script>