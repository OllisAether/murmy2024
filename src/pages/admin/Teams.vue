<template>
  <VContainer>
    <VCard>
      <VToolbar>
        <VToolbarTitle>
          <VIcon>mdi-account-group</VIcon>
          Teams
        </VToolbarTitle>
        <VBtn icon>
          <VIcon>mdi-plus</VIcon>
          
          <VDialog persistent v-model="addTeamDialog" activator="parent" max-width="400">
            <AddTeamCard
              @close="addTeamDialog = false"
              :submit-fn="admin.addTeam"
            />
          </VDialog>
        </VBtn>
      </VToolbar>

      <VCardText>
        <TeamListItem
          v-for="team in admin.teams"
          :key="team.id"
          :team="team"
          :class="{
            'mb-2': team !== admin.teams[admin.teams.length - 1]
          }"
        />
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script lang="ts" setup>
import { useAdmin } from '../../store/admin/index';
import AddTeamCard from '../../components/admin/TeamCard.vue'
import TeamListItem from '../../components/admin/TeamListItem.vue'
import { ref } from 'vue';
import { VIcon } from 'vuetify/components';

const admin = useAdmin()

const addTeamDialog = ref(false)
</script>
