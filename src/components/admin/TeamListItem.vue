<template>
  <VListItem @click="editDialog = true">
    <VListItemTitle>
      {{ team.name }} ({{ team.id }})
    </VListItemTitle>
    <VListSubheader>
      Code: {{ team.code }}
    </VListSubheader>

    <VDialog v-model="editDialog" max-width="400" persistent>
      <TeamCard
        :team="{
          id: team.id,
          name: name,
          code: code
        }"
        :submit-fn="admin.editTeam"
        @close="editDialog = false"
        @remove="admin.removeTeam(team.id); editDialog = false"
      />
    </VDialog>
  </VListItem>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAdmin } from '../../store/admin';
import TeamCard from './TeamCard.vue';

const props = defineProps<{
  team: {
    name: string
    id: string
    code: string
  }
}>()

const admin = useAdmin()

const name = ref(props.team.name)
const code = ref(props.team.code)

const editDialog = ref(false)
</script>
