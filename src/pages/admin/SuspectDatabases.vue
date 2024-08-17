<template>
  <VContainer>
    <TeamDatabase
      v-for="team in admin.teams" :class="{
        'mb-4': team !== admin.teams[admin.teams.length - 1]
      }"
      :key="team.id"
      :team="team"
    />
  </VContainer>
</template>

<script lang="ts" setup>
import TeamDatabase from '@/components/admin/TeamDatabase.vue';
import { useAdmin } from '@/store/admin';

const admin = useAdmin();
</script>