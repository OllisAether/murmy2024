<template>
  <ScrollView class="contacts-screen">
    <div class="contacts-screen__list">
      <div
        class="contacts-screen__list__item"
        v-for="(contact, i) in contacts"
        :key="i"
      >
        <div class="contacts-screen__list__item__avatar">
          <img
            v-if="game.getAsset(contacts.find(c => c.number === contact.number)?.avatarAssetId)?.content"
            :src="game.getAsset(contacts.find(c => c.number === contact.number)?.avatarAssetId)?.content"
            alt="avatar"
          />
          <VIcon v-else>mdi-account</VIcon>
        </div>
        <div class="contacts-screen__list__item__info">
          <div class="contacts-screen__list__item__name">
            {{ contacts.find(c => c.number === contact.number)?.name ?? contact.number }}
          </div>
          <div
            v-if="contacts.find(c => c.number === contact.number)?.name"
            class="contacts-screen__list__item__number"
          >
            {{ contact.number }}
          </div>
        </div>
      </div>
    </div>
  </ScrollView>
</template>

<script setup lang="ts">
import { useGameManager } from '@/store/gameManager';
import { contacts } from '../../../../../shared/assets/phone/phoneContacts';
import ScrollView from '../ScrollView.vue';

const game = useGameManager();
</script>

<style lang="scss" scoped>
.contacts-screen {
  height: 100%;

  &__list {
    display: flex;
    flex-direction: column;
    padding-bottom: 50%;

    &__item {
      display: flex;
      align-items: center;
      padding: 5px 5px 5px 10px;
      border-bottom: 1px solid #fff2;
      line-height: 1;

      &__info {
        flex: 1;
      }

      &__name {
        font-size: 10px;
      }

      &__number {
        font-size: 8px;
        color: #777;
      }

      &__avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #6a6a6a;
        overflow: hidden;
        margin-right: 5px;

        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>