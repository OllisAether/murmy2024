<template>
  <VContainer class="chat-profile">
    <VRow justify="center" class="mb-4">
      <VAvatar size="128" color="grey-lighten-2">
        <VIcon size="80" color="white">mdi-account</VIcon>
      </VAvatar>
    </VRow>
    <VRow justify="center" class="mb-8 name">
      <b>{{ account?.displayname }}</b>
    </VRow>

    <VToolbar color="transparent">
      <VToolbarTitle>
        <b>Über mich</b>
      </VToolbarTitle>
      <VBtn icon disabled>
        <VIcon>mdi-pencil</VIcon>
      </VBtn>
    </VToolbar>
    <VCard color="grey-lighten-4" class="mx-2" flat rounded="lg">
      <VCardText>
        {{ account?.bio ?? 'Nicht angegeben' }}
      </VCardText>
    </VCard>

    <VDivider class="my-8 mx-4" />
    
    <h3 class="px-4">
      Persönliche Informationen
    </h3>

    <VList>
      <VListItem class="mb-4">
        <VListItemTitle><b>Telefonnummer</b></VListItemTitle>
        <VListItemSubtitle>
          <Collectable
            v-if="person?.phone"
            :person="person.id"
            type="basic"
            id="phone"
            :value="person.phone"
          >
            {{ person?.phone }}
          </Collectable>
        </VListItemSubtitle>
      </VListItem>
      <VListItem class="mb-4">
        <VListItemTitle><b>E-Mail</b></VListItemTitle>
        <VListItemSubtitle>
          <Collectable
            v-if="account?.hasEmailLinked && person?.email"
            :person="person.id"
            type="basic"
            id="email"
            :value="person.email"
          >
            {{ person?.email }}
          </Collectable>
          <template v-else>
            Nicht angegeben
          </template>
        </VListItemSubtitle>
      </VListItem>
      <VListItem class="mb-4">
        <VListItemTitle><b>Geburtstag</b></VListItemTitle>
        <VListItemSubtitle>{{
          (account?.hasBirthday && birthday) ?? 'Nicht angegeben'
        }}</VListItemSubtitle>
      </VListItem>

      <VDivider class="mt-4 mb-2 mx-4" />

      <VListItem class="mb-4 text-red" @click="game.logoutChat">
        <VListItemTitle><b>Abmelden</b></VListItemTitle>
      </VListItem>
    </VList>
  </VContainer>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import moment from 'moment';
import { computed } from 'vue';
import Collectable from '@/components/game/Collectable.vue';

const game = useGameManager();

const person = computed(() => account.value
  ? game.getPerson(account.value.personId)
  : undefined);

const account = computed(() => game.currentChatUser
  ? game.getChatAccount(game.currentChatUser)
  : undefined);

const birthday = computed(() => {
  if (!person.value?.birthday) return undefined;

  const date = moment(person.value.birthday, 'YYYY-MM-DD');
  return date.format('DD.MM.YYYY');
})
</script>

<style scoped lang="scss">
.chat-profile {
  :deep(.v-list-item-subtitle) {
    opacity: 1;
    overflow: visible;
  }
}

.name {
  font-size: 2rem;
}
</style>