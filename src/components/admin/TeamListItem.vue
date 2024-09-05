<template>
  <VCard @click="editDialog = true" flat color="background">
    <VCardTitle>
      {{ team.name }}
    </VCardTitle>
    <VCardText>
      <div>
        <VChip>
          ID:
          {{ team.id }}
        </VChip>

        <VChip class="ml-2">
          Code:
          {{ team.code }}
        </VChip>

        <VChip
          v-if="!team.active"
          class="ml-2"
        >
          Passiv
        </VChip>
      </div>

      <div v-if="Object.keys(team.meta).length" class="mt-4">
        <h2>
          Meta
        </h2>
        <VChip
          v-for="(value, key) in team.meta"
          :key="key"
          class="mr-2"
        >
          {{ key }}: {{ value }}
        </VChip>
      </div>
    </VCardText>

    <VDialog v-model="editDialog" max-width="400" persistent>
      <TeamCard
        :team="{
          id: team.id,
          name: name,
          code: code,
          active: active,
          meta: meta
        }"
        :submit-fn="admin.editTeam"
        @close="editDialog = false"
        @remove="admin.removeTeam(team.id); editDialog = false"
      />
    </VDialog>
  </VCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAdmin } from '../../store/admin/index';
import TeamCard from './TeamCard.vue';
import { JsonMap } from '../../../shared/json';

const props = defineProps<{
  team: {
    name: string
    id: string
    code: string
    active: boolean
    meta: JsonMap
  }
}>()

const admin = useAdmin()

const name = ref(props.team.name)
const code = ref(props.team.code)
const active = ref(props.team.active)
const meta = ref(props.team.meta)

const editDialog = ref(false)
</script>